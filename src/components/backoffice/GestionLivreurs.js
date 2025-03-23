import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import BackNavbar from "../backnavbar";
import "../../style/backtab.css";

const GestionLivreurs = () => {
  const [search, setSearch] = useState("");
  const [livreurs, setLivreurs] = useState([
    { id: 1, name: "Livreur 1", email: "livreur1@mail.com", phone: "0600000001" },
    { id: 2, name: "Livreur 2", email: "livreur2@mail.com", phone: "0600000002" },
  ]);

  const handleDelete = (id) => {
    setLivreurs(livreurs.filter((l) => l.id !== id));
  };

  return (
    <div>
      <BackNavbar />
      <div className="container">
        <h2>Gestion des Livreurs</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-button">
            <FaPlus /> Ajouter
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {livreurs
              .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
              .map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.name}</td>
                  <td>{l.email}</td>
                  <td>{l.phone}</td>
                  <td>
                    <FaEdit className="icon edit" />
                    <FaTrash className="icon delete" onClick={() => handleDelete(l.id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionLivreurs;