import { InfiniteScrollHook } from "@/data/types";
import { constants } from "@/constants";
import { SEARCH_FOR_OWNER_ASC } from "@/data/queries/feed.graphl";
import { useGraphQlQuery } from "@/data/useGraphQlQuery";

export const useSearchTokenByOwnerByAsc = (tokenOwner: string) => {

    const querySearch = {
        queryName: "q_SEARCH_FOR_OWNER_ASC",
        query: SEARCH_FOR_OWNER_ASC,
        variables: {
         owner: tokenOwner,
          contractAddress: constants.tokenContractAddress
        },
        queryOpts: { staleTime: Infinity },
      };
      const { data, isLoading } =
      useGraphQlQuery<InfiniteScrollHook>(querySearch);
      console.log("Sorting with owner asc",data);

    return {
        data,
        isLoading
    }
}