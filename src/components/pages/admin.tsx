import React, { useContext, useEffect, useState } from 'react';
import { AdminSideMenu } from '../AdminSideMenu';
import Leaderboard from '@/app/leaderboard/page';
import '../../app/style.css'
import { AdminLeaderBoard } from '../AdminLeaderBoard';
import { AdminShareSettings } from '../AdminShareSettings';
import { AdminGiveawayDetails } from '../AdminGiveawayDetails';
import { AdminMobileMenu } from '../AdminMobileMenu';
import InlineSVG from 'react-inlinesvg';
import { useDarkMode } from '@/context/DarkModeContext';
import { useFetchHashes, useSaveHashes } from '@/hooks/db/HashHook';
import { NearContext } from '@/wallet/WalletSelector';
import * as nearAPI from "near-api-js";

export const AdminPage = () => {
  const [leaderboardCriteria, setLeaderboardCriteria] = useState('');
  const [shareInfo, setShareInfo] = useState('');
  const [giveawayDetails, setGiveawayDetails] = useState('');
  const [adminPage, setAdminPage] = useState("Leaderboard");
  const [adminMobileNav, setAdminMobileNav] = useState(false)
  const [darkMode, setDarkMode] = useState<boolean>();
  const { mode } = useDarkMode();

  useEffect(() => {
    if (mode === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [mode])

  useEffect(() => {
    setAdminMobileNav(false)
  }, [adminPage])

  const handleSave = async () => {
    // Implement save logic, possibly sending data to a backend server
    console.log('Saving:', { leaderboardCriteria, shareInfo, giveawayDetails });
    // You might want to add API call here
  };

  const { fetchHashes } = useFetchHashes();
  const { saveHashes } = useSaveHashes();
  const { wallet, signedAccountId } = useContext(NearContext);

  useEffect(() => {
    const getresult = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams) {
        const hashParam = searchParams.get('transactionHashes');
        console.log("Hash >> ", hashParam);
        if (hashParam) {
          const hashesArray = hashParam.split('%2C');
          console.log("Hashes Array >> ", hashesArray);

          for (const hash of hashesArray) {
            try {
              const res = await fetchHashes(hash);
              if (res?.exist) {
                continue;
              }
              const result = await wallet?.getTransactionResult(hash);
              const amt = nearAPI.utils.format.formatNearAmount(result?.amount);
              if (result?.success && result.signerId) {
                await saveHashes({
                  hash: hash,
                  accountId: result.receiverId,
                  amount: parseFloat(amt),
                });
              }
            } catch (err) {
              console.log("Error processing hash >> ", hash, err);
            }
          }
        }
      }
    }
    getresult();
  }, [signedAccountId])

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="admin-main relative">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="hidden md:block w-full md:w-3/12 side-nav bg-white dark:bg-slate-800">
            <AdminSideMenu setAdminPage={setAdminPage} />
          </div>
          <div className="w-full md:w-9/12 grid grid-cols-1 gap-4">
            <div className='md:hidden block'>
              <div className="mobile-nav-div relative">
                <div className="admin-mobile-button dark:bg-slate-800" onClick={() => setAdminMobileNav(!adminMobileNav)}>
                  <p className='text-xl font-bold dark:text-white'>
                    <InlineSVG
                      src="/images/menu.svg"
                      className="fill-current h-12"
                    /></p>
                </div>
              </div>
              {adminMobileNav &&
                <div className="mobile-nav-modal absolute dark:bg-slate-800 rounded-md z-50">
                  <AdminMobileMenu setAdminPage={setAdminPage} />
                </div>}
            </div>
            {adminPage === "Leaderboard" ? <AdminLeaderBoard /> :
              adminPage === "Share Settings" ? <AdminShareSettings /> :
                adminPage === "Giveaway Details" ? <AdminGiveawayDetails /> : "No components"
            }
          </div>
        </div>
      </div>
    </div>
  );
};
