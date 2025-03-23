import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import BackNavbar from "../backnavbar";
import "../../style/backtab.css";

const GestionFacture = () => {
  const [search, setSearch] = useState("");
  const [factures, setFactures] = useState([
    { id: 1, date: "2024-03-15", prix: "150€", filepath: "facture1.pdf" },
    { id: 2, date: "2024-02-10", prix: "200€", filepath: "facture2.pdf" },
  ]);

  const handleDelete = (id) => {
    setFactures(factures.filter((f) => f.id !== id));
  };

  return (
    <div>
      <BackNavbar />
      <div className="container">
        <h2>Gestion des Factures</h2>
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
              <th>Date</th>
              <th>Prix</th>
              <th>Fichier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {factures
              .filter((f) => f.date.includes(search))
              .map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.date}</td>
                  <td>{f.prix}</td>
                  <td><a href={`/${f.filepath}`} target="_blank" rel="noopener noreferrer">Voir</a></td>
                  <td>
                    <FaEdit className="icon edit" />
                    <FaTrash className="icon delete" onClick={() => handleDelete(f.id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionFacture;
