import React, { useState, useEffect } from 'react';
import './index.css';

const trails = [
  { id: 1, name: 'Noble Knob' },
  { id: 2, name: 'Goat Falls' },
  { id: 3, name: 'Snoquera Falls' },
  { id: 4, name: 'Dalles Falls' },
  { id: 5, name: 'Little Ranger Peak' },
  { id: 6, name: 'Little Ranger Lookout' }
];

const EditRaceEntry = ({ entry, onClose }) => {
  const [updatedEntry, setUpdatedEntry] = useState({ TrailID: entry.TrailID });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (entry.EndTime) {
      setShowAlert(true);
    } else {
      setUpdatedEntry({ TrailID: entry.TrailID });
    }
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

  return (
    <div className="modal">
      <h2>Edit Race Entry</h2>
      {showAlert ? (
        <div>
          <p>This race entry is already completed and cannot be edited.</p>
          <button onClick={onClose}>Close</button>
        </div>
      ) : (
        <>
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
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default EditRaceEntry;