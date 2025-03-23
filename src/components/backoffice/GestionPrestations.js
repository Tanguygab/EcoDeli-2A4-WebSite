import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import BackNavbar from "../backnavbar";
import "../../style/backtab.css";

const GestionPrestations = () => {
  const [search, setSearch] = useState("");
  const [prestations, setPrestations] = useState([
    { id: 1, service: "Nettoyage", client: "Jean Dupont", status: "Terminé" },
    { id: 2, service: "Livraison", client: "Marie Curie", status: "En cours" },
  ]);

  const handleDelete = (id) => {
    setPrestations(prestations.filter((p) => p.id !== id));
  };

  return (
    <div>
      <BackNavbar />
      <div className="container">
        <h2>Gestion des Prestations</h2>
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
              <th>Service</th>
              <th>Client</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prestations
              .filter((p) => p.service.toLowerCase().includes(search.toLowerCase()))
              .map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.service}</td>
                  <td>{p.client}</td>
                  <td>{p.status}</td>
                  <td>
                    <FaEdit className="icon edit" />
                    <FaTrash className="icon delete" onClick={() => handleDelete(p.id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionPrestations;
