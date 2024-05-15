import React, { useState, useEffect } from 'react';
import BibNumberInput from '../BibNumberInput';
import './index.css'; 
import { useRaceEntries } from '../RecentRaceEntries/RaceEntryContext';

const BonusObjectiveForm = () => {
  const [racerDetails, setRacerDetails] = useState(null);
  const [bonusObjectives, setBonusObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const { triggerRefresh } = useRaceEntries();

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
      setConfirmationMessage('Please select a side quest.');
      return;
    }

    if (!racerDetails || !racerDetails.RacerID) {
      setConfirmationMessage('No racer selected or racer details are incomplete.');
      return;
    }
  
    const selectedObjectiveDetails = bonusObjectives.find(objective => objective.id === parseInt(selectedObjective));
    if (!selectedObjectiveDetails) {
      setConfirmationMessage('Invalid side quest selected.');
      return;
    }
  
    // Preparing the data for the new race entry with bonus points
    const newRaceEntryData = {
      racerId: racerDetails.RacerID, 
      bonusPointsEarned: selectedObjectiveDetails.points,
      bonusObjectiveId: selectedObjectiveDetails.id,
      bonusObjectiveDescription: selectedObjectiveDetails.name,
    };

    console.log('Submitting new race entry:', newRaceEntryData);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/bonusPoints`, {
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
      setConfirmationMessage(`Bonus points successfully applied. Points Earned: ${selectedObjectiveDetails.points}`);
      triggerRefresh();
      setRacerDetails(null);
      setSelectedObjective('');
    } catch (error) {
      console.error('Error creating new race entry with bonus points:', error);
      setConfirmationMessage('Failed to apply bonus points. ' + error.message);
    }
  };

  return (
    <div className="bonusobj-component">
      <h2>Add Side Quest Points</h2>
      <form className="bonus-objective-form" onSubmit={handleSubmit}>
        <BibNumberInput onRacerSelected={handleRacerSelected} />
        <label htmlFor="objectiveSelect">Side Quest:</label>
        <select id="objectiveSelect" value={selectedObjective} onChange={e => setSelectedObjective(e.target.value)}>
          <option value="">Select a Side Quest</option>
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