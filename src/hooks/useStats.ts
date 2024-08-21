import { constants } from "@/constants";
import { useGraphQlQuery } from "@/data/useGraphQlQuery";

interface StatsResponse {
    token: {
      aggregate: {
        count: number;
      };
    };
    mb_views_nft_tokens_distinct_minters: {
      aggregate: {
        count: number;
      };
    };
  }
  

const FETCH_STATS = `
  query minsta_fetch_feed_minted_tokens(
    $contractAddress: String!
  ) {
  token: mb_views_nft_tokens_aggregate(
      where: {nft_contract_id: {_eq: $contractAddress}}
    ) {
      aggregate {
        count
      }
    }
    mb_views_nft_tokens_distinct_minters: mb_views_nft_tokens_aggregate(
      where: {nft_contract_id: {_eq: $contractAddress}}
      distinct_on: owner
    ) {
      aggregate {
        count(columns: owner)
      }
    }
}`;

export const useStats = () => {
    const queryObj = {
        queryName: "q_FetchStats",
        query: FETCH_STATS,
        variables: { contractAddress: constants.tokenContractAddress },
        queryOpts: { staleTime: Infinity },
    };
    
    const { data, isLoading: loading } = useGraphQlQuery<StatsResponse>(queryObj);

    let totalNFTs = 0;
    let distinctOwners = 0;

    if (data) {
        totalNFTs = data?.token?.aggregate?.count || 0;
        distinctOwners = data?.mb_views_nft_tokens_distinct_minters?.aggregate?.count || 0;
    }

    return { data, totalNFTs, distinctOwners, loading };
}