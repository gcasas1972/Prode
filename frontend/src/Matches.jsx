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
          team1: pred.predicted_team1,
          team2: pred.predicted_team2,
          id: pred.id
        };
      });
      setPredictions(preds);
    } catch (err) {
      console.error('Error al cargar predicciones');
    }
  };

  const handlePredictionChange = (matchId, field, value) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: parseInt(value)
      }
    }));
  };

  const handleSavePrediction = async (matchId) => {
    try {
      const pred = predictions[matchId];
      if (!pred || pred.team1 === undefined || pred.team2 === undefined) {
        alert('Por favor completa tu pronóstico');
        return;
      }

      if (pred.id) {
        await predictionsAPI.update(pred.id, {
          predicted_team1: pred.team1,
          predicted_team2: pred.team2
        });
      } else {
        await predictionsAPI.add({
          user_id: userId,
          match_id: matchId,
          predicted_team1: pred.team1,
          predicted_team2: pred.team2
        });
      }
      alert('¡Pronóstico guardado!');
      loadPredictions();
    } catch (err) {
      alert('Error al guardar pronóstico');
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
              <div className="prediction-form">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={predictions[match.id]?.team1 || ''}
                  onChange={(e) => handlePredictionChange(match.id, 'team1', e.target.value)}
                  placeholder="Goles"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={predictions[match.id]?.team2 || ''}
                  onChange={(e) => handlePredictionChange(match.id, 'team2', e.target.value)}
                  placeholder="Goles"
                />
                <button onClick={() => handleSavePrediction(match.id)}>Guardar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
