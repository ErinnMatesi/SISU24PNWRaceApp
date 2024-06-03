import React, { createContext, useContext, useState, useEffect } from 'react';

const ActiveRunnerContext = createContext();

export const useActiveRunners = () => useContext(ActiveRunnerContext);

export const ActiveRunnerProvider = ({ children }) => {
  const [activeRunners, setActiveRunners] = useState([]);

  const fetchActiveRunners = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/raceEntry/active?_=${new Date().getTime()}`;
      const response = await fetch(url);
      const data = await response.json();
      setActiveRunners(data);
    } catch ( error ) {
      console.error('Error fetching active runners:', error);
    }
  };

  // Set up polling
  useEffect(() => {
    fetchActiveRunners(); // Fetch immediately on mount
    const interval = setInterval(fetchActiveRunners, 120000); // 120000 ms = 2 minutes
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <ActiveRunnerContext.Provider value={{ activeRunners, fetchActiveRunners }}>
      {children}
    </ActiveRunnerContext.Provider>
  );
};

export default ActiveRunnerContext;