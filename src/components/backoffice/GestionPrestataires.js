import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import BackNavbar from "../backnavbar";
import "../../style/backtab.css";

const GestionPrestataires = () => {
  const [search, setSearch] = useState("");
  const [prestataires, setPrestataires] = useState([
    { id: 1, name: "Prestataire 1", email: "presta1@mail.com", phone: "0612345678" },
    { id: 2, name: "Prestataire 2", email: "presta2@mail.com", phone: "0698765432" },
  ]);

  const handleDelete = (id) => {
    setPrestataires(prestataires.filter((p) => p.id !== id));
  };

  return (
    <div>
      <BackNavbar />
      <div className="container">
        <h2>Gestion des Prestataires</h2>
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
            {prestataires
              .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
              .map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
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

export default GestionPrestataires;