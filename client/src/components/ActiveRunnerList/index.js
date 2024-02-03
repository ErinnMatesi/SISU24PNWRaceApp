import React, { useEffect, useState } from 'react';
import './ActiveRunnerList.css';

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
        <ul className="active-runner-list">
            {activeRunners.map((runner, index) => (
                <li key={index}>
                    {runner.firstName} {runner.lastName} - Started at: {new Date(runner.startTime).toLocaleTimeString()}
                </li>
            ))}
        </ul>
    );
};

export default ActiveRunnerList;
