import React, { useState } from 'react';
import { AdminSideMenu } from '../AdminSideMenu';
import Leaderboard from '@/app/leaderboard/page';
import '../../app/style.css'

export const AdminPage = () => {
  const [leaderboardCriteria, setLeaderboardCriteria] = useState('');
  const [shareInfo, setShareInfo] = useState('');
  const [giveawayDetails, setGiveawayDetails] = useState('');
  const [adminPage, setAdminPage] = useState("Leaderboard");

  const handleSave = async () => {
    // Implement save logic, possibly sending data to a backend server
    console.log('Saving:', { leaderboardCriteria, shareInfo, giveawayDetails });
    // You might want to add API call here
  };

  return (
    <div className="admin-main">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="hidden md:block w-full md:w-3/12 side-course p-5">
            <AdminSideMenu setAdminPage={setAdminPage}/>
        </div>
        <div className="w-full md:w-9/12 grid grid-cols-1 gap-4">
            {adminPage === "Leaderboard" ? <div className="leaderboard">
              <div className="btns flex gap-4">
                <button className='reset-btn btn'>Reset</button>
                <button className='delete-btn btn'>Delete</button>
              </div>
            </div> :
             adminPage === "Share Settings" ? <h1>Share Settings</h1> :
             adminPage === "Giveaway Details" ? <h1>Giveaway Details</h1>: "No components"
            }
        </div>
      </div>
    </div>
    // <div className="pt-20 text-center">
    //   <h1>Admin Dashboard</h1>
    //   <form onSubmit={(e) => {
    //     e.preventDefault();
    //     handleSave();
    //   }}>
    //     <div>
    //       <label htmlFor="leaderboardCriteria">Leaderboard Criteria:</label>
    //       <input
    //         type="text"
    //         id="leaderboardCriteria"
    //         value={leaderboardCriteria}
    //         onChange={(e) => setLeaderboardCriteria(e.target.value)}
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="shareInfo">Share Settings:</label>
    //       <input
    //         type="text"
    //         id="shareInfo"
    //         value={shareInfo}
    //         onChange={(e) => setShareInfo(e.target.value)}
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="giveawayDetails">Giveaway Details:</label>
    //       <input
    //         type="text"
    //         id="giveawayDetails"
    //         value={giveawayDetails}
    //         onChange={(e) => setGiveawayDetails(e.target.value)}
    //       />
    //     </div>
    //     <button type="submit">Save Settings</button>
    //   </form>
    // </div>
  );
};
