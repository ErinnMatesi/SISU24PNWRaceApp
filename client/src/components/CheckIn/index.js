import React, { useState, useEffect } from 'react';
import BibNumberInput from '../BibNumberInput';
import './index.css'; 
import { useRaceEntries } from '../RecentRaceEntries/RaceEntryContext';

const getPSTTime = () => {
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60000;
    const pstOffset = -14 * 60 * 60000; // PST is UTC -8 hours
    const pstTime = new Date(now.getTime() + utcOffset + pstOffset);
    const formattedPSTTime = pstTime.toISOString().slice(0, 16);
    return formattedPSTTime;
};

const CheckInForm = () => {
  const [racerDetails, setRacerDetails] = useState(null);
  const [trailDetails, setTrailDetails] = useState(null);
  const [endTime, setEndTime] = useState(getPSTTime());
  const [completionStatus, setCompletionStatus] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [entryId, setEntryId] = useState(null);
  const { triggerRefresh } = useRaceEntries();

  // Fetch trail details when racerDetails are updated
    useEffect(() => {
        const fetchTrailDetails = async () => {
            if (!racerDetails) return;
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/latest/${racerDetails.RacerID}`);
                const data = await response.json();
                if (data.length > 0) {
                    setTrailDetails(data[0]);
                    const entryId = data[0].EntryID;
                    setEntryId(entryId);
                    console.log('Fetched trail details:', data[0]);
                } else {
                    setTrailDetails(null);
                    setEntryId(null);
                }
            } catch (error) {
                console.error('Error fetching trail details:', error);
                setTrailDetails(null);
                setEntryId(null);
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
      } else if (completionStatus === 'None') {
        // If "None" is selected, do not add any additional points
        pointsEarned = trailDetails.BasePoints;
      }

      const raceEntryData = {
        endTime,
        pointsEarned,
        mileage: parseFloat(trailDetails.Distance),
        elevationGain: parseInt(trailDetails.ElevationGain),
      };

      try {
        // for debugging
        console.log('Racer details at submit:', racerDetails);
          const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/checkin/${entryId}`, {
              method: 'PATCH', // Use PATCH for partial updates
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(raceEntryData),
          });

          if (!response.ok) throw new Error('Check-in failed.');

          setConfirmationMessage(`${racerDetails.FirstName} completed ${trailDetails.TrailName} earning ${pointsEarned} points!`);
          triggerRefresh();
          console.log('Triggered refresh after CheckIn');
          setRacerDetails(null);
          setCompletionStatus('');
      } catch (error) {
          console.error('Check-in failed:', error);
          setConfirmationMessage('Check-in failed:');
      }
  };

  return (
      <div className="checkin-component">
        <h2>Check In From Trail</h2>
          <form className="checkin-form" onSubmit={handleSubmit}>
              <BibNumberInput onRacerSelected={handleRacerSelected} />
              {trailDetails && <p>Checking in from: {trailDetails.TrailName}</p>}
              <div className="form-group">
                  <label>End Time:</label>
                  <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
              <div className="form-group">
                  <label>Ping Pong Ball or Crystal?</label>
                  <select value={completionStatus} onChange={(e) => setCompletionStatus(e.target.value)}>
                      <option value="">Select Status</option>
                      <option value="Ping Pong Ball">Ping Pong Ball</option>
                      <option value="Crystal">Crystal</option>
                      <option value="None">None</option>
                  </select>
              </div>
              <button type="submit">Check In</button>
          </form>
          {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
      </div>
  );
};

export default CheckInForm;