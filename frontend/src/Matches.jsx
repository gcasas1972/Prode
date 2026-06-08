import React, { useState, useEffect } from 'react';
import { matchesAPI, predictionsAPI } from './api';
import './Matches.css';

export function Matches({ userId }) {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
    if (userId) loadPredictions();
  }, [userId]);

  const loadMatches = async () => {
    try {
      const response = await matchesAPI.getAll();
      setMatches(response.data);
    } catch (err) {
      setError('Error al cargar partidos');
    } finally {
      setLoading(false);
    }
  };

  const loadPredictions = async () => {
    try {
      const response = await predictionsAPI.getUserPredictions(userId);
      const preds = {};
      response.data.forEach(pred => {
        preds[pred.match_id] = {
          outcome: pred.predicted_outcome || (pred.predicted_team1 > pred.predicted_team2 ? 'home' : (pred.predicted_team1 < pred.predicted_team2 ? 'away' : 'draw')),
          id: pred.id
        };
      });
      setPredictions(preds);
    } catch (err) {
      console.error('Error al cargar predicciones');
    }
  };

  const handlePredictionChange = (matchId, outcome) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        outcome
      }
    }));
  };

  const handleSavePrediction = async (matchId) => {
    try {
      const pred = predictions[matchId];
      if (!pred || !pred.outcome) {
        alert('Por favor selecciona Local, Empate o Visitante');
        return;
      }

      if (pred.id) {
        await predictionsAPI.update(pred.id, {
          predicted_outcome: pred.outcome
        });
      } else {
        await predictionsAPI.add({
          user_id: userId,
          match_id: matchId,
          predicted_outcome: pred.outcome
        });
      }
      alert('¡Pronóstico guardado!');
      loadPredictions();
    } catch (err) {
      const backendMessage = err?.response?.data?.error || err?.message || 'Error al guardar pronóstico';
      alert(`Error al guardar pronóstico: ${backendMessage}`);
    }
  };

  if (loading) return <div className="container"><p>Cargando partidos...</p></div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h2>Partidos del Mundial</h2>
      <div className="matches-grid">
        {matches.map(match => (
          <div key={match.id} className="match-card">
            <div className="match-date">{new Date(match.date).toLocaleDateString()}</div>
            <div className="match-teams">
              <span className="team">{match.team1}</span>
              <span className="vs">vs</span>
              <span className="team">{match.team2}</span>
            </div>
            {match.status === 'completed' && (
              <div className="match-result">
                {match.result_team1} - {match.result_team2}
              </div>
            )}
                  {match.status === 'pending' && userId && (
                    <div className="prediction-form outcome-form">
                      <select
                        value={predictions[match.id]?.outcome || ''}
                        onChange={(e) => handlePredictionChange(match.id, e.target.value)}
                      >
                        <option value="">Selecciona resultado</option>
                        <option value="home">Local</option>
                        <option value="draw">Empate</option>
                        <option value="away">Visitante</option>
                      </select>
                      <button onClick={() => handleSavePrediction(match.id)}>
                        {predictions[match.id]?.id ? 'Actualizar' : 'Guardar'}
                      </button>
                    </div>
                  )}
          </div>
        ))}
      </div>
    </div>
  );
}
