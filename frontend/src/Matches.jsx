import React, { useState, useEffect } from 'react';
import { matchesAPI, predictionsAPI } from './api';
import './Matches.css';

export function Matches({ user }) {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [resultInputs, setResultInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
    if (user && user.role !== 'admin') loadPredictions();
  }, [user]);

  const loadMatches = async () => {
    try {
      const response = await matchesAPI.getAll();
      setMatches(response.data);

      if (user?.role === 'admin') {
        const inputs = {};
        response.data.forEach((match) => {
          inputs[match.id] = {
            result_team1: match.result_team1 ?? '',
            result_team2: match.result_team2 ?? '',
            status: match.status || 'pending'
          };
        });
        setResultInputs(inputs);
      }
    } catch (err) {
      setError('Error al cargar partidos');
    } finally {
      setLoading(false);
    }
  };

  const loadPredictions = async () => {
    try {
      const response = await predictionsAPI.getUserPredictions(user.id);
      const preds = {};
      response.data.forEach((pred) => {
        preds[pred.match_id] = {
          outcome:
            pred.predicted_outcome ||
            (pred.predicted_team1 > pred.predicted_team2
              ? 'home'
              : pred.predicted_team1 < pred.predicted_team2
              ? 'away'
              : 'draw'),
          id: pred.id
        };
      });
      setPredictions(preds);
    } catch (err) {
      console.error('Error al cargar predicciones');
    }
  };

  const handlePredictionChange = (matchId, outcome) => {
    setPredictions((prev) => ({
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
          user_id: user.id,
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

  const handleResultChange = (matchId, field, value) => {
    setResultInputs((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }));
  };

  const handleSaveResult = async (matchId) => {
    try {
      const result = resultInputs[matchId];
      if (!result) return;

      if (result.result_team1 === '' || result.result_team2 === '') {
        alert('Ingrese ambos goles para guardar el resultado');
        return;
      }

      await matchesAPI.update(matchId, {
        result_team1: Number(result.result_team1),
        result_team2: Number(result.result_team2),
        status: result.status || 'completed'
      });

      alert('¡Resultado guardado!');
      loadMatches();
    } catch (err) {
      const backendMessage = err?.response?.data?.error || err?.message || 'Error al guardar resultado';
      alert(`Error al guardar resultado: ${backendMessage}`);
    }
  };

  if (loading) return <div className="container"><p>Cargando partidos...</p></div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h2>Partidos del Mundial</h2>
      <div className="matches-grid">
        {matches.map((match) => (
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

            {user?.role !== 'admin' && match.status === 'pending' && (
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

            {user?.role === 'admin' && (
              <div className="admin-result-form">
                <h4>Registrar resultado</h4>
                <div className="result-inputs">
                  <input
                    type="number"
                    min="0"
                    value={resultInputs[match.id]?.result_team1 ?? ''}
                    onChange={(e) => handleResultChange(match.id, 'result_team1', e.target.value)}
                    placeholder={`${match.team1} goles`}
                  />
                  <input
                    type="number"
                    min="0"
                    value={resultInputs[match.id]?.result_team2 ?? ''}
                    onChange={(e) => handleResultChange(match.id, 'result_team2', e.target.value)}
                    placeholder={`${match.team2} goles`}
                  />
                </div>
                <select
                  value={resultInputs[match.id]?.status || 'pending'}
                  onChange={(e) => handleResultChange(match.id, 'status', e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="completed">Completado</option>
                </select>
                <button onClick={() => handleSaveResult(match.id)}>
                  Guardar resultado
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
