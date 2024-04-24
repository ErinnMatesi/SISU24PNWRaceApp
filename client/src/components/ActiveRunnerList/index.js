import { useActiveRunners } from './ActiveRunnerContext'; // Ensure this import path is correct based on your file structure

const ActiveRunnerList = () => {
  const { activeRunners, fetchActiveRunners } = useActiveRunners();

  return (
    <div>
      <h2>Currently On Trail</h2>
      <button onClick={fetchActiveRunners}>Refresh List</button>
      <div className="active-runner-list">
        {activeRunners.map((runner, index) => (
          <div key={index} className="runner-row">
            <div>{runner.firstName} {runner.lastName}</div>
            <div>{runner.trailName}</div>
            <div>{new Date(runner.startTime).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveRunnerList;
