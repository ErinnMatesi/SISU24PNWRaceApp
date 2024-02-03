import './App.css';
import ActiveRunnerList from './components/ActiveRunnerList';
import CheckOutForm from './components/CheckOut';


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <CheckOutForm />
      <ActiveRunnerList />
      </header>
    </div>
  );
}

export default App;
