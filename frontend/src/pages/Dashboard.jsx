import Shortener from "../components/Shortener";
import History from "../components/History";

function Dashboard() {
  return (
    <div className="mt-20 text-center">
      <h1 className="text-3xl font-bold">Welcome 🎉</h1>
      <Shortener />
      <History />
    </div>
  );
}

export default Dashboard;
