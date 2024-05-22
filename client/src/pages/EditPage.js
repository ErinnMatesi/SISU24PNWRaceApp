import React, { useState, useEffect } from 'react';
import RacerDetails from '../components/EditRacerDetails/index';
import './index.css';

const EditPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRacer, setSelectedRacer] = useState(null);
  const [racers, setRacers] = useState([]);

  // Fetch all racers when the component mounts
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/racers`)
      .then(response => response.json())
      .then(data => setRacers(data))
      .catch(error => console.error('Error fetching racers:', error));
  }, []);

  const handleSearch = () => {
    const results = racers.filter(racer => 
      racer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      racer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      racer.bibNumber.toString().includes(searchQuery)
    );
    setRacers(results);
  };

  return (
    <div>
      <input 
        type="text" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Search by name or bib number" 
      />
      <button onClick={handleSearch}>Search</button>
      {selectedRacer ? (
        <RacerDetails racer={selectedRacer} />
      ) : (
        <ul>
          {racers.map(racer => (
            <li key={racer.RacerID} onClick={() => setSelectedRacer(racer)}>
              {racer.firstName} {racer.lastName} - {racer.bibNumber}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EditPage;