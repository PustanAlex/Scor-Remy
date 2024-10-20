import React, { useState, useEffect } from 'react';
import './App.css';
import { FaQuestionCircle, FaTrash, FaStar, FaUndo } from 'react-icons/fa';

const App = () => {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [modalIndex, setModalIndex] = useState(null);
  const [confirmClearModal, setConfirmClearModal] = useState(false);
  const [confirmRemoveModal, setConfirmRemoveModal] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const handleScoreChange = (index, event) => {
    const newPlayers = [...players];
    const value = event.target.value;
    if (/^-?\d*$/.test(value)) {
      newPlayers[index].score = value;
      setPlayers(newPlayers);
    }
  };

  const handleAddScore = (index) => {
    const newPlayers = [...players];
    let scoreToAdd = parseInt(newPlayers[index].score.split(' (')[0], 10) || 0;
    if (newPlayers[index].atu) {
      scoreToAdd += 50;
    }
    newPlayers[index].total += scoreToAdd;
    newPlayers[index].history.push({ score: scoreToAdd, atu: newPlayers[index].atu });
    newPlayers[index].score = '';
    newPlayers[index].atu = false;
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
    newPlayers[index].atu = !newPlayers[index].atu;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setModalVisible(true);
  };

  const confirmAddPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { name: newPlayerName, score: '', total: 0, history: [], atu: false }]);
      setNewPlayerName('');
      setModalVisible(false);
    }
  };

  const openHistoryModal = (index) => {
    setModalIndex(index);
  };

  const closeHistoryModal = () => {
    setModalIndex(null);
  };

  const openConfirmClearModal = () => {
    setConfirmClearModal(true);
  };

  const closeConfirmClearModal = () => {
    setConfirmClearModal(false);
  };

  const openConfirmRemoveModal = (index) => {
    setConfirmRemoveModal(true);
    setRemoveIndex(index);
  };

  const closeConfirmRemoveModal = () => {
    setConfirmRemoveModal(false);
    setRemoveIndex(null);
  };

  const removePlayer = () => {
    const newPlayers = players.filter((_, idx) => idx !== removeIndex);
    setPlayers(newPlayers);
    closeConfirmRemoveModal();
  };

  const clearAllPlayers = () => {
    setPlayers([]);
    localStorage.removeItem('players');
    setConfirmClearModal(false);
  };

  const clearAllScores = () => {
    const newPlayers = players.map(player => ({
      ...player,
      total: 0,
      history: [],
      score: '',
      atu: false
    }));
    setPlayers(newPlayers);
    closeConfirmClearModal();
  };

  return (
    <div className="container">
      <h1>Remy Score Tracker</h1>

      {players.length === 0 ? (
        <div className="empty-message">
          <p>No players added. Please add a player.</p>
        </div>
      ) : (
        players.map((player, index) => (
          <div key={index} className="player-input">
            <h3>{player.name}</h3>
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
                <FaStar style={{ fontSize: '20px' }} />
              </button>
              <button onClick={() => handleRestore(index)} className="restore-btn">
                <FaUndo style={{ fontSize: '20px' }} />
              </button>
              <button onClick={() => handleAddScore(index)} className="add-score-btn">Add Score</button>
            </div>
            <h3>
              Total: {player.total}
              {player.atu && <span className="atuu-text"><strong> Atu: Da</strong></span>}
            </h3>
            <FaQuestionCircle className="history-icon" onClick={() => openHistoryModal(index)} size={20} />
            <FaTrash className="remove-player-icon" onClick={() => openConfirmRemoveModal(index)} size={20} />
          </div>
        ))
      )}

      <button onClick={addPlayer} className="add-player-btn">Add Player</button>
      <button onClick={openConfirmClearModal} className="clear-all-btn">Clean All</button>
      <button onClick={clearAllScores} className="clean-all-scores-btn">Clean All Scores</button>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Player</h2>
            <input
              type="text"
              placeholder="Enter player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="name-input"
            />
            <div className="modal-button-group">
              <button onClick={confirmAddPlayer} className="modal-button add-player-btn">Add Player</button>
              <button onClick={() => setModalVisible(false)} className="modal-button cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}

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
            <button onClick={closeHistoryModal} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}

      {confirmClearModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Clean All</h2>
            <p>Are you sure you want to clear all players?</p>
            <div className="modal-button-group">
              <button onClick={clearAllPlayers} className="modal-button confirmation-button">Yes</button>
              <button onClick={closeConfirmClearModal} className="modal-button cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmRemoveModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Remove Player</h2>
            <p>Are you sure you want to remove this player?</p>
            <div className="modal-button-group">
              <button onClick={removePlayer} className="modal-button confirmation-button">Yes</button>
              <button onClick={closeConfirmRemoveModal} className="modal-button cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
