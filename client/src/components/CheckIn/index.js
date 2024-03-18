import React, { useState, useEffect } from 'react';
import BibNumberInput from '../BibNumberInput';
import './index.css'; 

const CheckInForm = () => {
  const [racerDetails, setRacerDetails] = useState(null);
  const [trailDetails, setTrailDetails] = useState(null);
  const [endTime, setEndTime] = useState(new Date().toISOString().slice(0, 16));
  const [completionStatus, setCompletionStatus] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Fetch trail details when racerDetails are updated
    useEffect(() => {
        // console.log(racerDetails);
        const fetchTrailDetails = async () => {
            if (!racerDetails) return;
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/latest/${racerDetails.RacerID}`);
                const data = await response.json();
                // Directly use data since it already contains trail and points information
                setTrailDetails(data); // Adjusted to directly use `data`
            } catch (error) {
                console.error('Error fetching trail details:', error);
                setTrailDetails(null);
            }
        };
        
        fetchTrailDetails();
    }, [racerDetails]);

  const handleRacerSelected = (racer) => {
      console.log("Racer selected:", racer);
      setRacerDetails(racer);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Current racerDetails:", racerDetails);

      if (!trailDetails || !racerDetails) {
          setConfirmationMessage('Racer or trail information is missing.');
          return;
      }

      let pointsEarned = trailDetails.BasePoints;
      if (completionStatus === 'Ping Pong Ball' && trailDetails) {
          pointsEarned += trailDetails.FirstTenPoints;
      } else if (completionStatus === 'Crystal' && trailDetails) {
          pointsEarned += trailDetails.SecondTenPoints;
      }

      const raceEntryData = {
          endTime,
          pointsEarned, 
      };

      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/checkin/${racerDetails.RacerID}`, {
              method: 'PATCH', // Use PATCH for partial updates
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(raceEntryData),
          });

          if (!response.ok) throw new Error('Check-in failed.');

          setConfirmationMessage(`${racerDetails.FirstName} completed ${trailDetails.TrailName} earning ${pointsEarned} points!`);
      } catch (error) {
          console.error('Check-in failed:', error);
          setConfirmationMessage('Check-in failed:');
      }
  };

  return (
      <div>
          <form className="checkin-form" onSubmit={handleSubmit}>
              <BibNumberInput onRacerSelected={handleRacerSelected} />
              {trailDetails && <p>Checking in from: {trailDetails.name}</p>}
              <div className="form-group">
                  <label>End Time:</label>
                  <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
              <div className="form-group">
                  <label>Completion Status:</label>
                  <select value={completionStatus} onChange={(e) => setCompletionStatus(e.target.value)}>
                      <option value="">Select Status</option>
                      <option value="Ping Pong Ball">Ping Pong Ball</option>
                      <option value="Crystal">Crystal</option>
                  </select>
              </div>
              <button type="submit">Check In</button>
          </form>
          {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
      </div>
  );
};

export default CheckInForm;