import React, { useState } from 'react';
import EditRaceEntry from './EditRaceEntry';
import './index.css';

const RacerDetails = ({ racer }) => {
  const [editing, setEditing] = useState(false);
  const [updatedRacer, setUpdatedRacer] = useState({ ...racer });
  const [editingEntry, setEditingEntry] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRacer({
      ...updatedRacer,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/racers/${racer.RacerID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRacer)
      });
      if (!response.ok) {
        throw new Error('Failed to update racer');
      }
      const data = await response.json();
      alert(data.message);
      setEditing(false);
    } catch (error) {
      console.error('Error updating racer:', error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/${entryId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete race entry');
      }
      const data = await response.json();
      alert(data.message);
      // Update the UI to remove the deleted entry
    } catch (error) {
      console.error('Error deleting race entry:', error);
    }
  };

  return (
    <div>
      <h2>{racer.firstName} {racer.lastName}</h2>
        {editing ? (
          <div>
            <input
              type="text"
              name="firstName"
              value={updatedRacer.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              value={updatedRacer.lastName}
              onChange={handleInputChange}
            />
            <select
              name="gender"
              value={updatedRacer.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Nonbinary">Nonbinary</option>
            </select>
            <input
              type="number"
              name="age"
              value={updatedRacer.age}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="bibNumber"
              value={updatedRacer.bibNumber}
              onChange={handleInputChange}
            />
            <select
              name="division"
              value={updatedRacer.division}
              onChange={handleInputChange}
            >
              <option value="">Select Division</option>
              <option value="100 milers">100 Milers</option>
              <option value="24hr individual">24hr Individual</option>
              <option value="24hr team">24hr Team</option>
            </select>
            <input
              type="text"
              name="teamId"
              value={updatedRacer.teamId || ''}
              onChange={handleInputChange}
              placeholder="Team ID (Optional)"
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>Bib Number: {racer.bibNumber}</p>
            <p>Gender: {racer.gender}</p>
            <p>Age: {racer.age}</p>
            <p>Division: {racer.division}</p>
            <p>Team ID: {racer.teamId}</p>
            <button onClick={() => setEditing(true)}>Edit Racer Details</button>
          </div>
        )}
      <h3>Race Entries</h3>
      <ul>
        {racer.raceEntries.map(entry => (
          <li key={entry.id}>
            {entry.details}
            <button onClick={() => setEditingEntry(entry)}>Edit</button>
            <button onClick={() => handleDeleteEntry(entry.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editingEntry && (
        <EditRaceEntry entry={editingEntry} onClose={() => setEditingEntry(null)} />
      )}
    </div>
  );
};

export default RacerDetails;