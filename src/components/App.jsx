import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [{ name: '', score: '', total: 0, history: [], atu: false }];
  });

  const [modalIndex, setModalIndex] = useState(null);
  const [confirmClearModal, setConfirmClearModal] = useState(false); // State for confirm clear modal

  // Save players to localStorage on update
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
    const value = event.target.value;

    // Allow only numbers and a minus sign for negative numbers
    if (/^-?\d*$/.test(value)) {
      newPlayers[index].score = value;
      setPlayers(newPlayers);
    }
  };

  const handleAddScore = (index) => {
    const newPlayers = [...players];
    let scoreToAdd = parseInt(newPlayers[index].score.split(' (')[0], 10) || 0;

    // Add bonus if Atu is active
    if (newPlayers[index].atu) {
      scoreToAdd += 50;
    }

    // Update total
    newPlayers[index].total += scoreToAdd;

    // Add score to history
    newPlayers[index].history.push({ score: scoreToAdd, atu: newPlayers[index].atu });

    // Reset input
    newPlayers[index].score = '';
    newPlayers[index].atu = false; // Reset Atu after addition
    setPlayers(newPlayers);
  };

  const handleRestore = (index) => {
    const newPlayers = [...players];
    if (newPlayers[index].history.length > 0) {
      const lastEntry = newPlayers[index].history.pop();
      newPlayers[index].total -= lastEntry.score;
      newPlayers[index].score = lastEntry.score.toString();
      setPlayers(newPlayers);
    }
  };

  const handleAtu = (index) => {
    const newPlayers = [...players];
    newPlayers[index].atu = !newPlayers[index].atu; // Toggle Atu
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setPlayers([...players, { name: '', score: '', total: 0, history: [], atu: false }]);
  };

  const clearAll = () => {
    setPlayers([{ name: '', score: '', total: 0, history: [], atu: false }]); // Reset players list
    localStorage.removeItem('players'); // Remove from localStorage
    setConfirmClearModal(false); // Close the modal
  };

  const openModal = (index) => {
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalIndex(null);
  };

  const openConfirmClearModal = () => {
    setConfirmClearModal(true);
  };

  const closeConfirmClearModal = () => {
    setConfirmClearModal(false);
  };

  const removePlayer = (index) => {
    const newPlayers = players.filter((_, idx) => idx !== index);
    setPlayers(newPlayers);
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
          <div className="score-container">
            <input
              type="text"
              placeholder="Score"
              value={player.score}
              onChange={(event) => handleScoreChange(index, event)}
              className="score-input no-spinner"
            />
            {player.atu && player.score.length > 0 && (
              <span className="bonus-text"> ( +50 )</span>
            )}
          </div>

          <div className="button-group">
            <button onClick={() => handleAtu(index)} className={`atuu-btn ${player.atu ? 'active' : ''}`}>
              ★
            </button>
            <button onClick={() => handleRestore(index)} className="restore-btn">Restore</button>
            <button onClick={() => handleAddScore(index)} className="add-score-btn">Add Score</button>
          </div>

          <h3>
            Total: {player.total}
            {player.atu && <span className="atuu-text"><strong> Atu: Da</strong></span>}
          </h3>

          <button onClick={() => openModal(index)} className="history-btn">View History</button>
          <button onClick={() => removePlayer(index)} className="remove-player-btn">Remove Player</button> {/* Remove Player Button */}
        </div>
      ))}

      <button onClick={addPlayer} className="add-player-btn">Add Player</button>
      <button onClick={openConfirmClearModal} className="clear-all-btn">Clean All</button> {/* Open confirmation modal */}

      {modalIndex !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Score History for {players[modalIndex].name}</h2>
            <ul className="no-bullets">
              {players[modalIndex].history.map((entry, idx) => (
                <li key={idx}>
                  Score: {entry.score} {entry.atu && <span>Atu: Da</span>}
                </li>
              ))}
            </ul>
            <button onClick={closeModal} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}

      {confirmClearModal && ( // Confirm clear modal
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Clean All</h2>
            <p>Are you sure you want to clear all players?</p>
            <button onClick={clearAll} className="clear-all-btn">Yes</button>
            <button onClick={closeConfirmClearModal} className="close-modal-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
