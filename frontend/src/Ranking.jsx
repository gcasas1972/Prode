import React, { useState, useEffect } from 'react';
import { usersAPI } from './api';
import './Ranking.css';

export function Ranking() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      const response = await usersAPI.getRanking();
      setUsers(response.data);
    } catch (err) {
      console.error('Error al cargar ranking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Cargando ranking...</p></div>;

  return (
    <div className="container">
      <h2>🏆 Ranking de Jugadores</h2>
      <div className="ranking-table">
        <table>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Usuario</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={index < 3 ? 'top-' + (index + 1) : ''}>
                <td className="position">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && (index + 1)}
                </td>
                <td>{user.username}</td>
                <td className="points">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
