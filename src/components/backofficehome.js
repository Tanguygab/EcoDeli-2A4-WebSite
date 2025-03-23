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
      </div>
    </div>
  );
}

export default BackofficeHome;
