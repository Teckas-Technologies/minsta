import { InfiniteScrollHook } from "@/data/types";
import { constants } from "@/constants";
import { FETCH_FEED_ASC } from "@/data/queries/feed.graphl";
import { useGraphQlQuery } from "@/data/useGraphQlQuery";

export const useFeedAsc = () => {


    const queryObj = {
        queryName: "q_FETCH_FEED_ASC",
        query: FETCH_FEED_ASC,
        variables: {
          accountIds: [
            constants.proxyContractAddress,
            ...constants.legacyProxyAddresses,
          ],
          contractAddress: constants.tokenContractAddress
        },
        queryOpts: { staleTime: Infinity },
      };
    
      const { data, isLoading } =
        useGraphQlQuery<InfiniteScrollHook>(queryObj);

    return {
        data,
        isLoading
    }
}