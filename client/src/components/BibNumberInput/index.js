import React, { useState } from 'react';
import './index.css';

const BibNumberInput = ({ onRacerSelected }) => {
    const [bibNumber, setBibNumber] = useState('');
    const [racerName, setRacerName] = useState('');

    const handleBibNumberSubmit = async (e) => {
        e.preventDefault(); // This might not be needed anymore, but kept for consistency
        if (!bibNumber) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/racers/${bibNumber}`);
            const data = await response.json();
            if (data) {
                setRacerName(`${data.FirstName} ${data.LastName}`);
                onRacerSelected(data);
            } else {
                setRacerName('Racer not found');
            }
        } catch (error) {
            console.error('Error fetching racer details:', error);
            setRacerName('Error fetching details');
        }
    };

    return (
        <div className="bib-number-input">
            <label htmlFor="bibNumber">Bib Number:</label>
            <input
                id="bibNumber"
                type="text"
                value={bibNumber}
                onChange={(e) => setBibNumber(e.target.value)}
                required
            />
            <button onClick={handleBibNumberSubmit}>Submit</button>
            {racerName && <div>Racer Name: {racerName}</div>}
        </div>
    );
};


export default BibNumberInput;