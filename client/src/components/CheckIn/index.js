import React, { useState, useEffect } from 'react';
import BibNumberInput from '../BibNumberInput';
import './index.css'; 

const CheckInForm = () => {
  const [racerDetails, setRacerDetails] = useState(null);
  const [trailDetails, setTrailDetails] = useState(null);
  const [endTime, setEndTime] = useState(new Date().toISOString().slice(0, 16));
  const [completionStatus, setCompletionStatus] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [entryId, setEntryId] = useState(null);

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
      }

    //   for debugging
    // console.log('BasePoints:', trailDetails.BasePoints, 'FirstTenPoints:', trailDetails.FirstTenPoints, 'SecondTenPoints:', trailDetails.SecondTenPoints);
    // console.log('Pre-parse Distance:', trailDetails.Distance, 'ElevationGain:', trailDetails.ElevationGain);
    // console.log('Parsed mileage:', parseFloat(trailDetails.Distance), 'Parsed elevationGain:', parseInt(trailDetails.ElevationGain));
      const raceEntryData = {
        endTime,
        pointsEarned,
        mileage: parseFloat(trailDetails.Distance),
        elevationGain: parseInt(trailDetails.ElevationGain),
      };
// for debugging
    //   console.log('raceEntryData:', raceEntryData);

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
          setRacerDetails(null);
      } catch (error) {
          console.error('Check-in failed:', error);
          setConfirmationMessage('Check-in failed:');
      }
  };

  return (
      <div>
        <h2>Check In From Trail</h2>
          <form className="checkin-form" onSubmit={handleSubmit}>
              <BibNumberInput onRacerSelected={handleRacerSelected} />
              {trailDetails && <p>Checking in from: {trailDetails.TrailName}</p>}
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