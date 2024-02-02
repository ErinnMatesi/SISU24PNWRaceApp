import React, { useState } from 'react';

const BibNumberInput = ({ onBibNumberSubmit }) => {
    const [bibNumber, setBibNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onBibNumberSubmit(bibNumber);
        setBibNumber(''); // Reset input after submission
    };

    return (
        <form onSubmit={handleSubmit}>
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
    );
};

export default BibNumberInput;
