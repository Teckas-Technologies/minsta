import { useDarkMode } from "@/context/DarkModeContext";
import { InfiniteScrollHook } from "@/data/types";
import { useHomePageData } from "@/hooks/useHomePageData";
import { useSearchTokenByOwner } from "@/hooks/useSearchTokenByOwner";
import { useContext, useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg";
import { DynamicGrid } from "../DynamicGrid";
import { FirstToken } from "../FirstToken";
import { FeedScroll } from "../feed/feedscroll";
import { useFetchHiddenPost } from "@/hooks/db/HidePostHook";
import { useGrid } from "@/context/GridContext";
import { NearContext } from "@/wallet/WalletSelector";

export const HiddenPostPage = () => {
    
    const { firstTokenProps, tokensFetched, blockedNfts, totalLoading, totalNfts } = useHomePageData();
    const [filteredNFT, setFilteredNFT] = useState<InfiniteScrollHook | undefined>();
    const { wallet, signedAccountId } = useContext(NearContext);
    const { grid, toggleGrid} = useGrid();
    const [toast, setToast] = useState(false);
    const [toastText, setToastText] = useState("")
    const [hidePostIds, setHidePostIds] = useState<string[]>([]);
    const [accountId, setAccountId] = useState("");
    const [dataItems, setDataItems] = useState(false);
    const [itemsLoading, setItemsLoading] = useState(false);
    const { fetchHiddenPost } = useFetchHiddenPost();
    const [result, setResult] = useState("");

    const [darkMode, setDarkMode] = useState<boolean>();
    const {mode} = useDarkMode();

    useEffect(()=> {
        if(mode === "dark") {
        setDarkMode(true);
        } else{
        setDarkMode(false);
        }
    }, [mode])

    useEffect(()=> {
        if(toast) {
            setTimeout(()=> {
                setToast(false);
                setToastText("");
                window.location.reload();
                fetchHidedPosts(accountId);
            }, 5000)
            
        }
    }, [toast])

    const setHandleToast = (message: string, open: boolean) => {
        setToast(open);
        setToastText(message);
    }

    useEffect(() => {
        if(signedAccountId) {
            setAccountId(signedAccountId);
        }
    }, [signedAccountId]);

    useEffect(() => {
        if(signedAccountId) {
            fetchHidedPosts(signedAccountId);
        }
    }, [signedAccountId]);

    const fetchHidedPosts = async (accountId: string)=> {
        if(accountId) {
            const hiddenPosts = await fetchHiddenPost(accountId);
            if (hiddenPosts?.hiddedTokenIds) {
                const ids = hiddenPosts.hiddedTokenIds.map(token => token.id);
                setHidePostIds(ids);
            }
        }
    }

    return (
        <div className={darkMode ? "dark" : ""}>
        <main className="px-4 lg:px-12 mx-auto flex flex-col items-center justify-start space-y-4 mt-5 bg-slate-50 dark:bg-slate-800 min-h-[99vh]">
            <div className="page-title mt-20">
                <h2 className="title-font text-3xl dark:text-white underline underline-offset-4">Hidden Moments</h2>
            </div>
            <div className="max-w-md flex gap-3 pr-3 iems-center flex ml-auto justify-center mb-5">
                <div className="md:hidden flex items-center justify-center" onClick={toggleGrid}>
                    <InlineSVG
                    src="/images/grid.svg"
                    className="fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer"
                    color="#222f3e"
                    />
                </div>
                {/* {activeAccountId &&
                <div className="accout-owner border py-2 px-4 rounded-3xl">
                    <div className="account-box">
                        <h3> {activeAccountId}</h3> */}
                        {/* <h2 className="text-white dark:text-black">John</h2> */}
                    {/* </div>
                </div>} */}
            </div>
            {!dataItems && !itemsLoading && 
                <div className="not-data flex items-center gap-3">
                    <InlineSVG
                        src="/images/no_data.svg"
                        className="fill-current text-camera h-6 text-slate-800 dark:text-white"
                    />
                    <h2 className="dark:text-white">No Hidden Moments!</h2>
                </div>
            }
            {
                itemsLoading && 
                <div>
                <div className="loader">
                </div>
                </div>
            }
            <DynamicGrid mdCols={2} nGap={6} nColsXl={4} nColsXXl={6} grid={parseInt(grid? grid : "1")}>
                {/* {!newData?.token && <FirstToken {...firstTokenProps} />} */}

                <FeedScroll blockedNfts={filteredNFT ? filteredNFT.token : [] } grid={parseInt(grid? grid : "1")} dark={darkMode} dataItems={dataItems} setDataItems={setDataItems} setItemsLoading={setItemsLoading} hidepostids={hidePostIds} setToast={setHandleToast} setResult={setResult} hiddenPage={true} profilePage={false} activeId={accountId}/>
            </DynamicGrid>
            {
                result && 
                <div className="pb-5">
                    <h2 className="dark:text-white">{result}</h2>
                </div>
            }

            {toast && 
            <div id="toast-default" className="toast-container md:top-14 top-14 left-1/2 transform -translate-x-1/2 fixed ">
                <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                        </svg>
                        <span className="sr-only">Check icon</span>
                    </div>
                    <div className="ms-1 text-sm font-normal">{toastText}</div>
                    {/* <button type="button" onClick={handleCloseToast} className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button> */}
                </div>
                <div className="border-bottom-animation"></div>
            </div>}
        </main>
        </div>
    )
}