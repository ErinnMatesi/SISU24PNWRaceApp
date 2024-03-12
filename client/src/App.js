import './App.css';
import ActiveRunnerList from './components/ActiveRunnerList';
import CheckOutForm from './components/CheckOut';
import CheckInForm from './components/CheckIn';


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <CheckOutForm />
      <CheckInForm />
      <ActiveRunnerList />
      </header>
    </div>
  );
}

export default App;
