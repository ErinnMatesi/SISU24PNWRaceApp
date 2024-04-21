import React, { useState, useEffect } from 'react';
import BibNumberInput from '../BibNumberInput';
import './index.css'; 

function formatMySQLDate(date) {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split('T')[0] + ' ' + adjustedDate.toISOString().split('T')[1].slice(0, 8);
}

const BonusObjectiveForm = () => {
  const [racerDetails, setRacerDetails] = useState(null);
  const [bonusObjectives, setBonusObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const fetchBonusObjectives = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/bonusObjective`);
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

    const now = new Date();
    const formattedStartTime = formatMySQLDate(now);
    const formattedEndTime = formatMySQLDate(now);
  
    // Preparing the data for the new race entry with bonus points
    const newRaceEntryData = {
      racerId: racerDetails.RacerID,  // Make sure this is being correctly set when racer is selected
      trailId: null, // No specific trail for bonus points
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      pointsEarned: 0,
      bonusPointsEarned: selectedObjectiveDetails.points,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRaceEntryData),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Assuming server sends back an error message in JSON format
        throw new Error('Failed to create new race entry with bonus points: ' + errorData.message);
      }
  
      const responseData = await response.json();
      setConfirmationMessage(`Bonus points successfully applied. Entry ID: ${responseData.entryId}`);
      setSelectedObjective('');
    } catch (error) {
      console.error('Error creating new race entry with bonus points:', error);
      setConfirmationMessage('Failed to apply bonus points. ' + error.message);
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