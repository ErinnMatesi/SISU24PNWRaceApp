import React, { createContext, useContext, useState } from 'react';

const ActiveRunnerContext = createContext();

export const useActiveRunners = () => useContext(ActiveRunnerContext);

export const ActiveRunnerProvider = ({ children }) => {
  const [activeRunners, setActiveRunners] = useState([]);

  const fetchActiveRunners = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/active`);
      const data = await response.json();
      setActiveRunners(data);
    } catch ( error ) {
      console.error('Error fetching active runners:', error);
    }
  };

  return (
    <ActiveRunnerContext.Provider value={{ activeRunners, fetchActiveRunners }}>
      {children}
    </ActiveRunnerContext.Provider>
  );
};

export default ActiveRunnerContext;
