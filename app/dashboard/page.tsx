import Documents from "@/components/Documents";

function Dashboard() {
  return (
    <div className=" mx-auto size-full max-w-7xl overflow-y-auto">
      <h1 className="bg-gray-100 p-5 text-3xl font-extralight text-indigo-600">
        My Documents
      </h1>
      <Documents />
    </div>
  );
}

export default Dashboard;
