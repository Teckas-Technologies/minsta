"use client";

import { useHomePageData } from "@/hooks/useHomePageData";
import { useMbWallet } from "@mintbase-js/react";
import { useRouter } from "next/navigation";
import { DynamicGrid } from "./DynamicGrid";
import { FirstToken } from "./FirstToken";
import { FeedScroll } from "./feed/feedscroll";
import { useEffect, useState } from "react";
import { useSearchTokenByOwner } from "@/hooks/useSearchTokenByOwner";
import { useFeedDesc } from "@/hooks/userFeedDesc";
import { InfiniteScrollHook } from "@/data/types";
import InlineSVG from "react-inlinesvg";
import { useDarkMode } from "@/context/DarkModeContext";
import { useFetchHiddenPost } from "@/hooks/db/HidePostHook";

interface NFT {
  data: InfiniteScrollHook | undefined;
  isLoading: boolean;
}

export const HomePage = () => {
  const { firstTokenProps, tokensFetched, blockedNfts, totalLoading, totalNfts } = useHomePageData();
  const { connect, isConnected, activeAccountId } = useMbWallet();
  const [searchText, setSearchText] = useState("");
  const [filteredNFT, setFilteredNFT] = useState<InfiniteScrollHook | undefined>();
  const { data, isLoading }: NFT = useFeedDesc();
  const { fetchHiddenPost } = useFetchHiddenPost();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("New to Old");
  let [grid, setGrid] = useState(1);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [hidePostIds, setHidePostIds] = useState<string[]>([]);
  const [accountId, setAccountId] = useState("");
  const [search, setSearch] = useState("");
  const [dataItems, setDataItems] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>();
  const {mode} = useDarkMode();

  useEffect(()=> {
    console.log("Mode Home >> ", mode);
    if(mode === "dark") {
      setDarkMode(true);
    } else{
      setDarkMode(false);
    }
  }, [mode])

  const handleCloseToast = () => {
    setToast(false);
    window.location.reload();
  }

  // const darkMode = localStorage.getItem("dark");
  // console.log("Dark Mode",darkMode);

  useEffect(()=> {
    if(toast) {
        setTimeout(()=> {
            setToast(false);
            setToastText("");
            window.location.reload();
        }, 5000)
    }
  }, [toast]);

  const setHandleToast = (message: string, open: boolean) => {
    setToast(open);
    setToastText(message);
  }

  useEffect(() => {
    if(activeAccountId) {
        setAccountId(activeAccountId);
        fetchHidedPosts(activeAccountId);
    }
  }, [activeAccountId]);

  const fetchHidedPosts = async (accountId: string)=> {
      const hiddenPosts = await fetchHiddenPost(accountId);
      if (hiddenPosts?.hiddedTokenIds) {
          const ids = hiddenPosts.hiddedTokenIds.map(token => token.id);
          setHidePostIds(ids);
      }
  }

  const router = useRouter();
  const handleLetsGoBtn = () => {
    if (!isConnected) {
      connect();
    } else {
      router.push("/camera");
    }
  };

  useEffect(() => {
    if (data) {
      setFilteredNFT(data);
    }
  }, [data]);

  const handleSearch = () => {
    if (searchText) {
      setSearch(searchText);
    } else {
      setSearch("")
    }
  };

  const handleGrid = () => {
    if(grid === 1) {
      setGrid(2)
    } else if(grid === 2) {
      setGrid(3)
    } else if(grid === 3){
      setGrid(1)
    }
  }

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return !totalLoading && !totalNfts ? (
    <div className={darkMode ? "dark" : ""}>
      <main className="flex flex-col items-center justify-center h-screen">
        <p className="text-mainText">Nothing here yet 👀</p>
        <button className="gradientButton w-auto text-primaryBtnText rounded px-8 py-2 mt-4" onClick={handleLetsGoBtn}>
          Let&apos;s Go
        </button>
      </main>
    </div>
  ) : (
    <div className={darkMode ? "dark" : ""}>
      <main className="px-4 lg:px-12 mx-auto flex flex-col items-center justify-start space-y-4 mt-5 bg-slate-50 dark:bg-slate-800 min-h-[100vh] relative">
        <div className="max-w-md flex flex-col ml-auto mt-20 justify-center mb-5">
          <div className="flex space-x-2 items-center">
            <div className="md:hidden" onClick={handleGrid}>
              <InlineSVG
                src="/images/grid.svg"
                className="fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer"
                />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 cursor-pointer justify-center">
                <svg className="w-4 h-4 text-sky-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search" value={searchText} id="default-search" className={`block w-full p-1.5 ps-10 search-box border focus:border-sky-500 rounded-3xl outline-none`} placeholder="Search..." required onChange={(e) => setSearchText(e.target.value)} />
              {/* <button className="text-white transition-all absolute end-2.5 bottom-0.5 bg-sky-400 hover:bg-white hover:border-solid border border-sky-400  hover:text-black focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-3xl text-sm px-4 py-1.5" onClick={handleSearch}>
                Search
              </button> */}
            </div>
            <div>
              <div className="relative">
                <button type="button" className="relative w-full cursor-pointer rounded-3xl dd-box bg-white py-1.5 pl-1 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset  focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm sm:leading-6" aria-haspopup="listbox" aria-expanded={isDropdownOpen} onClick={handleDropdownClick}>
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">{selectedOption}</span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>

                {isDropdownOpen && (
                  <ul className="absolute sort-item-holder z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" role="listbox">
                    <li className="relative sort-item cursor-default select-none py-2 pl-3 pr-3 text-gray-900" id="listbox-option-1" role="option" onClick={() => handleOptionClick("Old to New")}>
                      <div className="flex items-center">
                        <span className="ml-3 block truncate font-normal">Old to New</span>
                      </div>
                    </li>
                    <li className="relative sort-item cursor-default select-none py-2 pl-3 pr-3 text-gray-900" id="listbox-option-0" role="option" onClick={() => handleOptionClick("New to Old")}>
                      <div className="flex items-center">
                        <span className="ml-3 block truncate font-normal">New to Old</span>
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>
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

          <FeedScroll blockedNfts={filteredNFT ? filteredNFT.token : []} sort={selectedOption} search={searchText} dark={darkMode} hidepostids={hidePostIds} dataItems={dataItems} setDataItems={setDataItems} setToast={setHandleToast} hiddenPage={false} activeId={accountId}/>

        </DynamicGrid>
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
            </div>
            <div className="border-bottom-animation"></div>
        </div>}
      </main>
    </div>
  );
};