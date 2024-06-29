import { FETCH_FEED } from "@/data/queries/feed.graphl";
import useInfiniteScrollGQL from "@/hooks/useInfiniteScroll";
import { useMemo, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { MemoizedImageThumb } from "./ImageThumb";
import { useEffect, useState } from "react";

export const FeedScroll = ({ blockedNfts, sort , search}: any) => {
  const [mod, setMod] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  const { items, loadingItems, total, error } = useInfiniteScrollGQL("q_FETCH_FEED", isVisible, { query: FETCH_FEED });

  let memoizedData = useMemo(() => {
    let filteredData = items;

    // Filter based on search query if not empty
    if (search) {
      filteredData = filteredData.filter((token) => {
        return token.title.toLowerCase().includes(search.toLowerCase()) ||
               token.description.toLowerCase().includes(search.toLowerCase()) ||
               (token.owner && token.owner.toLowerCase().includes(search.toLowerCase()));
      });
    }

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

    // Filter blocked NFTs
    if (blockedNfts && blockedNfts.length) {
      filteredData = filteredData.filter(token => !blockedNfts.includes(token.metadata_id));
    }

    // Sort data
    if (sort === "Old to New") {
      filteredData.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    } else if (sort === "New to Old") {
      filteredData.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    return filteredData;
  }, [items, blockedNfts, sort, search]);

  return (
    <>
      {memoizedData?.map((token: any, index: number) => {
        return <MemoizedImageThumb key={token?.metadata_id} token={token} index={index} />;
      })}
      <div ref={ref}>
        {loadingItems?.map((item, i) => (
          <div className="md:aspect-square rounded overflow-x-hidden cursor-pointer sm:w-full md:w-72 h-72 xl:w-80 xl:h-80 relative" key={`${item}-${i}`}>
            <div className="rounded animate-pulse w-full h-full bg-gray-600 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </>
  );
};
