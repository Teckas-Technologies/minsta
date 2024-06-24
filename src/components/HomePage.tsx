"use client";

import { useHomePageData } from "@/hooks/useHomePageData";
import { useMbWallet } from "@mintbase-js/react";
import { useRouter } from "next/navigation";
import { DynamicGrid } from "./DynamicGrid";
import { FirstFeed } from "./FirstFeed";
import { FirstToken } from "./FirstToken";
import { FeedScroll } from "./feed/feedscroll";

export const HomePage = () => {
  const {
    firstTokenProps,
    tokensFetched,
    blockedNfts,
    totalLoading,
    totalNfts,
  } = useHomePageData();
  const { connect, isConnected } = useMbWallet();

  const router = useRouter();

  const handleLetsGoBtn = () => {
    if (!isConnected) {
      connect();
    } else {
      router.push("/camera");
    }
  };

  

  return !totalLoading && !totalNfts ? (
    <main className="flex flex-col items-center justify-center h-screen">
      <p className="text-mainText">Nothing here yet 👀</p>
      <button
        className="gradientButton w-auto text-primaryBtnText rounded px-8 py-2 mt-4"
        onClick={handleLetsGoBtn}
      >
        Let&apos;s Go
      </button>
    </main>
  ) : (

   
    <main className="px-4 lg:px-12 mx-auto flex flex-col items-center justify-center space-y-4 mt-5">
        <div className="max-w-md flex flex-col ml-auto mt-20 justify-center">
          <div className="flex space-x-2 items-center">
              <form className="flex-1">
                  <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                  <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                          </svg>
                      </div>
                      <input type="search" id="default-search" className="block w-full p-2 ps-10 border border-gray-300 rounded-lg" placeholder="Search..." required />
                      <button type="submit" className="text-slate-800 absolute end-2.5 bottom-0.5 bg-slate-200 hover:bg-slate-50 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
                  </div>
              </form>
              <div className="relative inline-block text-left">
                <div>
                  <select className="select-option flex items-center px-4 py-2 text-sm font-medium text-slate-800 bg-slate-200 rounded-lg focus:ring-4 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300 pr-2">
                      <option className="option">Old to new </option>
                      <option className="option">New to Old </option>
                  </select>
                </div>
              </div>
          </div>
        </div>
        <DynamicGrid mdCols={2} nColsXl={4} nColsXXl={6}>
   

        <FirstToken {...firstTokenProps} />
      
        <FirstFeed tokensFetched={tokensFetched} blockedNfts={blockedNfts} />
        <FeedScroll blockedNfts={blockedNfts} />
      </DynamicGrid>
    </main>
   
  );
};
