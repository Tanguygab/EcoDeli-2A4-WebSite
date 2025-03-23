import { useState } from "react";
import { Link } from "react-router-dom";
import logow from "../asset/logow.png"; // Import correct

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/backoffice"><a className="navbar-item"><img src={logow} alt="Logo"/></a></Link>

        {/* Bouton burger */}
        <a
          role="button"
          className={`navbar-burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded={isActive}
          onClick={() => setIsActive(!isActive)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      {/* Menu */}
      <div className={`navbar-menu ${isActive ? "is-active" : ""}`} id="navbarBasicExample">
        <div className="navbar-start">

          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" href=""> Gestion </a>
            <div className="navbar-dropdown is-boxed">
              <a className="navbar-item" href=""> Gestion des commerçants </a>
              <a className="navbar-item" href=""> Gestion des contrats </a>
              <a className="navbar-item" href=""> Gestion des livreurs </a>
              <a className="navbar-item" href=""> Gestion des prestataires </a>
              <a className="navbar-item" href=""> Gestion des livraisons </a>
            </div>
          </div>
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" href=""> Prestation </a>
            <div className="navbar-dropdown is-boxed">
              <a className="navbar-item" href=""> Gestion des prestations </a>
              <a className="navbar-item" href=""> Suivi des prestations </a>
            </div>
          </div>
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" href=""> Finance </a>
            <div className="navbar-dropdown is-boxed">
              <a className="navbar-item" href=""> Gestion des paiments </a>
              <a className="navbar-item" href=""> Gestion des factures </a>
              <hr className="navbar-divider"></hr>
              <a className="navbar-item" href=""> Gestion financière </a>
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-primary">
                <strong>S'inscrire</strong>
              </a>
              <a className="button is-light">Se connecter</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
