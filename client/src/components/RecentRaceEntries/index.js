import React, { useContext, useEffect, useState } from 'react';
import { RaceEntryContext } from './RaceEntryContext';
import './index.css';

const RecentRaceEntries = () => {
  const [entries, setEntries] = useState([]);
  const { updateTrigger } = useContext(RaceEntryContext);

  useEffect(() => {
      fetchRecentEntries();
  }, [updateTrigger]);

  const fetchRecentEntries = async () => {
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/raceEntry/recent`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate', // Directs the browser to bypass the cache
              'Pragma': 'no-cache', // For legacy HTTP/1.0 servers
              'Expires': '0' // Proxies
            }});
          const data = await response.json();
          console.log("Recent Entries:", data);
          setEntries(data);
      } catch (error) {
          console.error('Failed to fetch recent race entries:', error);
      }
  };

  return (
    <div className="recent-entries-container">
      <h3 className="recent-entries-header">Recent Race Entries</h3>
      <ul className="recent-entries-list">
        {entries.map((entry) => (
          <li key={entry.EntryID} className="recent-entry-item">
            {entry.FirstName} {entry.LastName} (Bib: {entry.BibNumber}) - 
            {entry.TrailName ? `${entry.TrailName} - ${entry.HasPoints ? 'Completed' : 'Started'}` : 
            (entry.BonusObjectiveDescription ? entry.BonusObjectiveDescription : 'No activity registered')}
          </li>
        ))}
      </ul>
    </div>
  );
};


export default RecentRaceEntries;
