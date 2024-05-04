import React from 'react';
import './MainPage.css';
import{ RaceEntryProvider } from '../components/RecentRaceEntries/RaceEntryContext'
import CheckInForm from '../components/CheckIn';
import CheckOutForm from '../components/CheckOut';
import BonusObjectivesForm from '../components/BonusObjectives';
import ActiveRunnerList from '../components/ActiveRunnerList';
import RecentRaceEntries from '../components/RecentRaceEntries';

function MainPage() {
  return (
    <RaceEntryProvider>
      <h1>Main Page</h1>
      <div className="main-container">
        <div className="content-container">
          <div className="forms-container">
            <CheckOutForm />
            <CheckInForm />
            <BonusObjectivesForm />
          </div>
          <div className="recent-entries">
          <RecentRaceEntries />
          </div>
        </div>
        <div className="active-runners">
            <ActiveRunnerList />
        </div>
      </div>
    </RaceEntryProvider>
  );
}

export default MainPage;
