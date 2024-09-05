import { useDarkMode } from "@/context/DarkModeContext";
import { useContext, useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg";
import { CoptText } from "../CopyText";
import FollowButton from "../buttons/follow-button";
import { useStats } from "@/hooks/useStats";
import { useFetchTotalProfiles } from "@/hooks/db/ProfileHook";
import { useFetchTotalAmount } from "@/hooks/db/HashHook";
import { calculateCredit } from "@/utils/calculateCredit";
import { useFetchGiveaways } from "@/hooks/db/GiveawayHook";
import { NearContext } from "@/wallet/WalletSelector";
import { GiveawayType } from "@/data/types";

export const StatsPage = () => {
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const [modalOpen, setModelOpen] = useState(false);
    const { fetchTotalAmount } = useFetchTotalAmount();
    const [totalAmount, setTotalAmount] = useState({ totalAmtLastMonth: 0, totalAmtLifeTime: 0 });
    const [onGoingGiveaways, setOnGoingGiveaways] = useState<any>([]);
    const [endedGiveaways, setEndedGiveaways] = useState<any>([]);
    const [upcomingGiveaways, setUpcomingGiveaways] = useState<any>([]);
    const { fetchGiveaways } = useFetchGiveaways();
    const { wallet, signedAccountId } = useContext(NearContext);

    useEffect(() => {
        const fetchCreditAmt = async () => {
            const res = await fetchTotalAmount();
            if (res) {
                setTotalAmount({
                    totalAmtLastMonth: res.totalAmount.totalLast30Days,
                    totalAmtLifeTime: res.totalAmount.totalLifetime
                })
            }
        }
        fetchCreditAmt();

        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode])
    const { data, totalNFTs, distinctOwners, totalNFTsLast30Days, distinctOwnersLast30Days } = useStats();
    const { totalProfiles, lastMonthProfiles, loading, error } = useFetchTotalProfiles();

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

    const [model, setModel] = useState(false);
    const [giveaway, setGiveaway] = useState<GiveawayType>();
    const [timeMessage, setTimeMessage] = useState('');

    const handleModel = (giveaway: GiveawayType) => {
        setModel(true);
        setGiveaway(giveaway);
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

    return (
        <div className={darkMode ? "dark" : ""}>
            <main className="relative px-1 lg:px-12 pb-5 mx-auto flex flex-col items-center justify-start pt-[5rem] bg-sky-50 dark:bg-slate-800 min-h-[99vh] h-auto scroll-smooth overflow-y-scroll">
                <div className="title-stats mt-5">
                    <h2 className="title-font dark:text-white text-2xl underline underline-offset-4">Stats</h2>
                </div>
                <div className="analytics px-5 py-2 mt-5 flex flex-wrap items-center gap-11 w-full">
                    <div className={`analytic-box bg-white group ${darkMode && "box-shadow-dark"} rounded-md flex flex-col justify-between px-5 pb-5 pt-3`}>
                        <div className="analytic-title py-2">
                            <h2 className="text-base flex items-center gap-2"><div className="circle bg-white group-hover:bg-green-200 p-1 rounded-full">
                                <InlineSVG
                                    src="/images/dot.svg"
                                    className="fill-current w-2 h-2 text-green-500"
                                /></div> Total Users</h2>
                        </div>
                        <div className="analytics-count flex items-end gap-3">
                            <h2 className="text-3xl">{totalProfiles}</h2>
                            <div className="flex items-center"><InlineSVG
                                src="/images/arrow_up.svg"
                                className="fill-current text-green-500"
                            /> <p><span className="text-green-500">{lastMonthProfiles}</span> last month</p></div>
                        </div>
                    </div>
                    <div className={`analytic-box bg-white group ${darkMode && "box-shadow-dark"} rounded-md flex flex-col justify-between px-5 pb-5 pt-3`}>
                        <div className="analytic-title py-2">
                            <h2 className="text-base flex items-center gap-2"><div className="circle bg-white group-hover:bg-green-200 p-1 rounded-full">
                                <InlineSVG
                                    src="/images/dot.svg"
                                    className="fill-current w-2 h-2 text-green-500"
                                /></div> Total NFTs</h2>
                        </div>
                        <div className="analytics-count flex items-end gap-3">
                            <h2 className="text-3xl">{totalNFTs}</h2>
                            <div className="flex items-center"><InlineSVG
                                src="/images/arrow_up.svg"
                                className="fill-current text-green-500"
                            /> <p><span className="text-green-500">{totalNFTsLast30Days}</span> last month</p></div>
                        </div>
                    </div>
                    <div className={`analytic-box bg-white group ${darkMode && "box-shadow-dark"} rounded-md flex flex-col justify-between px-5 pb-5 pt-3`}>
                        <div className="analytic-title py-2">
                            <h2 className="text-base flex items-center gap-2"><div className="circle bg-white group-hover:bg-green-200 p-1 rounded-full">
                                <InlineSVG
                                    src="/images/dot.svg"
                                    className="fill-current w-2 h-2 text-green-500"
                                /></div> Total Credits</h2>
                        </div>
                        <div className="analytics-count flex items-end gap-3">
                            <h2 className="text-3xl">{totalAmount.totalAmtLifeTime !== 0 ? calculateCredit(totalAmount.totalAmtLifeTime) : totalAmount.totalAmtLifeTime}</h2>
                            <div className="flex items-center"><InlineSVG
                                src="/images/arrow_up.svg"
                                className="fill-current text-green-500"
                            /> <p><span className="text-green-500">{totalAmount.totalAmtLastMonth !== 0 ? calculateCredit(totalAmount.totalAmtLastMonth) : totalAmount.totalAmtLastMonth}</span> last month</p></div>
                        </div>
                    </div>
                    <div className={`analytic-box bg-white group ${darkMode && "box-shadow-dark"} rounded-md flex flex-col justify-between px-5 pb-5 pt-3`}>
                        <div className="analytic-title py-2">
                            <h2 className="text-base flex items-center gap-2"><div className="circle bg-white group-hover:bg-green-200 p-1 rounded-full">
                                <InlineSVG
                                    src="/images/dot.svg"
                                    className="fill-current w-2 h-2 text-green-500"
                                /></div> Active Users</h2>
                        </div>
                        <div className="analytics-count flex items-end gap-3">
                            <h2 className="text-3xl">{distinctOwners}</h2>
                            <div className="flex items-center"><InlineSVG
                                src="/images/arrow_up.svg"
                                className="fill-current text-green-500"
                            /> <p><span className="text-green-500">{distinctOwnersLast30Days}</span> last month</p></div>
                        </div>
                    </div>
                </div>
                <div className="analytics-2 px-5 py-2 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-11 w-full">
                    <div className={`winner-box bg-white group ${darkMode && "box-shadow-dark"} rounded-md flex flex-col justify-between px-5 pb-5 pt-3`}>
                        <div className="analytic-title py-2">
                            <h2 className="text-base flex items-center gap-2"><div className="circle bg-white group-hover:bg-green-200 p-1 rounded-full">
                                <InlineSVG
                                    src="/images/dot.svg"
                                    className="fill-current w-2 h-2 text-green-500"
                                /></div> Last Week Winners</h2>
                        </div>
                        <div className="analytics-winners">
                            <div className="winner px-6 py-2 flex items-center justify-between max-[600px]:flex-col gap-3 rounded-md my-3">
                                <div className="left flex items-center gap-3">
                                    <div className="trophy">
                                        <InlineSVG
                                            src="/images/trophy_1.svg"
                                            className="fill-current w-11 h-11 text-yellow-500"
                                        />
                                    </div>
                                    <div className="content">
                                        <h2 className="title-font">Johnson</h2>
                                        <div className="account-id flex items-center gap-1">
                                            <p>johnson.testnet</p>
                                            <CoptText text="johnson.testnet" profilePage={false} />
                                        </div>
                                    </div>
                                </div>
                                <div className="folloe">
                                    <FollowButton accountId="johnson.testnet" />
                                </div>
                            </div>
                            <div className="winner px-6 py-2 flex items-center justify-between max-[600px]:flex-col gap-3 rounded-md my-3">
                                <div className="left flex items-center gap-3">
                                    <div className="trophy">
                                        <InlineSVG
                                            src="/images/trophy_1.svg"
                                            className="fill-current w-11 h-11 text-zinc-400"
                                        />
                                    </div>
                                    <div className="content">
                                        <h2 className="title-font">Johnson</h2>
                                        <div className="account-id flex items-center gap-1">
                                            <p>johnson.testnet</p>
                                            <CoptText text="johnson.testnet" profilePage={false} />
                                        </div>
                                    </div>
                                </div>
                                <div className="folloe">
                                    <FollowButton accountId="johnson.testnet" />
                                </div>
                            </div>
                            <div className="winner px-6 py-2 flex items-center justify-between max-[600px]:flex-col gap-3 rounded-md my-3">
                                <div className="left flex items-center gap-3">
                                    <div className="trophy">
                                        <InlineSVG
                                            src="/images/trophy_1.svg"
                                            className="fill-current w-11 h-11 text-grey-800"
                                        />
                                    </div>
                                    <div className="content">
                                        <h2 className="title-font">Johnson</h2>
                                        <div className="account-id flex items-center gap-1">
                                            <p>johnson.testnet</p>
                                            <CoptText text="johnson.testnet" profilePage={false} />
                                        </div>
                                    </div>
                                </div>
                                <div className="folloe">
                                    <FollowButton accountId="johnson.testnet" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`winner-box bg-white group ${darkMode && "box-shadow-dark"} rounded-md flex flex-col px-5 pb-5 pt-3`}>
                        <div className="analytic-title py-2">
                            <h2 className="text-base flex items-center gap-2"><div className="circle bg-white group-hover:bg-green-200 p-1 rounded-full">
                                <InlineSVG
                                    src="/images/dot.svg"
                                    className="fill-current w-2 h-2 text-green-500"
                                /></div> On-going Giveaways</h2>
                        </div>
                        <div className="analytics-winners">
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
                                                <div className="content md:w-[15rem] max-[380px]:w-[15rem] w-[18rem]">
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
                    </div>
                </div>

                <div className="analytics-2 px-5 py-2 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-11 w-full">
                    <div className={`winner-box bg-white group ${darkMode && "box-shadow-dark"} rounded-md flex flex-col px-5 pb-5 pt-3`}>
                        <div className="analytic-title py-2">
                            <h2 className="text-base flex items-center gap-2"><div className="circle bg-white group-hover:bg-green-200 p-1 rounded-full">
                                <InlineSVG
                                    src="/images/dot.svg"
                                    className="fill-current w-2 h-2 text-green-500"
                                /></div> Upcomming Giveaways</h2>
                        </div>
                        <div className="analytics-winners">
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
                                                <div className="content md:w-[15rem] max-[380px]:w-[15rem] w-[18rem]">
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
                    </div>
                    <div className={`winner-box bg-white group ${darkMode && "box-shadow-dark"} rounded-md flex flex-col px-5 pb-5 pt-3`}>
                        <div className="analytic-title py-2">
                            <h2 className="text-base flex items-center gap-2"><div className="circle bg-white group-hover:bg-green-200 p-1 rounded-full">
                                <InlineSVG
                                    src="/images/dot.svg"
                                    className="fill-current w-2 h-2 text-green-500"
                                /></div> Ended Giveaways</h2>
                        </div>
                        <div className="analytics-winners">
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
                                                <div className="content md:w-[15rem] max-[380px]:w-[15rem] w-[18rem]">
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
                    </div>
                </div>
                {model && <div className="know-more-giveaways fixed mt-11 overflow-y-scroll top-0 min-h-[100vh] h-auto left-0 right-0 bg-sky-50 dark:bg-slate-800 flex justify-center items-center">
                    <div className="giveaway-details-box relative bg-white w-[20rem] md:w-[30rem] rounded-md px-4 py-2">
                        <div className="title w-full text-center py-2 mt-8">
                            <h2 className="title-font underline underline-offset-4">Giveaway Info</h2>
                        </div>
                        <div className="info">
                            <h2><span className="title-font text-md">Title:</span> {giveaway?.title}</h2>
                            <h2><span className="title-font text-md">Start Date:</span> {giveaway?.startDate ? new Date(giveaway.startDate).toDateString() : 'N/A'}</h2>
                            <h2><span className="title-font text-md">End Date:</span> {giveaway?.endDate ? new Date(giveaway.endDate).toDateString() : 'N/A'}</h2>

                            <h2 className="flex items-center"><span className="title-font flex text-md">Reward:</span> <div className="flex items-center">{giveaway !== undefined && giveaway.token === "NEAR" ? <div className="box-near h-10 w-12 p-2">
                                <img src="images/near-logo.png" className="h-full w-full object-contain" alt="" />
                            </div> : "$"}{giveaway !== undefined && giveaway.totalPrizePool}</div></h2>
                        </div>
                        <br />
                        <div className="giveaway-description">
                            <h2><span className="title-font text-md">Description:</span></h2>
                            <p className="text-justify">{giveaway?.description} </p>
                        </div>
                        <div className="close flex justify-center my-2">
                            <button className="btn cancel-btn" onClick={() => setModel(false)}>Close</button>
                        </div>
                        <div className="absolute top-3 right-3">
                            <div className="endsin px-2 py-1 border bg-green-500 rounded-3xl">
                                <h2 className="text-sm text-white">{timeMessage}</h2>
                            </div>
                        </div>
                    </div>
                </div>}
            </main>
        </div>
    )
}