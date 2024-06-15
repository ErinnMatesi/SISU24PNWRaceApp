import React, { useEffect, useState } from 'react';
import { useRaceEntries } from './RaceEntryContext';
import './index.css';

const RecentRaceEntries = () => {
  const [entries, setEntries] = useState([]);
  const { updateTrigger } = useRaceEntries();

  useEffect(() => {
    console.log('updateTrigger changed:', updateTrigger);
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
          console.log("Fetched recent entries data:", data);
          setEntries(data);
          console.log("Entries state updated:", data);
      } catch (error) {
          console.error('Failed to fetch recent race entries:', error);
      }
  };

  return (
    <div className="recent-entries-container">
      <h3 className="recent-entries-header">Recent Race Entries</h3>
      <ul className="recent-entries-list">
      {console.log("Rendering entries:", entries)}
        {entries.map((entry) => (
          <li key={entry.EntryID} className="recent-entry-item">
            {entry.FirstName} {entry.LastName} (Bib: {entry.BibNumber}) - 
            {entry.TrailName ? (
                entry.EndTime ? `${entry.TrailName} - Completed` : `${entry.TrailName} - Started`
            ) : (
                entry.BonusObjectiveDescription ? entry.BonusObjectiveDescription : 'No activity registered'
            )}
        </li>
        ))}
      </ul>
    </div>
  );
};


export default RecentRaceEntries;