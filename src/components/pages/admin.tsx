import React, { useState } from 'react';
import { AdminSideMenu } from '../AdminSideMenu';
import Leaderboard from '@/app/leaderboard/page';
import '../../app/style.css'
import { AdminLeaderBoard } from '../AdminLeaderBoard';
import { AdminShareSettings } from '../AdminShareSettings';
import { AdminGiveawayDetails } from '../AdminGiveawayDetails';

export const AdminPage = () => {
  const [leaderboardCriteria, setLeaderboardCriteria] = useState('');
  const [shareInfo, setShareInfo] = useState('');
  const [giveawayDetails, setGiveawayDetails] = useState('');
  const [adminPage, setAdminPage] = useState("Leaderboard");
  const [adminMobileNav, setAdminMobileNav] = useState(true)

  const handleSave = async () => {
    // Implement save logic, possibly sending data to a backend server
    console.log('Saving:', { leaderboardCriteria, shareInfo, giveawayDetails });
    // You might want to add API call here
  };

  return (
    <div className="admin-main relative">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="hidden md:block w-full md:w-3/12 side-nav">
            <AdminSideMenu setAdminPage={setAdminPage}/>
        </div>
        <div className="w-full md:w-9/12 grid grid-cols-1 gap-4">
            <div className='md:hidden block'>
              <div className="mobile-nav-div relative">
                <div className="admin-mobile-button" onClick={()=>setAdminMobileNav(!adminMobileNav)}>
                  <p className='text-xl font-bold'>=</p>
                </div>
              </div>
              {adminMobileNav && 
              <div className="mobile-nav-modal absolute">
                <ul>
                  <li>Leaderboard</li>
                  <li>Share Settings</li>
                  <li>Giveaway Details</li>
                </ul>
              </div>}
            </div>
            {adminPage === "Leaderboard" ? <AdminLeaderBoard /> :
             adminPage === "Share Settings" ? <AdminShareSettings /> :
             adminPage === "Giveaway Details" ? <AdminGiveawayDetails/> : "No components"
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
