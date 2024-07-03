import React, { useEffect, useState } from 'react';
import { AdminSideMenu } from '../AdminSideMenu';
import Leaderboard from '@/app/leaderboard/page';
import '../../app/style.css'
import { AdminLeaderBoard } from '../AdminLeaderBoard';
import { AdminShareSettings } from '../AdminShareSettings';
import { AdminGiveawayDetails } from '../AdminGiveawayDetails';
import { AdminMobileMenu } from '../AdminMobileMenu';
import InlineSVG from 'react-inlinesvg';
import { useDarkMode } from '@/context/DarkModeContext';

export const AdminPage = () => {
  const [leaderboardCriteria, setLeaderboardCriteria] = useState('');
  const [shareInfo, setShareInfo] = useState('');
  const [giveawayDetails, setGiveawayDetails] = useState('');
  const [adminPage, setAdminPage] = useState("Leaderboard");
  const [adminMobileNav, setAdminMobileNav] = useState(false)
  const { darkMode } = useDarkMode();

  useEffect(()=> {
    setAdminMobileNav(false)
  }, [adminPage])

  const handleSave = async () => {
    // Implement save logic, possibly sending data to a backend server
    console.log('Saving:', { leaderboardCriteria, shareInfo, giveawayDetails });
    // You might want to add API call here
  };

  return (
    <div className={darkMode ? "dark" : ""}>
    <div className="admin-main relative">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="hidden md:block w-full md:w-3/12 side-nav bg-white dark:bg-slate-800">
            <AdminSideMenu setAdminPage={setAdminPage}/>
        </div>
        <div className="w-full md:w-9/12 grid grid-cols-1 gap-4">
            <div className='md:hidden block'>
              <div className="mobile-nav-div relative">
                <div className="admin-mobile-button dark:bg-slate-800" onClick={()=>setAdminMobileNav(!adminMobileNav)}>
                  <p className='text-xl font-bold dark:text-white'>
                    <InlineSVG
                            src="/images/menu.svg"
                            className="fill-current h-12"
                            /></p>
                </div>
              </div>
              {adminMobileNav && 
              <div className="mobile-nav-modal absolute dark:bg-slate-800 rounded-md">
                <AdminMobileMenu setAdminPage={setAdminPage} />
              </div>}
            </div>
            {adminPage === "Leaderboard" ? <AdminLeaderBoard /> :
             adminPage === "Share Settings" ? <AdminShareSettings /> :
             adminPage === "Giveaway Details" ? <AdminGiveawayDetails/> : "No components"
            }
        </div>
      </div>
    </div>
    </div>
  );
};
