import React from 'react';
import './LeaderboardPage.css';
import ActiveRunnerList from '../components/ActiveRunnerList';
import Leaderboard from '../components/Leaderboard';

function LeaderboardPage() {
  return (
    <div>
      <Leaderboard />
      <ActiveRunnerList />
    </div>
  );
}

export default LeaderboardPage;