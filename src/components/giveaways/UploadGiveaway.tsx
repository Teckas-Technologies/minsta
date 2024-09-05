import { useDarkMode } from "@/context/DarkModeContext";
import { GiveawayType } from "@/data/types";
import { useSaveGiveaways } from "@/hooks/db/GiveawayHook";
import { useEffect, useState } from "react";

export const UploadGiveaway = () => {
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const [toast, setToast] = useState(false);
    const { saveGiveaway } = useSaveGiveaways();
    const [formData, setFormData] = useState<GiveawayType>({
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        totalPrizePool: 0,
        token: 'NEAR',
        winnerCount: 0,
    });

    useEffect(() => {
        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode]);

    useEffect(() => {
        if (toast) {
            setTimeout(() => {
                setToast(false);
            }, 5000)
        }
    }, [toast])

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: name === 'totalPrizePool' || name === 'winnerCount'
                ? value === '' ? '' : Number(value)
                : value,
        }));
    };

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const date = new Date(value);
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: date,
        }));
    };

    const handleSaveClick = async () => {
        const { startDate, endDate, ...rest } = formData;
        const formattedData: GiveawayType = {
            ...rest,
            startDate: startDate,
            endDate: endDate,
        };

        const result = await saveGiveaway(formattedData);
        if (result?.status === 200) {
            console.log('Giveaway saved successfully:', result);
            setToast(true);
            setFormData({
                title: '',
                description: '',
                startDate: new Date(),
                endDate: new Date(),
                totalPrizePool: 0,
                token: 'NEAR',
                winnerCount: 0,
            });
        } else {
            console.error('Failed to save giveaway');
            setFormData({
                title: '',
                description: '',
                startDate: new Date(),
                endDate: new Date(),
                totalPrizePool: 0,
                token: 'NEAR',
                winnerCount: 0,
            });
        }
    };

    const handleCancelClick = () => {
        setFormData({
            title: '',
            description: '',
            startDate: new Date(),
            endDate: new Date(),
            totalPrizePool: 0,
            token: 'NEAR',
            winnerCount: 0,
        });
    };

    const isFormValid = () => {
        return formData.title && formData.description && formData.startDate && formData.endDate && formData.totalPrizePool > 0 && formData.winnerCount > 0;
    };

    return (
        <>
            <div className="admin-leaderboard h-full flex items-center bg-white">
                <div className="giveaway-details-form">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="input-field">
                            <label htmlFor="title" className="text-lg font-semibold">Title:</label>
                            <input type="text" name="title" placeholder="Enter the title" value={formData.title} onChange={handleChangeInput} required className="mt-1 p-2 border rounded" />
                        </div>
                        <div className="input-field">
                            <label htmlFor="description" className="text-lg font-semibold">Description:</label>
                            <input type="text" name="description" placeholder="Enter the description" value={formData.description} onChange={handleChangeInput} required className="mt-1 p-2 border rounded" />
                        </div>
                        <div className="input-field">
                            <label htmlFor="startDate" className="text-lg font-semibold">Start Date:</label>
                            <input type="date" name="startDate" placeholder="Enter the start date" value={formData.startDate.toISOString().split('T')[0]} onChange={handleDateChange} required className="mt-1 p-2 border rounded" />
                        </div>
                        <div className="input-field">
                            <label htmlFor="endDate" className="text-lg font-semibold">End Date:</label>
                            <input type="date" name="endDate" placeholder="Enter the end date" value={formData.endDate.toISOString().split('T')[0]} onChange={handleDateChange} required className="mt-1 p-2 border rounded" />
                        </div>
                        <div className="input-field">
                            <label htmlFor="totalPrizePool" className="text-lg font-semibold">Total Prize Pool:</label>
                            <input type="number" name="totalPrizePool" placeholder="Enter the total prize pool" value={formData.totalPrizePool} onChange={handleChangeInput} required className="mt-1 p-2 border rounded" />
                        </div>
                        <div className="input-field">
                            <label htmlFor="winnerCount" className="text-lg font-semibold">Winner Count:</label>
                            <input type="number" name="winnerCount" placeholder="Enter the number of winners" value={formData.winnerCount} onChange={handleChangeInput} required className="mt-1 p-2 border rounded" />
                        </div>
                        <div className="input-field">
                            <label htmlFor="token" className="text-lg font-semibold">Select the token:</label>
                            <select name="token" value={formData.token} onChange={handleChangeSelect} className="mt-1 p-2 border rounded">
                                <option value="NEAR">NEAR</option>
                                {/* <option value="NEAR">NEAR</option> */}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="admin-leaderboard-footer flex justify-end">
                <div className="leaderboard-actions flex gap-5 mr-3">
                    <button
                        className="cancel-btn btn dark:text-white dark:border dark:border-white"
                        onClick={handleCancelClick}
                        disabled={!isFormValid()}
                    >
                        Cancel
                    </button>
                    <button
                        className="success-btn btn"
                        onClick={handleSaveClick}
                        disabled={!isFormValid()}
                    >
                        Save
                    </button>
                </div>
            </div>
            {toast &&
                <div id="toast-default" className="toast-container fixed top-11 mt-11 left-1/2 transform -translate-x-1/2 w-full max-w-xs px-4 sm:px-6 md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div className="box relative flex items-center w-full p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <span className="sr-only">Check icon</span>
                        </div>
                        <div className="ms-3 text-sm font-normal">Giveaway Added Successfully!</div>
                        <div className="border-bottom-animation absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
                    </div>
                </div>
            }
        </>
    )
}
