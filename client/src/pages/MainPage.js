import React from 'react';
import CheckInForm from '../components/CheckIn';
import CheckOutForm from '../components/CheckOut';
import BonusObjectivesForm from '../components/BonusObjectives';
import ActiveRunnerList from '../components/ActiveRunnerList';

function MainPage() {
  return (
    <div>
      <h1>Main Page</h1>
      <CheckInForm />
      <CheckOutForm />
      <BonusObjectivesForm />
      <ActiveRunnerList />
    </div>
  );
}

export default MainPage;
