import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import Card from "./components/Crad";
import Footer from "./components/Fotter";

function App() {
  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <Navbar />
      <Hero />
      <Card />
      <Footer />
    </div>
  );
}

export default App;
