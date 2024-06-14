import React, { useState } from 'react';

export const AdminPage = () => {
  const [leaderboardCriteria, setLeaderboardCriteria] = useState('');
  const [shareInfo, setShareInfo] = useState('');
  const [giveawayDetails, setGiveawayDetails] = useState('');

  const handleSave = async () => {
    // Implement save logic, possibly sending data to a backend server
    console.log('Saving:', { leaderboardCriteria, shareInfo, giveawayDetails });
    // You might want to add API call here
  };

  return (
    <div className="pt-20 text-center">
      <h1>Admin Dashboard</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}>
        <div>
          <label htmlFor="leaderboardCriteria">Leaderboard Criteria:</label>
          <input
            type="text"
            id="leaderboardCriteria"
            value={leaderboardCriteria}
            onChange={(e) => setLeaderboardCriteria(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="shareInfo">Share Settings:</label>
          <input
            type="text"
            id="shareInfo"
            value={shareInfo}
            onChange={(e) => setShareInfo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="giveawayDetails">Giveaway Details:</label>
          <input
            type="text"
            id="giveawayDetails"
            value={giveawayDetails}
            onChange={(e) => setGiveawayDetails(e.target.value)}
          />
        </div>
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};
