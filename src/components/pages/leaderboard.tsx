"use client";

import { constants } from "@/constants";
import ViewYourNfts from "../buttons/ViewYourNft";
import RewardsModal from "../RewardsModal";
import { useLeaderBoardData } from "@/hooks/useLeaderboard";
import Link from "next/link";
import { useDarkMode } from "@/context/DarkModeContext";
import { useEffect, useState } from "react";
import { CoptText } from "../CopyText";
import { useRouter } from "next/navigation";

export const LeaderboardPage = () => {
  const { openModal, leaderboard, signedAccountId, texts } = useLeaderBoardData();
  const [darkMode, setDarkMode] = useState<boolean>();
  const {mode} = useDarkMode();
  const { push } = useRouter()

  useEffect(()=> {
    if(mode === "dark") {
      setDarkMode(true);
    } else{
      setDarkMode(false);
    }
  }, [mode])

  const nfts: any = [];
  leaderboard?.forEach(({ count }) => {
    nfts.push(count);
  });

  const sum = nfts?.reduce((x: number, y: number) => x + y, 0);

  return (
    <div className={darkMode ? "dark" : ""}>
      <main className="pt-20 flex flex-col gap-6 items-center justify-start min-h-[100vh] text-mainText bg-white dark:bg-slate-800">
        <div className="pt-3"><h3 className="dark:text-white title-font text-2xl">Leaderboard</h3></div>
        <div className="flex text-center gap-10">
          <ViewYourNfts />
          {constants.showRewards ? (
            <button
              className="text-linkColor text-sm dark:text-white"
              onClick={() => openModal("rewards")}
            >
              View Rewards
            </button>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 w-full px-4 pb-24 max-w-3xl text-leaderboardText">
          <div className="flex">
            👤 <b className="pl-1 dark:text-white"> {leaderboard?.length}</b>{" "}
            <span className="pl-1 pr-3 dark:text-white"> Minters</span> 🖼️{" "}
            <b className="pl-1 dark:text-white"> {sum}</b>{" "}
            <span className="pl-1 dark:text-white"> Moments</span>{" "}
          </div>
          {leaderboard?.map(({ account, count }, index) => {
            const isCurrentUser = account === signedAccountId;
            const isFirst = index === 0;
            return (
              <div key={`${account}-${index}`} className="flex gap-2 items-center">
              <CoptText key={`${account}-${index}`} text={account} profilePage={false}/>
              <p
                key={`${account}-${index}`}
                onClick={()=>push(`/profile/?accountId=${account}`)}
                className={`w-full h-16 flex p-4 items-center justify-between rounded-xl bg-cardOne max-w-[100%] overflow-hidden cursor-pointer ${
                  isCurrentUser ? "border-2 border-cardTwo" : ""
                }`}
                // target="_blank"
                // rel="noopener noreferrer"
                // passHref
                // href={`${constants.mintbaseBaseUrl}/human/${account}/owned/0`}
              >
                <div className="flex w-5/6 md:w-full">
                  {isCurrentUser && (
                    <span role="img" aria-label="silhouette" className="mr-2">
                      👤
                    </span>
                  )}
                  {isFirst && (
                    <span role="img" aria-label="fire" className="mr-2">
                      🔥
                    </span>
                  )}
                  <p className="w-[90%] truncate">{account}</p>
                </div>
                <div>
                  <div className="rounded-full bg-mainBg text-leaderboardText h-10 w-10 flex items-center justify-center">
                    {count}
                  </div>
                </div>
              </p>
              </div>
            );
          })}
        </div>
      </main>
      <RewardsModal texts={texts} />
    </div>
  );
};
