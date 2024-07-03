import React, { useState } from 'react';
import "../app/style.css"
import { useLeaderBoardData } from '@/hooks/useLeaderboard';
import { useDarkMode } from '@/context/DarkModeContext';

interface Leaderboard {
    account: string;
    count: number;
}


export const AdminLeaderBoard = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState<string>("");
    const [selectedLeaders, setSelectedLeaders] = useState<any>([]);
    const [leaderList, setLeaderList] = useState<Leaderboard[]>([]);
    const { leaderboard, activeAccountId, texts} = useLeaderBoardData();
    const { darkMode } = useDarkMode();

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
            setLeaderList(leaderboard.filter(leader => !selectedLeaders.includes(leader)));
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
            <div className="admin-main-card h-full flex-col flex justify-between gap-3 dark:bg-slate-800">
                <div className="leader-board-title">
                <h2 className="text-xl text-center sm:text-left py-1 title-font dark:text-white">Leaderboard</h2>
                </div>
                <div className="admin-leaderboard bg-white">
                    <form action="/">
                        {leaderboard.map((leader, i) => (
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
                    </form>
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
    )
}

