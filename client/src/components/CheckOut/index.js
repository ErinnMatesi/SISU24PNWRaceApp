import React, { useState } from 'react';
import BibNumberInput from '../BibNumberInput';
import './index.css';
import { useRaceEntries } from '../RecentRaceEntries/RaceEntryContext';

const trails = [
    { id: 1, name: 'Noble Knob' },
    { id: 2, name: 'Goat Falls' },
    { id: 3, name: 'Snoquera Falls' },
    { id: 4, name: 'Dalles Falls' },
    { id: 5, name: 'Little Ranger Peak' },
    { id: 6, name: 'Little Ranger Lookout' }
];

const getPSTTime = () => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000;
  const pstOffset = -14 * 60 * 60000; // PST is UTC -8 hours
  const pstTime = new Date(now.getTime() + utcOffset + pstOffset);
  const formattedPSTTime = pstTime.toISOString().slice(0, 16);
  return formattedPSTTime;
};

const CheckOutForm = () => {
    const [racerDetails, setRacerDetails] = useState(null); // State to store fetched racer details
    const [trailId, setTrailId] = useState(trails[0].id);
    const [startTime, setStartTime] = useState(getPSTTime());
    const [confirmationMessage, setConfirmationMessage] = useState(''); // New state for confirmation message
    const { triggerRefresh } = useRaceEntries();

    const handleRacerSelected = (data) => {
      console.log("Racer selected:", data);
      setRacerDetails(data); // Store the racer details fetched by BibNumberInput
    };

  const handleSubmit = async (e) => {
    console.log("CheckOut handleSubmit called");
      e.preventDefault();
      const racerId = racerDetails?.RacerID; 
      const raceEntryData = {
          racerId, 
          trailId,
          startTime,
      };
      
      try {
        // Perform a POST request to your backend endpoint
        const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(raceEntryData),
        });

        if (!response.ok) {
            throw new Error('Failed to create race entry');
        }

          const responseData = await response.json();

          // Find the selected trail's name from the trails array using trailId
          const selectedTrail = trails.find(trail => trail.id === Number(trailId));
          const selectedTrailName = selectedTrail ? selectedTrail.name : 'Unknown Trail';
          setConfirmationMessage(`${racerDetails.FirstName} checked out on ${selectedTrailName}.`);
          triggerRefresh();
          console.log('Race entry created:', responseData); // For    debugging, can be removed
          setRacerDetails(null);
        } catch (error) {
          console.error('Failed to check out:', error);
          setConfirmationMessage('Failed to check out. Please try again.');
          console.log("Error during POST request:", error);
        }
  };

    return (
      <div className="checkout-component">
        <h2>Check Out Onto Trail</h2>
          <form className="checkout-form" onSubmit={handleSubmit}>
        <BibNumberInput onRacerSelected={handleRacerSelected} />
        <div className="form-group">
            <label htmlFor="trailSelect">Trail:</label>
            <select id="trailSelect" value={trailId} onChange={(e) => setTrailId(e.target.value)} className={`trail-${trailId}`}>
                {trails.map(trail => (
                    <option key={trail.id} value={trail.id} className={`trail-${trail.id}`}>{trail.name}</option>
                ))}
            </select>
        </div>
        <div className="form-group">
            <label>Start Time:</label>
            <input 
                type="datetime-local" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
            />
        </div>
        <button type="submit">Check Out</button>
        </form>
        {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
      </div>
    );
};

export default CheckOutForm;