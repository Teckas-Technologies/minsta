import { useSearchTokenByOwner } from "@/hooks/useSearchTokenByOwner"
import { DynamicGrid } from "../DynamicGrid"
import { FirstToken } from "../FirstToken"
import { FeedScroll } from "../feed/feedscroll"
import { useMbWallet } from "@mintbase-js/react"
import { useHomePageData } from "@/hooks/useHomePageData"
import { InfiniteScrollHook } from "@/data/types"
import { useEffect, useState } from "react"
import InlineSVG from "react-inlinesvg"
import { useDarkMode } from "@/context/DarkModeContext"
import { CoptText } from "../CopyText"

export const ProfilePage = () => {

    const { firstTokenProps, tokensFetched, blockedNfts, totalLoading, totalNfts } = useHomePageData();
    const [filteredNFT, setFilteredNFT] = useState<InfiniteScrollHook | undefined>();
    const {activeAccountId, connect, isConnected} = useMbWallet();
    const { darkMode } = useDarkMode();
    let [grid, setGrid] = useState(1);
    const [owner, setOwner] = useState("")
    const [dataItems, setDataItems] = useState(false);
    const [newData, setNewData] = useState<InfiniteScrollHook | undefined>();
    

    // useEffect(()=> {
    //     if(owenerid) {
    //         setFilteredNFT(data)
    //     } else if(!owenerid) {
    //         setNewData(data)
    //     }
    // }, [owenerid]);

    useEffect(()=>{
        if(activeAccountId){
            setOwner(activeAccountId.toString());
        }
    },[activeAccountId]);

    const handleGrid = () => {
        console.log("Grid :", grid)
        if(grid === 1) {
          setGrid(2)
        } else if(grid === 2) {
          setGrid(3)
        } else if(grid === 3){
          setGrid(1)
        }
    }

    return (
        <div className={darkMode ? "dark" : ""}>
        <main className="px-4 lg:px-12 mx-auto flex flex-col items-center justify-start space-y-4 mt-5 bg-slate-50 dark:bg-slate-800 min-h-[99vh]">
            <div className="page-title mt-20">
                <h2 className="title-font text-3xl dark:text-white underline underline-offset-4">Profile</h2>
            </div>
            <div className="max-w-md flex gap-3 iems-center flex ml-auto mt-20 justify-center mb-5">
                <div className="md:hidden flex items-center justify-center" onClick={()=> { handleGrid()}}>
                    <InlineSVG
                    src="/images/grid.svg"
                    className="fill-current w-6 h-6 font-xl cursor-pointer"
                    color="#222f3e"
                    />
                </div>
            </div>
            <div className="account-copy">
                <div className="accountc flex items-center gap-3">
                    <h2>{activeAccountId}</h2>
                    <CoptText text={owner}/>
                </div>
            </div>

            {!dataItems && 
                <div className="not-data flex items-center gap-3">
                    <InlineSVG
                        src="/images/no_data.svg"
                        className="fill-current text-camera h-6 text-slate-800"
                    />
                    <h2>No Mints!</h2>
                </div>
            }
            
            <DynamicGrid mdCols={2} nGap={6} nColsXl={4} nColsXXl={6} grid={grid}>
                <FeedScroll blockedNfts={filteredNFT ? filteredNFT.token : [] } search={owner} dataItems={dataItems} setDataItems={setDataItems} dark={darkMode} hiddenPage={false} activeId={owner} profilePage={true}/>
            </DynamicGrid>
        </main>
        </div>
    )
}