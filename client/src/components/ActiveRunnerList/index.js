import React, { useEffect, useState } from 'react';
import './index.css';

const ActiveRunnerList = () => {
    const [activeRunners, setActiveRunners] = useState([]);

    useEffect(() => {
        const fetchActiveRunners = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/active`);
                const data = await response.json();
                setActiveRunners(data);
            } catch (error) {
                console.error('Error fetching active runners:', error);
            }
        };

        fetchActiveRunners();
    }, []);

    return (
        <div>
            <h2>Currently On Trail</h2>
            <div className="active-runner-list">
                <div className="header-row">
                    <div className="header">Name</div>
                    <div className="header">Trail</div>
                    <div className="header">Timeout</div>
                </div>
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
