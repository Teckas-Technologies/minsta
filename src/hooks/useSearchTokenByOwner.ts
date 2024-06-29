import { useEffect, useState } from "react";
import { InfiniteScrollHook } from "@/data/types";
import { constants } from "@/constants";
import { SEARCH_FOR_OWNER } from "@/data/queries/feed.graphl";
import { useGraphQlQuery } from "@/data/useGraphQlQuery";

export const useSearchTokenByOwner = (tokenOwner: string) => {

  const querySearch = {
    queryName: "q_SEARCH_FOR_OWNER",
    query: SEARCH_FOR_OWNER,
    variables: {
      owner: tokenOwner,
      contractAddress: constants.tokenContractAddress,
    },
    queryOpts: { staleTime: Infinity },
  };

  const { data, isLoading, error } = useGraphQlQuery<InfiniteScrollHook>(querySearch);

  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error);
    }
  }, [error]);

  return {
    data,
    isLoading,
  };
};
