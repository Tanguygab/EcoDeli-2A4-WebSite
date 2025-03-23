import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import { Link } from "react-router-dom";
import BackOfficeHome from "./components/backofficehome";
import GestionCommercants from "./components/backoffice/GestionCommercants";
import GestionContrats from "./components/backoffice/GestionContrats";
import GestionLivreurs from "./components/backoffice/GestionLivreurs";
import GestionPrestataires from "./components/backoffice/GestionPrestataires";
import GestionLivraisons from "./components/backoffice/GestionLivraisons";
import GestionPrestations from "./components/backoffice/GestionPrestations";
import SuiviPrestations from "./components/backoffice/SuiviPrestations";
import GestionPaiements from "./components/backoffice/GestionPaiements";
import GestionFactures from "./components/backoffice/GestionFactures";
import GestionFinancier from "./components/backoffice/GestionFinanciere";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/backoffice" element={<BackOfficeHome />} />
          <Route path="/backoffice/gestion-commercants" element={<GestionCommercants />} />
          <Route path="/backoffice/gestion-contrats" element={<GestionContrats />} />
          <Route path="/backoffice/gestion-livreurs" element={<GestionLivreurs />} />
          <Route path="/backoffice/gestion-prestataires" element={<GestionPrestataires />} />
          <Route path="/backoffice/gestion-livraisons" element={<GestionLivraisons />} />
          <Route path="/backoffice/gestion-prestations" element={<GestionPrestations />} />
          <Route path="/backoffice/suivi-prestations" element={<SuiviPrestations />} />
          <Route path="/backoffice/gestion-paiements" element={<GestionPaiements />} />
          <Route path="/backoffice/gestion-factures" element={<GestionFactures />} />
          <Route path="/backoffice/gestion-financiere" element={<GestionFinancier />} />
      </Routes>
    </Router>
  );
}

export default App;
