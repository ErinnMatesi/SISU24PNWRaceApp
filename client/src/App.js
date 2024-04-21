import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LeaderboardPage from './pages/LeaderboardPage';
import EditPage from './pages/EditPage';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Main</Link></li>
          {/* <li><Link to="/leaderboard">Leaderboard</Link></li>
          <li><Link to="/edit">Edit</Link></li> */}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/edit" element={<EditPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
