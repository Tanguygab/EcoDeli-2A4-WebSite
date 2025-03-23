import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import BackNavbar from "../backnavbar";
import "../../style/backtab.css";

const GestionLivraison = () => {
  const [search, setSearch] = useState("");
  const [livraisons, setLivraisons] = useState([
    { id: 1, latitude: "48.8566", longitude: "2.3522", status: "En cours" },
    { id: 2, latitude: "45.7640", longitude: "4.8357", status: "Livré" },
  ]);

  const handleDelete = (id) => {
    setLivraisons(livraisons.filter((l) => l.id !== id));
  };

  return (
    <div>
      <BackNavbar />
      <div className="container">
        <h2>Gestion des Livraisons</h2>
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
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {livraisons
              .filter((l) => l.status.toLowerCase().includes(search.toLowerCase()))
              .map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.latitude}</td>
                  <td>{l.longitude}</td>
                  <td>{l.status}</td>
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

export default GestionLivraison;
