import React, { useEffect, useState } from 'react';
import './index.css';
// import { useLeaderboard } from './LeaderboardContext';
import io from 'socket.io-client';

let socket;

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        // Connect to WebSocket server
        socket = io('http://localhost:3000');

        // Listen for updates
        socket.on('update', data => {
            console.log('Data received:', data);
            setLeaderboardData(data);  // Update leaderboard with the new data
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            {leaderboardData.map((entry, index) => (
                <div key={index}>{entry.racerName} - {entry.points}</div>
            ))}
            {/* <div className="category">
                <h2>Male Runners</h2>
                <ul>
                    {maleRunners.map((runner) => (
                        <li key={runner.RacerID}>{runner.FirstName} {runner.LastName} - Points: {runner.TotalPoints}</li>
                    ))}
                </ul>
            </div>
            <div className="category">
                <h2>Female Runners</h2>
                <ul>
                    {femaleRunners.map((runner) => (
                        <li key={runner.RacerID}>{runner.FirstName} {runner.LastName} - Points: {runner.TotalPoints}</li>
                    ))}
                </ul>
            </div>
            <div className="category">
                <h2>Teams</h2>
                <ul>
                    {teams.map((team) => (
                        <li key={team.TeamID}>{team.TeamName} - Points: {team.TotalPoints}</li>
                    ))}
                </ul>
            </div>
            <div className="category">
                <h2>100 Milers</h2>
                <ul>
                    {hundredMilers.map((miler) => (
                        <li key={miler.RacerID}>{miler.FirstName} {miler.LastName} - Miles: {miler.TotalMiles}</li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
};

export default Leaderboard;