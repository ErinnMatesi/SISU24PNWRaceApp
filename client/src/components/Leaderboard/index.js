import React, { useContext } from 'react';
import './index.css';
import { useLeaderboard } from './LeaderboardContext';

const Leaderboard = () => {
    const { maleRunners, femaleRunners, teams, hundredMilers } = useLeaderboard();

    return (
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            <div className="category">
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
                    {teams.map((team, index) => (
                        <li key={index}>{team.TeamName} - Points: {team.TotalTeamPoints}</li>
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
            </div>
        </div>
    );
};

export default Leaderboard;