import React, { useContext } from 'react';
import './index.css';
import { LeaderboardContext } from './LeaderboardContext';

const Leaderboard = () => {
  const { maleRunners, femaleRunners, teams, hundredMilers } = useContext(LeaderboardContext);

  return (
      <div className="leaderboard-container">
          <h1>Leaderboard</h1>
          <div className="category">
              <h2>Male Runners</h2>
              <ul>
                  {maleRunners.map(runner => (
                      <li key={runner.RacerID}>{runner.FirstName} {runner.LastName} - {runner.TotalPoints} points</li>
                  ))}
              </ul>
          </div>
          <div className="category">
              <h2>Female Runners</h2>
              <ul>
                  {femaleRunners.map(runner => (
                      <li key={runner.RacerID}>{runner.FirstName} {runner.LastName} - {runner.TotalPoints} points</li>
                  ))}
              </ul>
          </div>
          <div className="category">
              <h2>Teams</h2>
              <ul>
                  {teams.map(team => (
                      <li key={team.TeamID}>{team.TeamName} - {team.TotalPoints} points</li>
                  ))}
              </ul>
          </div>
          <div className="category">
              <h2>100 Milers</h2>
              <ul>
                  {hundredMilers.map(miler => (
                      <li key={miler.RacerID}>{miler.FirstName} {miler.LastName} - {miler.TotalMiles} miles</li>
                  ))}
              </ul>
          </div>
      </div>
  );
};

export default Leaderboard;