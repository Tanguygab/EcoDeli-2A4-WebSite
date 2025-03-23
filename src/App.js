import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import { Link } from "react-router-dom";
import BackOfficeHome from "./components/backofficehome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />} />

        <Route path="/backoffice" element={<BackOfficeHome />} />
      </Routes>
    </Router>
  );
}

export default App;
