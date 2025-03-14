import { useState } from "react";

const BackNavbar = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item">Ecodeli G1</a>

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
          <a className="navbar-item">Documentation</a>

          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" href=""> DropDown </a>
            <div className="navbar-dropdown is-boxed">
              <a className="navbar-item" href=""> Button 1 </a>
              <a className="navbar-item" href=""> Button2 </a>
              <hr className="navbar-divider"></hr>
              <a className="navbar-item" href=""> Button 3 </a>
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

export default BackNavbar;
