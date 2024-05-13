import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { LeaderboardProvider } from './components/Leaderboard/LeaderboardContext';
import { ActiveRunnerProvider } from './components/ActiveRunnerList/ActiveRunnerContext';
import { RaceEntryProvider } from './components/RecentRaceEntries/RaceEntryContext';
import MainPage from './pages/MainPage';
import LeaderboardPage from './pages/LeaderboardPage';
// import EditPage from './pages/EditPage';
import RegistrationPage from './pages/RegistrationPage';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Main</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
          {/* <li><Link to="/edit">Edit</Link></li> */}
          <li><Link to="/registration">Registration</Link></li>
        </ul>
      </nav>
      {/* <LeaderboardProvider> */}
        <ActiveRunnerProvider>
          <RaceEntryProvider>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              {/* <Route path="/edit" element={<EditPage />} /> */}
              <Route path="/registration" element={<RegistrationPage />} />
            </Routes>
          </RaceEntryProvider>
        </ActiveRunnerProvider>
      {/* </LeaderboardProvider> */}
    </Router>
  );
}

export default App;
