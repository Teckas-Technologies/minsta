import { useDarkMode } from "@/context/DarkModeContext";
import { InfiniteScrollHook } from "@/data/types";
import { useSearchTokenByOwner } from "@/hooks/useSearchTokenByOwner";
import { useMbWallet } from "@mintbase-js/react";
import { useEffect, useState } from "react";
import { useFetchHiddenPost } from "@/hooks/db/HidePostHook";
import { useLeaderBoardData } from "@/hooks/useLeaderboard";

interface Leaderboard {
    account: string;
    count: number;
}

export const BlockedUsersPage = () => {
    const {activeAccountId, connect, isConnected} = useMbWallet();
    const { darkMode } = useDarkMode();
    const owenerid = activeAccountId?.toString();
    const [newData, setNewData] = useState<InfiniteScrollHook | undefined>();
    const { data, isLoading } = useSearchTokenByOwner(owenerid ? owenerid : "");
    const [toast, setToast] = useState(false);

    const { hiddenPost } = useFetchHiddenPost();

    useEffect(()=> {
        if(toast) {
            setTimeout(()=> {
                setToast(false);
                window.location.reload();
            }, 5000)
        }
    }, [toast])

    // ====================

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState<string>("");
    const [selectedLeaders, setSelectedLeaders] = useState<any>([]);
    const [leaderList, setLeaderList] = useState<Leaderboard[]>([]);
    const { leaderboard, texts} = useLeaderBoardData();

    const handleSelectLeader = (leader: any) => {
        if (selectedLeaders.includes(leader)) {
            setSelectedLeaders(selectedLeaders.filter((item: any) => item !== leader));
        } else {
            setSelectedLeaders([...selectedLeaders, leader]);
        }
    }

    const handleReset = () => {
        if (selectedLeaders.length > 0) {
            console.log(`Reset details for ${selectedLeaders.join(', ')}`);
            setSelectedLeaders([]);
            setShowModal(false);
        }
    }

    const handleDelete = () => {
        if (selectedLeaders.length > 0) {
            setLeaderList(leaderboard.filter((leader:any) => !selectedLeaders.includes(leader)));
            setSelectedLeaders([]);
            setShowModal(false);
            console.log("Users deleted")
        }
    }

    const openModal = (action: string) => {
        setModalAction(action);
        setShowModal(true);
    }

    return (
        <div className={darkMode ? "dark" : ""}>
        <main className="px-4 lg:px-12 mx-auto h-full w-[100%] pb-3 flex flex-col items-center justify-start space-y-4 mt-5 bg-slate-50 dark:bg-slate-800 min-h-[99vh]">
            <div className="page-title mt-20">
                <h2 className="title-font text-3xl dark:text-white underline underline-offset-4">Blocked Users</h2>
            </div>
            <div className={`${darkMode ? "dark" : ""} ${darkMode ? "box-shadow-dark" : "box-shadow"} rounded-lg w-full md:max-w-[40rem] sm:max-w-[23.5rem]`}>
            <div className={`blocked-users md:px-5 md:py-5 h-full max-h-[75vh] pb-3 flex-col flex justify-between gap-3 dark:bg-slate-800`}>
                
                <div className="blocked-user-board bg-white h-auto">
                    {leaderboard.length > 0 ? 
                    <form action="/">
                        {leaderboard.map((leader:any, i:any) => (
                            <div className="leader w-full flex gap-3 mt-2 items-center" key={i}>
                                <div className="select-leader">
                                    <input 
                                        type="checkbox" 
                                        name="leader" 
                                        value={leader.account} 
                                        checked={selectedLeaders.includes(leader)}
                                        onChange={() => handleSelectLeader(leader)}
                                    />
                                </div>
                                <div className="leaderboard-account cursor-pointer flex justify-between items-center" onClick={() => handleSelectLeader(leader)}>
                                    <div className="account-name">
                                        <p className=" truncate">{leader.account}</p>
                                    </div>
                                    <div className="account-right flex items-center">
                                        <div className="credit-icon">
                                            <span role="img" aria-label="fire" className="mr-2">
                                                🔥
                                            </span>
                                        </div>
                                        <div className="count">
                                            <p>{leader.count}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </form> : 
                    <div className='w-full h-full flex items-center justify-center'>
                        <div className='loader'>
                        </div>
                    </div>}
                </div>
                <div className="admin-leaderboard-footer flex justify-end">
                    <div className="leaderboard-actions flex gap-5 mr-3">
                        <button 
                            className="reset-btn btn" 
                            onClick={() => openModal('reset')} 
                            disabled={selectedLeaders.length === 0}
                        >
                            Reset
                        </button>
                        <button 
                            className="delete-btn btn" 
                            onClick={() => openModal('delete')}
                            disabled={selectedLeaders.length === 0}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                {showModal && 
                <div className="admin-leaderboard-modal-page">
                    <div className="admin-leaderboard-modal">
                        <div className="action-title">
                            <h2>
                                {modalAction === 'delete' ? 
                                    `Are you sure you want to delete the selected users?` :
                                    `Are you sure you want to reset the details of the selected users?`}
                            </h2>
                        </div>
                        <div className="action-btns flex gap-3">
                            <button className='cancel-btn btn' onClick={() => setShowModal(false)}>Cancel</button>
                            <button className={modalAction === 'delete' ? 'delete-btn btn' : 'reset-btn btn'} 
                                onClick={modalAction === 'delete' ? handleDelete : handleReset}
                            >
                                {modalAction === 'delete' ? 'Delete' : 'Reset'}
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