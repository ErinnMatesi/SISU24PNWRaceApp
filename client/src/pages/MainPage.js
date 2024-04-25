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
      <div>
      <h1>Main Page</h1>
      <CheckInForm />
      <CheckOutForm />
      <BonusObjectivesForm />
      <ActiveRunnerList />
      <RecentRaceEntries />
    </div>
    </RaceEntryProvider>
  );
}

export default MainPage;
