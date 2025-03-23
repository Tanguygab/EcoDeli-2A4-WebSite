import { useState } from "react";
import { Link } from "react-router-dom";
import logow from "../asset/logow.png"; // Import correct

const BackNavbar = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <img src={logow} alt="Logo" />
        </Link>

        {/* Bouton burger */}
        <button
          className={`navbar-burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded={isActive}
          onClick={() => setIsActive(!isActive)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      {/* Menu */}
      <div className={`navbar-menu ${isActive ? "is-active" : ""}`} id="navbarBasicExample">
        <div className="navbar-start">

          {/* Gestion */}
          <div className="navbar-item has-dropdown is-hoverable">
            <span className="navbar-link">Gestion</span>
            <div className="navbar-dropdown is-boxed">
              <Link className="navbar-item" to="/backoffice/gestion-commercants">Gestion des commerçants</Link>
              <Link className="navbar-item" to="/backoffice/gestion-contrats">Gestion des contrats</Link>
              <Link className="navbar-item" to="/backoffice/gestion-livreurs">Gestion des livreurs</Link>
              <Link className="navbar-item" to="/backoffice/gestion-prestataires">Gestion des prestataires</Link>
              <Link className="navbar-item" to="/backoffice/gestion-livraisons">Gestion des livraisons</Link>
            </div>
          </div>

          {/* Prestation */}
          <div className="navbar-item has-dropdown is-hoverable">
            <span className="navbar-link">Prestation</span>
            <div className="navbar-dropdown is-boxed">
              <Link className="navbar-item" to="/backoffice/gestion-prestations">Gestion des prestations</Link>
              <Link className="navbar-item" to="/backoffice/suivi-prestations">Suivi des prestations</Link>
            </div>
          </div>

          {/* Finance */}
          <div className="navbar-item has-dropdown is-hoverable">
            <span className="navbar-link">Finance</span>
            <div className="navbar-dropdown is-boxed">
              <Link className="navbar-item" to="/backoffice/gestion-paiements">Gestion des paiements</Link>
              <Link className="navbar-item" to="/backoffice/gestion-factures">Gestion des factures</Link>
              <hr className="navbar-divider" />
              <Link className="navbar-item" to="/backoffice/gestion-financiere">Gestion financière</Link>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default BackNavbar;
