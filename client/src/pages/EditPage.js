import React, { useState, useEffect } from 'react';
import RacerDetails from '../components/EditRacerDetails/index';
import './EditPage.css';

const EditPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRacer, setSelectedRacer] = useState(null);
  const [racers, setRacers] = useState([]);

  // Fetch all racers when the component mounts
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/racers`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched racers:', data); // Log the fetched data
        setRacers(data);
      })
      .catch(error => console.error('Error fetching racers:', error));
  }, []);

  const handleSearch = () => {
    console.log('Search query:', searchQuery);
    const results = racers.filter(racer => {
      console.log('Inspecting racer:', racer);
      const firstName = racer.FirstName || '';
      const lastName = racer.LastName || '';
      const bibNumber = racer.BibNumber ? racer.BibNumber.toString() : '';

      console.log('First name:', firstName);
      console.log('Last name:', lastName);
      console.log('Bib number:', bibNumber);
      
      return firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             bibNumber.includes(searchQuery);
    });
    console.log('Filtered results:', results);
    setRacers(results);
  };

  return (
    <div className="edit-page">
      <div className="search-bar">
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search by name or bib number" 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {selectedRacer ? (
        <RacerDetails racer={selectedRacer} />
      ) : (
        <ul className="racer-list">
          {racers.map(racer => (
            <li key={racer.RacerID} onClick={() => setSelectedRacer(racer)}>
              {racer.FirstName} {racer.LastName} - {racer.BibNumber}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EditPage;