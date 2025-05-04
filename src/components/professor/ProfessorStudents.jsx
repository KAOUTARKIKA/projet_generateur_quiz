import React, { useState, useEffect } from 'react';

const ProfessorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Simuler une API pour récupérer les étudiants
  useEffect(() => {
    setTimeout(() => {
      const mockStudents = [
        { id: 1, name: 'Alice Dupont', email: 'alice@example.com', registeredAt: '2025-04-20' },
        { id: 2, name: 'Bob Martin', email: 'bob@example.com', registeredAt: '2025-04-18' },
        { id: 3, name: 'Charlie Durand', email: 'charlie@example.com', registeredAt: '2025-04-15' },
        { id: 4, name: 'Diane Leroy', email: 'diane@example.com', registeredAt: '2025-04-10' },
        { id: 5, name: 'Émile Bernard', email: 'emile@example.com', registeredAt: '2025-04-05' },
      ];
      setStudents(mockStudents);
      setLoading(false);
    }, 800);
  }, []);

  // Filtrer les étudiants par recherche
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-area">
      <div className="header-actions">
        <h1>Gestion des Étudiants</h1>
      </div>

      <div className="filters mt-4">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Chargement des étudiants...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="no-results">
          <p>Aucun étudiant ne correspond à vos critères.</p>
        </div>
      ) : (
        <div className="table-container mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Date d'inscription</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.registeredAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfessorStudents;