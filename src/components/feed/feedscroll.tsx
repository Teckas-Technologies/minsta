import { FETCH_FEED, FETCH_FEED_NEW, FETCH_FEED_UNI } from "@/data/queries/feed.graphl";
import useInfiniteScrollGQL from "@/hooks/useInfiniteScroll";
import { useMemo, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { MemoizedImageThumb } from "./ImageThumb";
import { useEffect, useState } from "react";
import { TokenData } from "@/data/types";
import InlineSVG from "react-inlinesvg";
import { useMbWallet } from "@mintbase-js/react";

export const FeedScroll = ({ blockedNfts, sort , search, dark, hidepostids, setToast, hiddenPage, activeId, profilePage}: any) => {
  const [mod, setMod] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;
  const {activeAccountId} = useMbWallet();

  const { items, loadingItems, total, error, setSearchInput, setActiveAccount, setHiddenPageNew, setProfilePageNew, dispatch } = useInfiniteScrollGQL("q_FETCH_FEED_ALL", isVisible, "", hiddenPage, activeId, profilePage);


  useEffect(() => {
    if(search){
      const searchText = search.trim();
      setSearchInput("");
    } else {
      setSearchInput("");  
      // dispatch({ type: "RESET_SEARCH_ITEMS" });
    }
  }, [search, setSearchInput]);

  useEffect(() => {
    if(activeAccountId) {
      setActiveAccount(activeAccountId);
    }
    if(activeId) {
      setActiveAccount(activeId);
    }
  }, [activeAccountId, activeId, setActiveAccount]);

  useEffect(()=> {
    if(hiddenPage) {
      setHiddenPageNew(true);
    } else if (!hiddenPage) {
      setHiddenPageNew(false)
    }
  },[hiddenPage, setHiddenPageNew])

  useEffect(()=> {
    if(profilePage) {
      setProfilePageNew(true);
    } else if (!profilePage) {
      setProfilePageNew(false)
    }
  },[profilePage, setProfilePageNew])

  let memoizedData = useMemo(() => {
    let filteredData = items;

    const uniqueMetadataIds = new Set<string>();

      filteredData = filteredData?.filter((token: any) => {
        if (uniqueMetadataIds.has(token.metadata_id)) {
          return false;
        }

        uniqueMetadataIds.add(token.metadata_id);

        // Move the filtering logic here
        if (!!blockedNfts && blockedNfts?.includes(token?.metadata_id)) {
          return false;
        }

        return true;
      });
    
      // Search 
    if (search) {
        filteredData = filteredData?.filter((token: TokenData) => {
          const title = token.title ? token.title.toLowerCase() : '';
          const description = token.description ? token.description.toLowerCase() : '';
          const owner = token.owner ? token.owner.toLowerCase() : '';
          const tags = token.tags ? token.tags.toString().toLowerCase() : "";
      
          return title.includes(search.toLowerCase()) ||
                 description.includes(search.toLowerCase()) ||
                 owner.includes(search.toLowerCase()) || 
                 tags.includes(search.toLowerCase());
        });
    }

    // Filter blocked NFTs
    if (blockedNfts && blockedNfts.length) {
      filteredData = filteredData?.filter((token:TokenData) => !blockedNfts.includes(token.metadata_id));
    }

    // Sort data
    if (sort === "Old to New") {
      filteredData?.sort((a: TokenData, b:TokenData) => (a.createdAt > b.createdAt ? 1 : -1));
    } else if (sort === "New to Old") {
      filteredData?.sort((a: TokenData, b:TokenData) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    return filteredData;
  }, [items, blockedNfts, sort, search, hidepostids, activeId, profilePage, hiddenPage]);


  return (
    <>
      {!hiddenPage && memoizedData?.length > 0 ? 
        memoizedData?.map((token: any, index: number) => {
          return <MemoizedImageThumb key={token?.metadata_id} token={token} index={index} dark={dark} setToast={setToast} hiddenPage={hiddenPage}/>;
        }) : 
        hiddenPage && hidepostids?.length !== 0 ?  memoizedData?.map((token: any, index: number) => {
          return <MemoizedImageThumb key={token?.metadata_id} token={token} index={index} dark={dark} setToast={setToast} hiddenPage={hiddenPage}/>;
        }): 
        hiddenPage && hidepostids?.length === 0 ?
        <div className="w-full flex items-center gap-3">
          <InlineSVG
            src="/images/no_data.svg"
            className="fill-current text-camera h-6 text-slate-800"
          />
          <h2>No Hidden Moments</h2>
        </div> : ""}
      {
        hiddenPage && hidepostids?.length === 0 ? "" : 
        <div ref={ref}>
          {loadingItems?.map((item, i) => (
            <div className="md:aspect-square rounded overflow-x-hidden cursor-pointer sm:w-[19rem] md:w-[19rem] md:h-[19rem] xl:w-[19rem] xl:h-[19rem] relative" key={`${item}-${i}`}>
              <div className="rounded animate-pulse w-full h-full bg-gray-600 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      }
    </>
  );
};
