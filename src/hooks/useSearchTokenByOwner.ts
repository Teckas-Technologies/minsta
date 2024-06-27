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
          contractAddress: constants.tokenContractAddress
        },
        queryOpts: { staleTime: Infinity },
      };
      const { data, isLoading } =
      useGraphQlQuery<InfiniteScrollHook>(querySearch);
      console.log("Search owner by desc",data);

    return {
        data,
        isLoading
    }
}