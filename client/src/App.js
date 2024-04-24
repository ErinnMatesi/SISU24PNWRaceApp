import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ActiveRunnerProvider } from './components/ActiveRunnerList/ActiveRunnerContext';
import MainPage from './pages/MainPage';
// import LeaderboardPage from './pages/LeaderboardPage';
// import EditPage from './pages/EditPage';
// import RegistrationPage from '/.pages/RegistrationPage';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Main</Link></li>
          {/* <li><Link to="/leaderboard">Leaderboard</Link></li>
          <li><Link to="/edit">Edit</Link></li>
          <li><Link to="/">Registration</Link></li> */}
        </ul>
      </nav>
      <ActiveRunnerProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/" element={<RegistrationPage />} /> */}
        </Routes>
      </ActiveRunnerProvider>
    </Router>
  );
}

export default App;
