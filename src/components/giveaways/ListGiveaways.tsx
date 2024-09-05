import { useDarkMode } from "@/context/DarkModeContext";
import { GiveawayType } from "@/data/types";
import { useFetchGiveaways } from "@/hooks/db/GiveawayHook";
import { useGiveawayWinners } from "@/hooks/useGiveawayWinner";
import { NearContext } from "@/wallet/WalletSelector";
import { useContext, useEffect, useState } from "react";
import { GiveawayInfo } from "./GiveawayInfo";

export const ListGiveaways = () => {

    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const { wallet, signedAccountId } = useContext(NearContext);
    const { fetchGiveaways } = useFetchGiveaways();
    const [giveaways, setGiveaways] = useState<any>([]);
    const [onGoingGiveaways, setOnGoingGiveaways] = useState<any>([]);
    const [endedGiveaways, setEndedGiveaways] = useState<any>([]);
    const [upcomingGiveaways, setUpcomingGiveaways] = useState<any>([]);
    const [model, setModel] = useState(false);
    const [giveaway, setGiveaway] = useState<GiveawayType>();
    const [timeMessage, setTimeMessage] = useState('');
    const [winners, setWinners] = useState<any>([]);

    const { fetchTopMinters } = useGiveawayWinners();

    const handleModel = async (giveaway: GiveawayType) => {
        setModel(true);
        setGiveaway(giveaway);
        const startDate = giveaway.startDate ? new Date(giveaway.startDate).toISOString() : "2024-09-01T00:00:00Z";
        const endDate = giveaway.endDate ? new Date(giveaway.endDate).toISOString() : "2024-09-14T23:59:59Z";
        const currentDate = new Date().toISOString();

        if (currentDate > endDate) {
            const topMinters = await fetchTopMinters(startDate, endDate, giveaway?.winnerCount);
            console.log("topMinters", topMinters);
            setWinners(topMinters);
        } else {
            console.log("Giveaway hasn't ended yet. No need to fetch top minters.");
        }
        if (giveaway?.startDate && giveaway?.endDate) {
            const currentDate = new Date();
            const startDate = new Date(giveaway.startDate);
            const endDate = new Date(giveaway.endDate);

            const timeUntilStart = startDate.getTime() - currentDate.getTime();
            const timeUntilEnd = endDate.getTime() - currentDate.getTime();

            const daysUntilStart = Math.ceil(timeUntilStart / (1000 * 3600 * 24));
            const daysUntilEnd = Math.ceil(timeUntilEnd / (1000 * 3600 * 24));

            if (daysUntilStart > 1) {
                setTimeMessage(`Starts in ${daysUntilStart} days`);
            } else if (daysUntilStart === 1) {
                setTimeMessage('Starts tomorrow');
            } else if (daysUntilStart === 0 && currentDate < startDate) {
                setTimeMessage('Starts today');
            } else if (daysUntilEnd > 1) {
                setTimeMessage(`Ends in ${daysUntilEnd} days`);
            } else if (daysUntilEnd === 1) {
                setTimeMessage('Ends tomorrow');
            } else if (daysUntilEnd === 0 && currentDate <= endDate) {
                setTimeMessage('Ends today');
            } else {
                setTimeMessage('Giveaway ended');
            }
        } else {
            setTimeMessage('N/A');
        }
    }

    useEffect(() => {
        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode]);

    useEffect(() => {
        const fetchRewards = async () => {
            const goingGiveaways = await fetchGiveaways("ongoing");
            setOnGoingGiveaways(goingGiveaways);
            const comingGiveaways = await fetchGiveaways("upcoming");
            setUpcomingGiveaways(comingGiveaways);
            const endedGiveaways = await fetchGiveaways("ended");
            setEndedGiveaways(endedGiveaways);
        }
        if (signedAccountId) {
            fetchRewards();
        }
    }, [signedAccountId])

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB");
    };

    useEffect(() => {
        const fetchWinners = async () => {


        }
        if (signedAccountId) {
            fetchWinners()
        }

    }, [signedAccountId])


    return (
        <>
            <div className="admin-leaderboard relative h-full flex items-center bg-white">
                <div className="giveaway-details-form">
                    {/* On Going giveaways component */}
                    {onGoingGiveaways.length > 0 && <div className="giveaway-title">
                        <h2 className="text-xl text-center py-1 title-font underline underline-offset-4">On-going Giveaways</h2>
                    </div>}
                    {onGoingGiveaways.length > 0 && (
                        onGoingGiveaways.map((giveaway: GiveawayType, index: any) => {
                            const startDate = new Date(giveaway.startDate);
                            const endDate = new Date(giveaway.endDate);

                            return (
                                <div
                                    key={index}
                                    className="winner relative px-6 py-3  box-shadow flex items-center justify-between max-[600px]:flex-col gap-6 rounded-md my-1"
                                >
                                    <div className="left_1 flex items-center gap-3 justify-between max-[600px]:flex-col">
                                        <div className="content md:w-[20rem] max-[380px]:w-[15rem] w-[18rem]">
                                            <h2 className="title-font">{giveaway.title}</h2>
                                            <div className="account-id flex items-center gap-1">
                                                <p className="text-xs">
                                                    {formatDate(startDate)} - {formatDate(endDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="reward w-[10rem] flex justify-end">
                                            <div className="analytics-count flex items-end justify-end gap-3">
                                                <h2 className="text-3xl flex items-center">{giveaway.token === "NEAR" ? <div className="box-near h-10 w-12 p-2">
                                                    <img src="images/near-logo.png" className="h-full w-full object-contain" alt="" />
                                                </div> : "$"}{giveaway.totalPrizePool}</h2>
                                                <div className="flex items-center">
                                                    <p>
                                                        <span className="text-green-500"></span> Total
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="btn-holder w-35 flex justify-end">
                                        <button
                                            className="bg-sky-500 px-3 py-1 mt-1 rounded-2xl cursor-pointer"
                                            style={{ fontWeight: 600 }}
                                            onClick={() => handleModel(giveaway)}
                                        >
                                            Know More
                                        </button>
                                    </div>
                                    {/* <div className="absolute md:hidden top-1 right-1">
                                        <div className="box box-shadow bg-sky-50 rounded-3xl px-3 py-1 flex items-center gap-1">
                                            <div className="dot bg-green-400 w-2 h-2 rounded-full">
                                            </div>
                                            <h2>active</h2>
                                        </div>
                                    </div> */}
                                </div>
                            );
                        })
                    )}
                    {/* Upcoming giveaways component */}
                    {upcomingGiveaways.length > 0 && <div className="giveaway-title">
                        <h2 className="text-xl text-center py-1 title-font underline underline-offset-4">Upcoming Giveaways</h2>
                    </div>}
                    {upcomingGiveaways.length > 0 && (
                        upcomingGiveaways.map((giveaway: GiveawayType, index: any) => {
                            const startDate = new Date(giveaway.startDate);
                            const endDate = new Date(giveaway.endDate);

                            return (
                                <div
                                    key={index}
                                    className="winner relative px-6 py-3  box-shadow flex items-center justify-between max-[600px]:flex-col gap-6 rounded-md my-1"
                                >
                                    <div className="left_1 flex items-center gap-3 justify-between max-[600px]:flex-col">
                                        <div className="content md:w-[20rem] max-[380px]:w-[15rem] w-[18rem]">
                                            <h2 className="title-font">{giveaway.title}</h2>
                                            <div className="account-id flex items-center gap-1">
                                                <p className="text-xs">
                                                    {formatDate(startDate)} - {formatDate(endDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="reward w-[10rem] flex justify-end">
                                            <div className="analytics-count flex items-end justify-end gap-3">
                                                <h2 className="text-3xl flex items-center">{giveaway.token === "NEAR" ? <div className="box-near h-10 w-12 p-2">
                                                    <img src="images/near-logo.png" className="h-full w-full object-contain" alt="" />
                                                </div> : "$"}{giveaway.totalPrizePool}</h2>
                                                <div className="flex items-center">
                                                    <p>
                                                        <span className="text-green-500"></span> Total
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="btn-holder w-35 flex justify-end">
                                        <button
                                            className="bg-sky-500 px-3 py-1 mt-1 rounded-2xl cursor-pointer"
                                            style={{ fontWeight: 600 }}
                                            onClick={() => handleModel(giveaway)}
                                        >
                                            Know More
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {/* Ended giveaways component */}
                    {endedGiveaways.length > 0 && <div className="giveaway-title">
                        <h2 className="text-xl text-center py-1 title-font underline underline-offset-4">Ended Giveaways</h2>
                    </div>}
                    {endedGiveaways.length > 0 && (
                        endedGiveaways.map((giveaway: GiveawayType, index: any) => {
                            const startDate = new Date(giveaway.startDate);
                            const endDate = new Date(giveaway.endDate);

                            return (
                                <div
                                    key={index}
                                    className="winner relative px-6 py-3  box-shadow flex items-center justify-between max-[600px]:flex-col gap-6 rounded-md my-1"
                                >
                                    <div className="left_1 flex items-center gap-3 justify-between max-[600px]:flex-col">
                                        <div className="content md:w-[20rem] max-[380px]:w-[15rem] w-[18rem]">
                                            <h2 className="title-font">{giveaway.title}</h2>
                                            <div className="account-id flex items-center gap-1">
                                                <p className="text-xs">
                                                    {formatDate(startDate)} - {formatDate(endDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="reward w-[10rem] flex justify-end">
                                            <div className="analytics-count flex items-end justify-end gap-3">
                                                <h2 className="text-3xl flex items-center">{giveaway.token === "NEAR" ? <div className="box-near h-10 w-12 p-2">
                                                    <img src="images/near-logo.png" className="h-full w-full object-contain" alt="" />
                                                </div> : "$"}{giveaway.totalPrizePool}</h2>
                                                <div className="flex items-center">
                                                    <p>
                                                        <span className="text-green-500"></span> Total
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="btn-holder w-35 flex justify-end">
                                        <button
                                            className="bg-sky-500 px-3 py-1 mt-1 rounded-2xl cursor-pointer"
                                            style={{ fontWeight: 600 }}
                                            onClick={() => handleModel(giveaway)}
                                        >
                                            Know More
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                {model && <GiveawayInfo giveaway={giveaway} winners={winners} setModel={setModel} timeMessage={timeMessage} />}
            </div>
        </>
    )
}