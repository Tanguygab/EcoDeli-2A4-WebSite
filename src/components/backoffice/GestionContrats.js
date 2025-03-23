import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import BackNavbar from "../backnavbar";
import "../../style/backtab.css";

const GestionContrats = () => {
  const [search, setSearch] = useState("");
  const [contrats, setContrats] = useState([
    { id: 1, name: "Contrat 1", startDate: "2024-01-01", endDate: "2024-12-31", file: "contrat1.pdf" },
    { id: 2, name: "Contrat 2", startDate: "2024-02-01", endDate: "2024-11-30", file: "contrat2.pdf" },
  ]);

  const handleDelete = (id) => {
    setContrats(contrats.filter((c) => c.id !== id));
  };

  return (
    <div>
      <BackNavbar />
      <div className="container">
        <h2>Gestion des Contrats</h2>
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
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>Fichier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contrats
              .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
              .map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.startDate}</td>
                  <td>{c.endDate}</td>
                  <td>{c.file}</td>
                  <td>
                    <FaEdit className="icon edit" />
                    <FaTrash className="icon delete" onClick={() => handleDelete(c.id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionContrats;