import React, { createContext, useState, useContext } from 'react';

const RaceEntryContext = createContext();

export const useRaceEntries = () => useContext(RaceEntryContext);

export const RaceEntryProvider = ({ children }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const triggerRefresh = () => {
        setUpdateTrigger(prev => prev + 1); // Increment to trigger refresh
    };

    return (
        <RaceEntryContext.Provider value={{ updateTrigger, triggerRefresh }}>
            {children}
        </RaceEntryContext.Provider>
    );
};