import { constants } from "@/constants";
import { useGraphQlQuery } from "@/data/useGraphQlQuery";

interface StatsResponse {
  token: {
    aggregate: {
      count: number;
    };
  };
  totalDistinctMinters: {
    aggregate: {
      count: number;
    };
  };
  totalNftsLast30Days: {
    aggregate: {
      count: number;
    };
  };
  totalDistinctMintersLast30Days: {
    aggregate: {
      count: number;
    };
  };
}

const FETCH_STATS = `
  query minsta_fetch_feed_minted_tokens(
    $contractAddress: String!,
    $startDate: timestamp!
  ) {
    token: mb_views_nft_tokens_aggregate(
      where: { nft_contract_id: { _eq: $contractAddress } }
    ) {
      aggregate {
        count
      }
    }

    totalDistinctMinters: mb_views_nft_tokens_aggregate(
      where: { nft_contract_id: { _eq: $contractAddress } }
      distinct_on: owner
    ) {
      aggregate {
        count(columns: owner)
      }
    }

    totalNftsLast30Days: mb_views_nft_tokens_aggregate(
      where: {
        nft_contract_id: { _eq: $contractAddress }
        minted_timestamp: { _gte: $startDate }
      }
    ) {
      aggregate {
        count
      }
    }

    totalDistinctMintersLast30Days: mb_views_nft_tokens_aggregate(
      where: {
        nft_contract_id: { _eq: $contractAddress }
        minted_timestamp: { _gte: $startDate }
      }
      distinct_on: owner
    ) {
      aggregate {
        count(columns: owner)
      }
    }
  }
`;

export const useStats = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const formattedStartDate = startDate.toISOString();

  const queryObj = {
    queryName: "q_FetchStats",
    query: FETCH_STATS,
    variables: {
      contractAddress: constants.tokenContractAddress,
      startDate: formattedStartDate,
    },
    queryOpts: { staleTime: Infinity },
  };

  const { data, isLoading: loading } = useGraphQlQuery<StatsResponse>(queryObj);

  let totalNFTs = 0;
  let distinctOwners = 0;
  let totalNFTsLast30Days = 0;
  let distinctOwnersLast30Days = 0;

  if (data) {
    totalNFTs = data.token?.aggregate?.count || 0;
    distinctOwners = data.totalDistinctMinters?.aggregate?.count || 0;
    totalNFTsLast30Days = data.totalNftsLast30Days?.aggregate?.count || 0;
    distinctOwnersLast30Days = data.totalDistinctMintersLast30Days?.aggregate?.count || 0;
  }

  return { data, totalNFTs, distinctOwners, totalNFTsLast30Days, distinctOwnersLast30Days, loading };
}