import React, { useState, useEffect } from 'react';
import EditRaceEntry from '../EditRaceEntry';
import './index.css';

const trails = [
  { id: 1, name: 'Noble Knob' },
  { id: 2, name: 'Goat Falls' },
  { id: 3, name: 'Snoquera Falls' },
  { id: 4, name: 'Dalles Falls' },
  { id: 5, name: 'Little Ranger Peak' },
  { id: 6, name: 'Little Ranger Lookout' }
];

const RacerDetails = ({ racer }) => {
  const [editing, setEditing] = useState(false);
  const [updatedRacer, setUpdatedRacer] = useState({ ...racer });
  const [editingEntry, setEditingEntry] = useState(null);
  const [raceEntries, setRaceEntries] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  useEffect(() => {
    // Fetch race entries when the component mounts or when the racer changes
    const fetchRaceEntries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/${racer.RacerID}`);
        const data = await response.json();
        setRaceEntries(data);
      } catch (error) {
        console.error('Error fetching race entries:', error);
      }
    };

    fetchRaceEntries();
  }, [racer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRacer({
      ...updatedRacer,
      [name]: value
    });
  };

  const handleSave = async () => {
    console.log('Updated racer data:', updatedRacer);
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

  const confirmDeleteEntry = (entryId) => {
    setEntryToDelete(entryId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteEntry = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/${entryToDelete}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete race entry');
      }
      const data = await response.json();
      alert(data.message);
      // Update the UI to remove the deleted entry
      setRaceEntries(raceEntries.filter(entry => entry.EntryID !== entryToDelete));
      setShowDeleteConfirm(false);
      setEntryToDelete(null);
    } catch (error) {
      console.error('Error deleting race entry:', error);
    }
  };

  const getTrailName = (trailId) => {
    const trail = trails.find(t => t.id === trailId);
    return trail ? trail.name : ' ';
  };

  return (
    <div className="racer-details">
      <h2>{racer.FirstName} {racer.LastName}</h2>
      {editing ? (
        <div>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="FirstName"
              value={updatedRacer.FirstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="LastName"
              value={updatedRacer.LastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="Gender"
              value={updatedRacer.Gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Nonbinary">Nonbinary</option>
            </select>
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="Age"
              value={updatedRacer.Age}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Bib Number</label>
            <input
              type="text"
              name="BibNumber"
              value={updatedRacer.BibNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Division</label>
            <select
              name="Division"
              value={updatedRacer.Division}
              onChange={handleInputChange}
            >
              <option value="">Select Division</option>
              <option value="100 milers">100 Milers</option>
              <option value="24hr individual">24hr Individual</option>
              <option value="24hr team">24hr Team</option>
            </select>
          </div>
          <div className="form-group">
            <label>Team ID (Optional)</label>
            <input
              type="text"
              name="TeamID"
              value={updatedRacer.TeamID || ''}
              onChange={handleInputChange}
              placeholder="Team ID (Optional)"
            />
          </div>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Bib Number: {racer.BibNumber}</p>
          <p>Gender: {racer.Gender}</p>
          <p>Age: {racer.Age}</p>
          <p>Division: {racer.Division}</p>
          <p>Team ID: {racer.TeamID}</p>
          <button onClick={() => setEditing(true)}>Edit Racer Details</button>
        </div>
      )}
      <h3>Race Entries</h3>
      <ul>
        {(raceEntries || []).map(entry => (
          <li key={entry.EntryID}>
            <p>Trail Name: {getTrailName(entry.TrailID)}</p>
            <p>Bonus Objective Description: {entry.BonusObjectiveDescription || ' '}</p>
            <p>Start Time: {entry.StartTime}</p>
            <p>End Time: {entry.EndTime}</p>
            <p>Points Earned: {entry.PointsEarned}</p>
            <button onClick={() => setEditingEntry(entry)}>Edit</button>
            <button onClick={() => confirmDeleteEntry(entry.EntryID)}>Delete</button>
          </li>
        ))}
      </ul>
      {editingEntry && (
        <EditRaceEntry entry={editingEntry} onClose={() => setEditingEntry(null)} />
      )}
      {showDeleteConfirm && (
        <div className="modal">
          <p>Are you sure you want to delete this race entry?</p>
          <button onClick={handleDeleteEntry}>Yes</button>
          <button onClick={() => setShowDeleteConfirm(false)}>No</button>
        </div>
      )}
    </div>
  );
};

export default RacerDetails;