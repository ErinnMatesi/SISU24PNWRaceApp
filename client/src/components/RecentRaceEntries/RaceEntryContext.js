import React, { createContext, useState } from 'react';

export const RaceEntryContext = createContext();

export const RaceEntryProvider = ({ children }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const triggerUpdate = () => {
        setUpdateTrigger(prev => prev + 1); // Increment to trigger useEffect
    };

    return (
        <RaceEntryContext.Provider value={{ updateTrigger, triggerUpdate }}>
            {children}
        </RaceEntryContext.Provider>
    );
};
