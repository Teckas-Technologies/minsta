import React, { useState } from 'react';
import "../app/style.css"

const leaders = [
    { name: "User 1", count: "102" },
    { name: "User 2", count: "56" },
    { name: "User 3", count: "78" },
    { name: "User 4", count: "45" },
    { name: "User 5", count: "89" },
    { name: "User 6", count: "23" },
    { name: "User 7", count: "34" },
    { name: "User 8", count: "90" },
    { name: "User 9", count: "67" },
    { name: "User 10", count: "12" },
    { name: "User 11", count: "47" },
    { name: "User 12", count: "56" },
    { name: "User 13", count: "78" },
    { name: "User 14", count: "34" },
    { name: "User 15", count: "56" }
];


export const AdminLeaderBoard = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState<string>("");
    const [selectedLeaders, setSelectedLeaders] = useState<any>([]);
    const [leaderList, setLeaderList] = useState(leaders);

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
            setLeaderList(leaderList.filter(leader => !selectedLeaders.includes(leader)));
            setSelectedLeaders([]);
            setShowModal(false);
        }
    }

    const openModal = (action: string) => {
        setModalAction(action);
        setShowModal(true);
    }

    return (
        <>
            <div className="admin-main-card h-full flex-col flex justify-between gap-3">
                <div className="leader-board-title">
                <h2 className="text-xl text-center sm:text-left py-1 title-font">Leaderboard</h2>
                </div>
                <div className="admin-leaderboard">
                    <form action="/">
                        {leaderList.map((leader, i) => (
                            <div className="leader flex gap-3 mt-2 items-center" key={i}>
                                <div className="select-leader">
                                    <input 
                                        type="checkbox" 
                                        name="leader" 
                                        value={leader.name} 
                                        checked={selectedLeaders.includes(leader)}
                                        onChange={() => handleSelectLeader(leader)}
                                    />
                                </div>
                                <div className="leaderboard-account cursor-pointer w-full flex justify-between items-center" onClick={() => handleSelectLeader(leader)}>
                                    <h3>{leader.name}</h3>
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
                    <div className="leaderboard-actions flex gap-5">
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
        </>
    )
}

