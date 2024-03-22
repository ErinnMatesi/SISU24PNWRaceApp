import React, { useState, useEffect } from 'react';
import BibNumberInput from '../BibNumberInput';
import './index.css'; 

const BonusObjectiveForm = () => {
  const [bonusObjectives, setBonusObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const fetchBonusObjectives = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/bonusObjectives`);
        const data = await response.json();
        setBonusObjectives(data);
      } catch (error) {
        console.error('Error fetching bonus objectives:', error);
      }
    };

    fetchBonusObjectives();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit logic here
    // After successful submission, set confirmation message
    setConfirmationMessage('Bonus objective successfully applied.');
  };

  return (
    <div>
      <h2>Add Bonus Objective Points</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="objectiveSelect">Select Bonus Objective:</label>
        <select id="objectiveSelect" value={selectedObjective} onChange={e => setSelectedObjective(e.target.value)}>
          <option value="">Select an Objective</option>
          {bonusObjectives.map(objective => (
            <option key={objective.id} value={objective.id}>{objective.name} - {objective.points} Points</option>
          ))}
        </select>
        <button type="submit">Apply Bonus</button>
      </form>
      {confirmationMessage && <div>{confirmationMessage}</div>}
    </div>
  );
};

export default BonusObjectiveForm;