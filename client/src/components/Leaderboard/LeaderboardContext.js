import React, { createContext, useState, useContext, useEffect } from 'react';

const LeaderboardContext = createContext();

export const useLeaderboard = () => useContext(LeaderboardContext);

export const LeaderboardProvider = ({ children }) => {
    const [maleRunners, setMaleRunners] = useState([]);
    const [femaleRunners, setFemaleRunners] = useState([]);
    const [teams, setTeams] = useState([]);
    const [hundredMilers, setHundredMilers] = useState([]);

    const fetchLeaderboardData = () => {
        // Fetch data for all categories
        fetch(`${process.env.REACT_APP_API_URL}/leaderboard/gender/Male`)
            .then(response => response.json())
            .then(data => setMaleRunners(data))
            .catch(error => console.error('Error fetching male runners:', error));

        fetch(`${process.env.REACT_APP_API_URL}/leaderboard/gender/Female`)
            .then(response => response.json())
            .then(data => setFemaleRunners(data))
            .catch(error => console.error('Error fetching female runners:', error));

        fetch(`${process.env.REACT_APP_API_URL}/leaderboard/teams`)
            .then(response => response.json())
            .then(data => setTeams(data))
            .catch(error => console.error('Error fetching teams:', error));

        fetch(`${process.env.REACT_APP_API_URL}/leaderboard/100milers`)
            .then(response => response.json())
            .then(data => setHundredMilers(data))
            .catch(error => console.error('Error fetching 100 milers:', error));
    };

    useEffect(() => {
        fetchLeaderboardData();  // Initial fetch on load
    }, []);

    return (
        <LeaderboardContext.Provider value={{ maleRunners, femaleRunners, teams, hundredMilers, fetchLeaderboardData }}>
            {children}
        </LeaderboardContext.Provider>
    );
};