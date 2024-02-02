import React, { useState } from 'react';

const BibNumberInput = () => {
    const [bibNumber, setBibNumber] = useState('');
    const [racerName, setRacerName] = useState(''); // State to store racer name

    const handleBibNumberSubmit = async (e) => {
        e.preventDefault();
        if (!bibNumber) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/racers/${bibNumber}`);
            const data = await response.json();
            if (data) {
                // Assuming the API returns an object with racer's first and last name
                setRacerName(`${data.firstName} ${data.lastName}`);
            }
        } catch (error) {
            console.error('Error fetching racer details:', error);
            setRacerName('Racer not found'); // Handle error or case when racer is not found
        }
    };

    return (
        <div>
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
            {racerName && <div>Racer Name: {racerName}</div>} {/* Display racer name */}
        </div>
    );
};

export default BibNumberInput;
