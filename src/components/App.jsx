import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [{ name: '', score: '', total: 0, history: [], atuu: false }];
  });

  const [modalIndex, setModalIndex] = useState(null); // Stochează indexul jucătorului pentru care deschidem modalul

  // Salvăm jucătorii în localStorage la fiecare actualizare
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const handleNameChange = (index, event) => {
    const newPlayers = [...players];
    newPlayers[index].name = event.target.value;
    setPlayers(newPlayers);
  };

  const handleScoreChange = (index, event) => {
    const newPlayers = [...players];
    newPlayers[index].score = event.target.value;
    setPlayers(newPlayers);
  };

  const handleAddScore = (index) => {
    const newPlayers = [...players];
    let scoreToAdd = parseInt(newPlayers[index].score, 10);

    if (isNaN(scoreToAdd)) {
      scoreToAdd = 0; // Dacă scorul este nevalid, îl setăm la 0
    }

    newPlayers[index].total += scoreToAdd;
    newPlayers[index].history.push({ score: scoreToAdd, atuu: newPlayers[index].atuu }); // Adăugăm scorul în istoric
    newPlayers[index].score = ''; // Resetăm inputul
    newPlayers[index].atuu = false; // Resetăm atuu după adăugare
    setPlayers(newPlayers);
  };

  const handleRestore = (index) => {
    const newPlayers = [...players];
    if (newPlayers[index].history.length > 0) {
      const lastEntry = newPlayers[index].history.pop(); // Scoatem ultimul scor din istoric
      newPlayers[index].total -= lastEntry.score; // Scădem scorul din total
      newPlayers[index].score = lastEntry.score.toString(); // Punem ultimul scor înapoi în input
      setPlayers(newPlayers);
    }
  };

  const handleAtuu = (index) => {
    const newPlayers = [...players];
    newPlayers[index].atuu = true; // Marcăm atuu ca activ
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setPlayers([...players, { name: '', score: '', total: 0, history: [], atuu: false }]);
  };

  const clearAll = () => {
    setPlayers([{ name: '', score: '', total: 0, history: [], atuu: false }]); // Resetăm lista de jucători
    localStorage.removeItem('players'); // Ștergem din localStorage
  };

  const openModal = (index) => {
    setModalIndex(index); // Setăm indexul jucătorului pentru care deschidem modalul
  };

  const closeModal = () => {
    setModalIndex(null); // Închidem modalul
  };

  return (
    <div className="container">
      <h1>Remy Score Tracker</h1>

      {players.map((player, index) => (
        <div key={index} className="player-input">
          <input
            type="text"
            placeholder="Name"
            value={player.name}
            onChange={(event) => handleNameChange(index, event)}
            className="name-input"
          />
          <input
            type="text"
            placeholder="Score"
            value={player.score}
            onChange={(event) => handleScoreChange(index, event)}
            className="score-input no-spinner"
          />

          {/* Butoanele sunt în linie acum */}
          <div className="button-group">
            <button onClick={() => handleAtuu(index)} className="atuu-btn">★</button>
            <button onClick={() => handleRestore(index)} className="restore-btn">Restore</button>
            <button onClick={() => handleAddScore(index)} className="add-score-btn">Add Score</button>
          </div>

          <h3>
            Total: {player.total} 
            {player.atuu && <span className="atuu-text"><strong> Atuu: Da</strong></span>}
          </h3>

          <button onClick={() => openModal(index)} className="history-btn">View History</button>
        </div>
      ))}

      <button onClick={addPlayer} className="add-player-btn">Add Player</button>
      <button onClick={clearAll} className="clear-all-btn">Clean All</button>

      {/* Modal pentru a afișa istoricul */}
      {modalIndex !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Score History for {players[modalIndex].name}</h2>
            <ul className="no-bullets">
              {players[modalIndex].history.map((entry, idx) => (
                <li key={idx}>
                  Score: {entry.score} {entry.atuu && <span>Atuu: Da</span>}
                </li>
              ))}
            </ul>
            <button onClick={closeModal} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
