import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import BackNavbar from "../backnavbar";
import "../../style/backtab.css";

const GestionPaiement = () => {
  const [search, setSearch] = useState("");
  const [paiements, setPaiements] = useState([
    { id: 1, date: "2024-03-10", montant: "100€", status: "Effectué" },
    { id: 2, date: "2024-02-25", montant: "250€", status: "En attente" },
  ]);

  const handleDelete = (id) => {
    setPaiements(paiements.filter((p) => p.id !== id));
  };

  return (
    <div>
      <BackNavbar />
      <div className="container">
        <h2>Gestion des Paiements</h2>
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
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paiements
              .filter((p) => p.status.toLowerCase().includes(search.toLowerCase()))
              .map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.date}</td>
                  <td>{p.montant}</td>
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

export default GestionPaiement;
