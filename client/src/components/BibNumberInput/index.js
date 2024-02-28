import React, { useState } from 'react';
import './index.css';

const BibNumberInput = ( { onRacerSelected } ) => {
    const [bibNumber, setBibNumber] = useState('');
    const [racerName, setRacerName] = useState(''); // State to store racer name

    const handleBibNumberSubmit = async (e) => {
        e.preventDefault();
        if (!bibNumber) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/racers/${bibNumber}`);
            const data = await response.json();
            if (data) {
                setRacerName(`${data.firstName} ${data.lastName}`);
                onRacerSelected(data);
            } else {
                // Handle the case where racer is not found or data is empty
                setRacerName('Racer not found');
            }
        } catch (error) {
            console.error('Error fetching racer details:', error);
            setRacerName('Error fetching details');
        }
    };

    return (
        <div className="bib-number-form">
            <form onSubmit={handleBibNumberSubmit}>
                <label htmlFor="bibNumber">Bib Number:</label>
                <input
                    id="bibNumber"
                    type="text"
                    value={bibNumber}
                    onChange={(e) => setBibNumber(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {racerName && <div>Racer Name: {racerName}</div>}
        </div>
    );
};

export default BibNumberInput;