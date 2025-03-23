import { Routes, Route } from "react-router-dom";
import BackNavbar from "./backnavbar";
import GestionCommercants from "./backoffice/GestionCommercants";
import GestionContrats from "./backoffice/GestionContrats";
import GestionLivreurs from "./backoffice/GestionLivreurs";
import GestionPrestataires from "./backoffice/GestionPrestataires";
import GestionLivraisons from "./backoffice/GestionLivraisons";
import GestionPrestations from "./backoffice/GestionPrestations";
import SuiviPrestations from "./backoffice/SuiviPrestations";
import GestionPaiements from "./backoffice/GestionPaiements";
import GestionFactures from "./backoffice/GestionFactures";
import GestionFinanciere from "./backoffice/GestionFinanciere";

function BackofficeHome() {
  return (
    <div>
      <BackNavbar />
      <div className="container">
      <Routes>
          <Route path="gestion-commercants" element={<GestionCommercants />} />
          <Route path="gestion-contrats" element={<GestionContrats />} />
          <Route path="gestion-livreurs" element={<GestionLivreurs />} />
          <Route path="gestion-prestataires" element={<GestionPrestataires />} />
          <Route path="gestion-livraisons" element={<GestionLivraisons />} />
          <Route path="gestion-prestations" element={<GestionPrestations />} />
          <Route path="suivi-prestations" element={<SuiviPrestations />} />
          <Route path="gestion-paiements" element={<GestionPaiements />} />
          <Route path="gestion-factures" element={<GestionFactures />} />
          <Route path="gestion-financiere" element={<GestionFinanciere />} />
        </Routes>
      </div>
    </div>
  );
}

export default BackofficeHome;
