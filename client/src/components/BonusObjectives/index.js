import React, { useState, useEffect } from 'react';
import BibNumberInput from '../BibNumberInput';
import './index.css'; 

const BonusObjectiveForm = () => {
  const [racerDetails, setRacerDetails] = useState(null);
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

  const handleRacerSelected = (racer) => {
    console.log("Racer selected:", racer);
    setRacerDetails(racer);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedObjective) {
      setConfirmationMessage('Please select a bonus objective.');
      return;
    }
  
    const selectedObjectiveDetails = bonusObjectives.find(objective => objective.id === parseInt(selectedObjective));
    if (!selectedObjectiveDetails) {
      setConfirmationMessage('Invalid bonus objective selected.');
      return;
    }
  
    // Preparing the data for the new race entry with bonus points
    const newRaceEntryData = {
      racerId: racerDetails.id, // Access the id property from racerDetails
      bonusPointsEarned: selectedObjectiveDetails.points,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRaceEntryData),
      });
  
      if (!response.ok) throw new Error('Failed to create new race entry with bonus points.');
  
      setConfirmationMessage(`Bonus points successfully applied.`);
      // Reset form fields if necessary
      setSelectedObjective('');
    } catch (error) {
      console.error('Error creating new race entry with bonus points:', error);
      setConfirmationMessage('Failed to apply bonus points.');
    }
  };
  

  return (
    <div>
      <h2>Add Bonus Objective Points</h2>
      <form onSubmit={handleSubmit}>
      <BibNumberInput onRacerSelected={handleRacerSelected} />
        <label htmlFor="objectiveSelect">Select Bonus Objective:</label>
        <select id="objectiveSelect" value={selectedObjective} onChange={e => setSelectedObjective(e.target.value)}>
          <option value="">Select an Objective</option>
          {bonusObjectives.map(objective => (
            <option key={objective.id} value={objective.id}>{objective.name} - {objective.points} Points</option>
          ))}
        </select>
        <button type="submit">Submit Points</button>
      </form>
      {confirmationMessage && <div>{confirmationMessage}</div>}
    </div>
  );
};

export default BonusObjectiveForm;