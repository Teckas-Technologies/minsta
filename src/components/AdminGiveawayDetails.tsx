import { useDarkMode } from "@/context/DarkModeContext";

export const AdminGiveawayDetails = () => {

    const { darkMode } = useDarkMode();

    return (
        <div className={darkMode ? "dark" : ""}>
        <div className="admin-main-card h-full flex-col flex justify-between gap-3 dark:bg-slate-800">
            <div className="leader-board-title">
                <h2 className="text-xl text-center sm:text-left py-1 title-font dark:text-white">Giveaway Details</h2>
            </div>
            <div className="admin-leaderboard h-full flex items-center bg-white">
                <div className="giveaway-details-form">
                        <div className="giveaway-title">
                            <h2 className="text-xl text-center py-1 title-font">Reward Details</h2>
                        </div>
                    {/* <form action="#"> */}
                        <div className="input-field">
                            <label htmlFor="quantity" className="text-lg font-semibold">No of tokens:-</label>
                            <input type="text" name="quantity" placeholder="Enter the no of token" />
                        </div>
                        <div className="input-field">
                            <label htmlFor="token" className="text-lg font-semibold">Select the token:-</label>
                            <select name="token">
                                <option className="option" value="USDC"><p>USDC</p></option>
                                <option className="option" value="NEAR"><p>NEAR</p></option>
                                <option className="option" value="BTC"><p>BTC</p></option>
                            </select>
                        </div>
                    {/* </form> */}
                </div>
            </div>
            <div className="admin-leaderboard-footer flex justify-end">
                    <div className="leaderboard-actions flex gap-5 mr-3">
                        <button 
                            className="cancel-btn btn" 
                        >
                            Cancel
                        </button>
                        <button 
                            className="success-btn btn" 
                        >
                            Save
                        </button>
                    </div>
                </div>
        </div>
        </div>
    )
}