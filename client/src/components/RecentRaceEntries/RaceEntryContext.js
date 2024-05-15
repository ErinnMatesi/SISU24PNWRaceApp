import React, { createContext, useState, useContext } from 'react';

const RaceEntryContext = createContext();

export const useRaceEntries = () => useContext(RaceEntryContext);

export const RaceEntryProvider = ({ children }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const triggerRefresh = () => {
        console.log('Previous updateTrigger:', updateTrigger);
        setUpdateTrigger(prev => {
            const newValue = prev + 1;
            console.log('New updateTrigger:', newValue);
            return newValue;
        });
    };

    return (
        <RaceEntryContext.Provider value={{ updateTrigger, triggerRefresh }}>
            {children}
        </RaceEntryContext.Provider>
    );
};