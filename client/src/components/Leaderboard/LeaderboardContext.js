import React, { createContext, useState, useContext, useEffect } from 'react';

const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
    const [maleRunners, setMaleRunners] = useState([]);
    const [femaleRunners, setFemaleRunners] = useState([]);
    const [teams, setTeams] = useState([]);
    const [hundredMilers, setHundredMilers] = useState([]);
    const fetchSettings = {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate' // Directs the browser to fetch a fresh version
        }
    };

    useEffect(() => {
        fetchMaleRunners();
        fetchFemaleRunners();
        fetchTeams();
        fetchHundredMilers();
    }, []);

    const fetchMaleRunners = () => {
        fetch(`${process.env.REACT_APP_API_URL}/leaderboard/gender/Male`, fetchSettings)
            .then(response => response.json())
            .then(data => setMaleRunners(data))
            .catch(error => console.error('Error fetching male runners:', error));
    };

    const fetchFemaleRunners = () => {
        fetch(`${process.env.REACT_APP_API_URL}/leaderboard/gender/Female`, fetchSettings)
            .then(response => response.json())
            .then(data => setFemaleRunners(data))
            .catch(error => console.error('Error fetching female runners:', error));
    };

    const fetchTeams = () => {
        fetch(`${process.env.REACT_APP_API_URL}/leaderboard/teams`, fetchSettings)
            .then(response => response.json())
            .then(data => setTeams(data))
            .catch(error => console.error('Error fetching teams:', error));
    };

    const fetchHundredMilers = () => {
        fetch(`${process.env.REACT_APP_API_URL}/leaderboard/100milers`, fetchSettings)
            .then(response => response.json())
            .then(data => setHundredMilers(data))
            .catch(error => console.error('Error fetching 100 milers:', error));
    };

    return (
        <LeaderboardContext.Provider value={{ maleRunners, femaleRunners, teams, hundredMilers }}>
            {children}
        </LeaderboardContext.Provider>
    );
};

// Custom hook to use context
export const useLeaderboard = () => useContext(LeaderboardContext);