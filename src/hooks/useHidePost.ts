// import { useEffect, useState } from "react";
// import { InfiniteScrollHook } from "@/data/types";
// import { constants } from "@/constants";
// import { HIDE_POST, SEARCH_FOR_OWNER } from "@/data/queries/feed.graphl";
// import { useGraphQlQuery } from "@/data/useGraphQlQuery";

// export const useHidePost = (tokenIds: any) => {
//   const querySearch = {
//     queryName: "q_HIDE_POST",
//     query: HIDE_POST,
//     variables: {
//         limit: 10,
//         accountIds: [
//           constants.proxyContractAddress,
//           ...constants.legacyProxyAddresses,
//         ],
//         hidePostIds: tokenIds,
//         contractAddress: constants.tokenContractAddress,
//         offset: 0,
//     },
//     queryOpts: { staleTime: Infinity },
//   };

//   const { data, isLoading, error } = useGraphQlQuery<InfiniteScrollHook>(querySearch);

//   useEffect(() => {
//     if (error) {
//       console.error("Error fetching data:", error);
//     }
//   }, [error]);

//   return {
//     data,
//     isLoading,
//   };
// };
