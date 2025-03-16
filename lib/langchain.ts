import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// import { createStuffDocumentsChain } from "@langchain/chains/combine_documents";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
// import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
});

export const indexName = "tapiwae";

async function fetMessagesFromDatabase(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  console.log("Fetching chat history from the firestore database...");
  // const LIMIT = 10;
  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "asc")
    // .limit(LIMIT)
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );
  console.log(`Fetched last ${chatHistory.length} messages successfully`);

  console.log(chatHistory.map((msg) => msg.content.toString()));
  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not found");
  }

  console.log("Fetching the url from firebase ...");
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;
  if (!downloadUrl) {
    throw new Error("Download Url not found");
  }

  console.log(`download url fetched successfully : ${downloadUrl}------`);

  const response = await fetch(downloadUrl);

  const data = await response.blob();

  console.log("Loading pdf document");
  const loader = new PDFLoader(data);
  const docs = await loader.load();
  // split document into smaller chunks
  console.log("Splitting the document into smaller parts");

  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);

  console.log(`Split into ${splitDocs.length} parts ---- `);

  return splitDocs;
}

export async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value provided");
  const { namespaces } = await index.describeIndexStats();

  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }
  let pineconeVectorStore;

  // Generate embeddings (numerical representation for the split documents)
  console.log("--- Generating embedings ----");
  const embeddings = new OpenAIEmbeddings();
  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `Namespace ${docId} already exists , reusing existing embedings`
    );
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });
    return pineconeVectorStore;
  } else {
    // if the snamespace does not exist download the pdf from firestorm  via the store
    const splitDocs = await generateDocs(docId);

    console.log(
      `Storing the emedings in namespace ${docId} in the ${indexName} Pinecone vector store ...----`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectorStore;
  }
}

const generateLangchainCompletion = async (docId: string, question: string) => {
  const pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(
    docId
  );

  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not found");
  }
  console.log("Creating a retriever ");

  // Create a retriever to search through the vector store
  const retriever = pineconeVectorStore.asRetriever();

  // Fetch the chat history from the database
  const chatHistory = await fetMessagesFromDatabase(docId);

  // Define a prompt template for generating search queries based on conversation history

  console.log("Defining a prompt template");

  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory,
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);

  // Chreate a history aware retrierver chain that uses the model , retriever and the prompt
  console.log("Creating a history-aware retriever chain");
  const historyAwareRetriverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });
  // One of these can be removed
  // Define a prompt template for answering questions based on retrieved context
  console.log("Defining a prompt template for answering questions");
  const historyAwareRetrieverPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Your name is Maita the assistant. You are a she.Ensure you highlight key details in your answers,by making text bold where necessary. Keep the responses engaging by adding relevant emojis where necessary based on the tone of the questions. Keep your responses engagingAnswer the user's questions based on the below context:\n\n{context}",
    ],
    ...chatHistory,
    ["user", "{input}"],
  ]);
  // Create a document combining chain
  console.log("Creating a document combining chain");
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrieverPrompt,
  });
  // Create the main retrival chain that conbines the history-aware retriever and document conbining chains
  console.log("Creating the main retrieval chain..");
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetriverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });
  console.log("Running the chain with a sample conversation...");

  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });
  console.log(reply.answer);
  return reply.answer;
};

export { model, generateLangchainCompletion };
