import { useDarkMode } from "@/context/DarkModeContext";
import { useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg";
import { CoptText } from "../CopyText";
import FollowButton from "../buttons/follow-button";
import { useStats } from "@/hooks/useStats";
import { useFetchTotalProfiles } from "@/hooks/db/ProfileHook";

export const StatsPage = () => {
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const [modalOpen, setModelOpen] = useState(false);

    useEffect(() => {
        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode])
    const { data, totalNFTs, distinctOwners } = useStats();
    const { totalProfiles, loading, error } = useFetchTotalProfiles();
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
                            /> <p><span className="text-green-500">16</span> last month</p></div>
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
                            /> <p><span className="text-green-500">63</span> last month</p></div>
                        </div>
                    </div>
                    <div className={`analytic-box bg-white group ${darkMode && "box-shadow-dark"} rounded-md flex flex-col justify-between px-5 pb-5 pt-3`}>
                        <div className="analytic-title py-2">
                            <h2 className="text-base flex items-center gap-2"><div className="circle bg-white group-hover:bg-green-200 p-1 rounded-full">
                                <InlineSVG
                                    src="/images/dot.svg"
                                    className="fill-current w-2 h-2 text-green-500"
                                /></div> Total Rewards</h2>
                        </div>
                        <div className="analytics-count flex items-end gap-3">
                            <h2 className="text-3xl">$260</h2>
                            <div className="flex items-center"><InlineSVG
                                src="/images/arrow_up.svg"
                                className="fill-current text-green-500"
                            /> <p><span className="text-green-500">$20</span> last month</p></div>
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
                            /> <p><span className="text-green-500">8</span> last month</p></div>
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
                                /></div> Upcomming Giveaways</h2>
                        </div>
                        <div className="analytics-winners">
                            <div className="winner px-6 py-3 flex items-center justify-between max-[600px]:flex-col gap-6 rounded-md my-3">
                                <div className="left_1 flex items-center gap-3 justify-between">
                                    {/* <div className="trophy">
                                        <InlineSVG
                                            src="/images/trophy_1.svg"
                                            className="fill-current w-11 h-11 text-yellow-500"
                                        />
                                    </div> */}
                                    <div className="content">
                                        <h2 className="title-font">Royale Campaign</h2>
                                        <div className="account-id flex items-center gap-1">
                                            <p className="text-xs">JUN 6 - JUN 11</p>
                                        </div>
                                    </div>
                                    <div className="reward">
                                        <div className="analytics-count flex items-end gap-3">
                                            <h2 className="text-3xl">$50</h2>
                                            <div className="flex items-center"> <p><span className="text-green-500">$</span> Total</p></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-holder w-auto">
                                    <button
                                        className={`bg-sky-500 px-3 py-1 mt-1 rounded-2xl cursor-pointer`}
                                        style={{ fontWeight: 600 }}
                                        onClick={() => setModelOpen(true)}
                                    >
                                        Know More
                                    </button>
                                </div>
                            </div>
                            <div className="winner px-6 py-3 flex items-center justify-between max-[600px]:flex-col gap-6 rounded-md my-3">
                                <div className="left_1 flex items-center gap-3 justify-between">
                                    <div className="content">
                                        <h2 className="title-font">Survival Is NEAR</h2>
                                        <div className="account-id flex items-center gap-1">
                                            <p className="text-xs">JUL 9 - JUL 13</p>
                                        </div>
                                    </div>
                                    <div className="reward">
                                        <div className="analytics-count flex items-end gap-3">
                                            <h2 className="text-3xl">$125</h2>
                                            <div className="flex items-center"> <p><span className="text-green-500">$</span> Total</p></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-holder w-auto">
                                    <button
                                        className={`bg-sky-500 px-3 py-1 mt-1 rounded-2xl cursor-pointer`}
                                        style={{ fontWeight: 600 }}
                                        onClick={() => setModelOpen(true)}
                                    >
                                        Know More
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {modalOpen && <div className="know-more-giveaways fixed mt-11  overflow-y-scroll top-0 min-h-[100vh] h-auto left-0 right-0 bg-sky-50 dark:bg-slate-800 flex justify-center items-center">
                    <div className="giveaway-details-box bg-white w-[20rem] md:w-[30rem] rounded-md px-4 py-2">
                        <div className="title w-full text-center py-2">
                            <h2 className="title-font">Giveaway Description</h2>
                        </div>
                        <div className="info">
                            <h2><span className="title-font">Title:</span> Royale Campaign</h2>
                            <h2><span className="title-font">Date:</span> JUN 6 - JUN 11</h2>
                            <h2><span className="title-font">Reward:</span> $50</h2>
                        </div>
                        <br />
                        <div className="giveaway-description">
                            <p className="text-justify">I’ve been part of a company experiencing rapid growth — more customers, more colleagues. When I joined, we had about 100 software engineers, and we were already patting ourselves on the back for that milestone. Little did we know, the team would skyrocket to over a thousand engineers. </p>
                        </div>
                        <div className="close flex justify-center my-2">
                            <button className="btn cancel-btn" onClick={() => setModelOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>}
            </main>
        </div>
    )
}