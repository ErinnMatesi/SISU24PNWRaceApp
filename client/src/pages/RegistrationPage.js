import React, { useState } from 'react';
import './RegistrationPage.css';

const RegistrationPage = () => {
    const [teamName, setTeamName] = useState('');
    const [racerData, setRacerData] = useState({ firstName: '', lastName: '', gender: '', age: '', bibNumber: '', division: '', teamId: '' });
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const handleTeamSubmit = async (event) => {
      event.preventDefault();
      const teamData = { teamName: teamName }; // Ensure you have the state `newTeamName` properly set up
      console.log('Sending request to create team:', teamData);
  
      fetch(`${process.env.REACT_APP_API_URL}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: teamName })
      })
      .then(response => {
          console.log('Response status:', response.status);
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
      })
      .then(data => {
          console.log('Success:', data);
          setConfirmationMessage(`Team created successfully with ID: ${data.teamId}`);
      })
      .catch(error => {
          console.error('Error creating team:', error);
      });
  };  

    const handleRacerSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/racer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([racerData]) // Sending as an array for backend compatibility
        });
        const data = await response.json();
        alert(data.message); // Simple alert to show the operation result
    };

    return (
        <div className="registration-page">
            <h1>Registration</h1>
            <div className="form-container">
                <form onSubmit={handleTeamSubmit} className="team-form">
                    <div className="form-group">
                        <label>Team Name:</label>
                        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="input-field" />
                    </div>
                    <button type="submit" className="submit-btn">Create Team</button>
                    {confirmationMessage && <div>{confirmationMessage}</div>}
                </form>
                <form onSubmit={handleRacerSubmit} className="racer-form">
                  <div className="form-group">
                      <label>First Name:</label>
                      <input type="text" value={racerData.firstName} onChange={(e) => setRacerData({ ...racerData, firstName: e.target.value })} className="input-field" />
                  </div>
                  <div className="form-group">
                      <label>Last Name:</label>
                      <input type="text" value={racerData.lastName} onChange={(e) => setRacerData({ ...racerData, lastName: e.target.value })} className="input-field" />
                  </div>
                  <div className="form-group">
                      <label>Gender:</label>
                      <select value={racerData.gender} onChange={(e) => setRacerData({ ...racerData, gender: e.target.value })} className="input-field">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Nonbinary">Nonbinary</option>
                      </select>
                  </div>
                  <div className="form-group">
                      <label>Age:</label>
                      <input type="number" value={racerData.age} onChange={(e) => setRacerData({ ...racerData, age: e.target.value })} className="input-field" />
                  </div>
                  <div className="form-group">
                      <label>Bib Number:</label>
                      <input type="text" value={racerData.bibNumber} onChange={(e) => setRacerData({ ...racerData, bibNumber: e.target.value })} className="input-field" />
                  </div>
                  <div className="form-group">
                      <label>Division:</label>
                      <select value={racerData.division} onChange={(e) => setRacerData({ ...racerData, division: e.target.value })} className="input-field">
                          <option value="">Select Division</option>
                          <option value="100 milers">100 Milers</option>
                          <option value="24hr individual">24hr Individual</option>
                          <option value="24hr team">24hr Team</option>
                      </select>
                  </div>
                  <div className="form-group">
                      <label>Team ID (Optional):</label>
                      <input type="text" value={racerData.teamId} onChange={(e) => setRacerData({ ...racerData, teamId: e.target.value })} className="input-field" />
                  </div>
                  <button type="submit" className="submit-btn">Register Racer</button>
              </form>
            </div>
        </div>
    );
};

export default RegistrationPage;