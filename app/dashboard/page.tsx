import Documents from "@/components/Documents";
import { buildFirebaseJson } from "@/lib/firebaseJsonBuilder";
import { FileText } from "lucide-react";

const credentials = buildFirebaseJson();
console.log("Generated Firebase Credentials:", credentials);
function Dashboard() {
  return (
    <div className="mx-auto size-full max-w-7xl overflow-y-auto rounded-xl bg-white shadow-lg">
      <div className="flex items-center gap-3 rounded-t-xl bg-gray-50 p-6">
        <FileText className="size-6 text-blue-800" />
        <h1 className="text-3xl font-semibold text-blue-800">My Documents</h1>
      </div>
      <div className="p-6">
        <Documents />
      </div>
    </div>
  );
}

export default Dashboard;
