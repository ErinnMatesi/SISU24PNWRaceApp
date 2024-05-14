import { useActiveRunners } from './ActiveRunnerContext';
import './index.css'; 

const ActiveRunnerList = () => {
  const { activeRunners } = useActiveRunners();

  return (
    <div>
      <h2>Currently On Trail</h2>
      <div className="active-runner-list">
        {activeRunners.map((runner, index) => (
          <div key={index} className="runner-row">
            <div>{runner.firstName} {runner.lastName}</div>
            <div>{runner.TrailName || "No Trail"}</div>
            <div>{new Date(runner.startTime).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveRunnerList;
