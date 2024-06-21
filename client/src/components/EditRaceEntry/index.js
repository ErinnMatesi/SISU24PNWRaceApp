import React, { useState,  useEffect } from 'react';
import './index.css';

const trails = [
  { id: 1, name: 'Noble Knob', },
  { id: 2, name: 'Goat Falls' },
  { id: 3, name: 'Snoquera Falls' },
  { id: 4, name: 'Dalles Falls' },
  { id: 5, name: 'Little Ranger Peak' },
  { id: 6, name: 'Little Ranger Lookout' }
];

const bonusObjectives = [
  { id: 10, description: 'Compass Challenge' },
  { id: 11, description: 'Paracord Bracelet' },
  { id: 12, description: 'Waterfall' },
  { id: 13, description: 'Egg Carry' },
  { id: 14, description: 'Poem Memorization' },
  { id: 15, description: 'Crossword' },
  { id: 16, description: 'Midnight Yoga' },
  { id: 17, description: 'SISU Service' },
];

const EditRaceEntry = ({ entry, onClose }) => {
  const [updatedEntry, setUpdatedEntry] = useState({ ...entry });

  useEffect(() => {
    setUpdatedEntry({ 
      ...entry,
      StartTime: new Date(entry.StartTime).toISOString().slice(0, 16),
      EndTime: new Date(entry.EndTime).toISOString().slice(0, 16)
    });
  }, [entry]);

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
      <label>
        Trail:
        <select
          name="TrailID"
          value={updatedEntry.TrailID || ''}
          onChange={handleInputChange}
        >
          <option value="">Select Trail</option>
          {trails.map(trail => (
            <option key={trail.id} value={trail.id}>
              {trail.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Start Time:
        <input 
          type="datetime-local"
          name="StartTime"
          value={updatedEntry.StartTime}
          onChange={handleInputChange}
        />
      </label>
      <label>
        End Time:
        <input 
          type="datetime-local"
          name="EndTime"
          value={updatedEntry.EndTime}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Points Earned:
        <input 
          type="number"
          name="PointsEarned"
          value={updatedEntry.PointsEarned}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Bonus Objective:
        <select
          name="BonusObjectiveID"
          value={updatedEntry.BonusObjectiveID || ''}
          onChange={handleInputChange}
        >
          <option value="">Select Bonus Objective</option>
          {bonusObjectives.map(objective => (
            <option key={objective.id} value={objective.id}>
              {objective.description}
            </option>
          ))}
        </select>
      </label>
      <label>
        Bonus Points Earned:
        <input 
          type="number"
          name="BonusPointsEarned"
          value={updatedEntry.BonusPointsEarned}
          onChange={handleInputChange}
        />
      </label>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default EditRaceEntry;