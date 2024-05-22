import React, { useState } from 'react';
import './index.css';

const EditRaceEntry = ({ entry, onClose }) => {
  const [updatedEntry, setUpdatedEntry] = useState({ ...entry });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEntry({
      ...updatedEntry,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/${entry.EntryID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEntry)
      });
      if (!response.ok) {
        throw new Error('Failed to update race entry');
      }
      const data = await response.json();
      alert(data.message);
      onClose();
    } catch (error) {
      console.error('Error updating race entry:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/${entry.EntryID}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete race entry');
      }
      const data = await response.json();
      alert(data.message);
      onClose();
    } catch (error) {
      console.error('Error deleting race entry:', error);
    }
  };

  return (
    <div className="modal">
      <h2>Edit Race Entry</h2>
      <input 
        type="datetime-local"
        name="startTime"
        value={updatedEntry.startTime}
        onChange={handleInputChange}
      />
      <input 
        type="datetime-local"
        name="endTime"
        value={updatedEntry.endTime}
        onChange={handleInputChange}
      />
      <input 
        type="number"
        name="pointsEarned"
        value={updatedEntry.pointsEarned}
        onChange={handleInputChange}
      />
      <input 
        type="number"
        name="bonusPointsEarned"
        value={updatedEntry.bonusPointsEarned}
        onChange={handleInputChange}
      />
      <input 
        type="text"
        name="bonusObjectiveDescription"
        value={updatedEntry.bonusObjectiveDescription}
        onChange={handleInputChange}
      />
      <input 
        type="number"
        name="trailId"
        value={updatedEntry.trailId}
        onChange={handleInputChange}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditRaceEntry;