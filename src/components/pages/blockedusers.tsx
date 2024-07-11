import { useDarkMode } from "@/context/DarkModeContext";
import { BlockUserType } from "@/data/types";
import { useMbWallet } from "@mintbase-js/react";
import { useEffect, useState } from "react";
import { useFetchBlockUser, useSaveBlockUser } from "@/hooks/db/BlockUserHook";
import InlineSVG from "react-inlinesvg";

export const BlockedUsersPage = () => {
    const {activeAccountId, connect, isConnected} = useMbWallet();
    const { darkMode } = useDarkMode();
    const [showModal, setShowModal] = useState(false);
    const [selectedBlockedUsers, setSelectedBlockedUsers] = useState<any>([]);
    const { fetchBlockUser } = useFetchBlockUser();
    const { saveBlockUser } = useSaveBlockUser();
    const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeAccountId) {
            fetchBlockedUsers(activeAccountId);
        }
    }, [activeAccountId, blockedUsers]);

    const fetchBlockedUsers = async (activeAccount : string) => {
        const blockedUsersData = await fetchBlockUser(activeAccount);
        if (blockedUsersData?.blockedUsers) {
            setBlockedUsers(blockedUsersData.blockedUsers.map(blockedUser => blockedUser.blockedUserId));
        }
        setLoading(false);
    }

    const handleSelectBlockedUser = (blockedUser: any) => {
        if (selectedBlockedUsers.includes(blockedUser)) {
            setSelectedBlockedUsers(selectedBlockedUsers.filter((item: any) => item !== blockedUser));
        } else {
            setSelectedBlockedUsers([...selectedBlockedUsers, blockedUser]);
        }
    }

    const handleReset = () => {
        if (selectedBlockedUsers.length > 0) {
            console.log(`Reset details for ${selectedBlockedUsers.join(', ')}`);
            setSelectedBlockedUsers([]);
            setShowModal(false);
        }
    }

    const handleUnblock = async () => {
        if (selectedBlockedUsers.length > 0) {
            const data: BlockUserType & { unblock?: boolean } = {
                accountId: activeAccountId?.toString() || "",
                blockedUsers: selectedBlockedUsers.map((id: string) => ({ blockedUserId: id })),
                unblock: true
            }
            await saveBlockUser(data).then((res)=> {
                console.log(res?.status)
                setSelectedBlockedUsers([]);
                setShowModal(false);
            });
        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    return (
        <div className={darkMode ? "dark" : ""}>
        <main className="px-4 lg:px-12 mx-auto h-full w-[100%] pb-3 flex flex-col items-center justify-start space-y-4 mt-5 bg-slate-50 dark:bg-slate-800 min-h-[99vh]">
            <div className="page-title mt-20">
                <h2 className="title-font text-3xl dark:text-white underline underline-offset-4">Blocked Users</h2>
            </div>
            <div className={`${darkMode ? "dark" : ""} ${darkMode ? "box-shadow-dark" : "box-shadow"} rounded-lg w-full md:max-w-[40rem] sm:max-w-[23.5rem]`}>
            <div className={`blocked-users md:px-5 md:pt-5 md:pb-3 h-full max-h-[75vh] pb-3 flex-col flex justify-between gap-3 dark:bg-slate-800`}>
                
                <div className={`blocked-user-board bg-white h-auto ${loading || blockedUsers.length === 0 ? "flex items-center justify-center" : ""} `}>
                    {!loading ? 
                    <form action="/">
                        {blockedUsers.length > 0 ? 
                         blockedUsers.map((blockeduser:any, i:any) => (
                            <div className="leader w-full flex gap-3 mt-2 items-center" key={i}>
                                <div className="select-leader">
                                    <input 
                                        type="checkbox" 
                                        name="leader" 
                                        value={blockeduser} 
                                        checked={selectedBlockedUsers.includes(blockeduser)}
                                        onChange={() => handleSelectBlockedUser(blockeduser)}
                                    />
                                </div>
                                <div className="leaderboard-account cursor-pointer flex justify-between items-center" onClick={() => handleSelectBlockedUser(blockeduser)}>
                                    <div className="account-name">
                                        <p className=" truncate">{blockeduser}</p>
                                    </div>
                                    <div className="account-right flex items-center">
                                        {/* <div className="credit-icon">
                                            <span role="img" aria-label="fire" className="mr-2">
                                                🔥
                                            </span>
                                        </div> */}
                                        <div className="count">
                                            <p>{"5"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : 
                        <div className="empty-list flex gap-3 items-center">
                            <InlineSVG
                                src="/images/no_data.svg"
                                className="fill-current text-camera h-6 text-slate-800"
                            />
                            <h2>No Blocked Users!</h2>
                        </div> }
                    </form> : 
                    <div className='w-[100%] h-[100%] flex items-center justify-center'>
                        <div className='loader'>
                        </div>
                    </div>}
                </div>
                <div className={`admin-leaderboard-footer flex justify-end ${loading || blockedUsers.length === 0 ? "hidden" : ""}`}>
                    <div className="leaderboard-actions flex gap-5 mr-3">
                        <button 
                            className="reset-btn btn" 
                            onClick={handleReset} 
                            disabled={selectedBlockedUsers.length === 0}
                        >
                            Cancel
                        </button>
                        <button 
                            className="delete-btn btn" 
                            onClick={() => openModal()}
                            disabled={selectedBlockedUsers.length === 0}
                        >
                            Unblock
                        </button>
                    </div>
                </div>
                {showModal && 
                <div className="admin-leaderboard-modal-page">
                    <div className="admin-leaderboard-modal">
                        <div className="action-title">
                            <h2>Are you sure you want to unblock the selected users?</h2>
                        </div>
                        <div className="action-btns flex gap-3">
                            <button className='cancel-btn btn' onClick={() => {setShowModal(false); handleReset()}}>Cancel</button>
                            <button className='delete-btn btn'
                                onClick={handleUnblock}
                            >
                                Unblock
                            </button>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
        </main>
        </div>
    )
}