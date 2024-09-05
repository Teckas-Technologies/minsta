import { constants } from "@/constants";
import { graphqlQLServiceNew } from "@/data/graphqlService";
import { useState, useCallback } from "react";

interface NFTToken {
    owner: string;
    minted_timestamp: string;
}

export interface OwnerCount {
    owner: string;
    count: number;
}

const FetchTopMinters = `
  query FetchTopMinters($contractAddress: String!, $startDate: timestamp!, $endDate: timestamp!) @cached {
    token: mb_views_nft_tokens(
      where: {
        nft_contract_id: { _eq: $contractAddress },
        minted_timestamp: { _gte: $startDate, _lte: $endDate }
      }
    ) {
      owner
      minted_timestamp
    }
  }
`;

// Adjust the type to reflect the actual GraphQL response structure
interface FetchTopMintersResponse {
    token: NFTToken[];
}

export const useGiveawayWinners = () => {
    const [topOwners, setTop5Owners] = useState<OwnerCount[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTopMinters = useCallback(async (start: string, end: string, count: number) => {
        setLoading(true);
        setError(null);
        try {
            const variables = {
                contractAddress: constants.tokenContractAddress,
                startDate: start,
                endDate: end
            };

            // Use the correctly typed response
            const response = await graphqlQLServiceNew<FetchTopMintersResponse>({
                query: FetchTopMinters,
                variables: variables,
            });

            const data = response.data;

            console.log("data:", data)

            if (!data || !data.token) {
                throw new Error("No data returned");
            }

            const ownerCounts = (data.token || []).reduce<Record<string, number>>((acc, token) => {
                acc[token.owner] = (acc[token.owner] || 0) + 1;
                return acc;
            }, {});

            console.log("ownerCounts:", ownerCounts)

            const sortedOwners: OwnerCount[] = Object.entries(ownerCounts)
                .map(([owner, count]) => ({ owner, count })) // Directly use count since it's a number
                .sort((a, b) => b.count - a.count)
                .slice(0, count);

            setTop5Owners(sortedOwners);
            return sortedOwners;
        } catch (error) {
            setError("Failed to fetch top minters. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    return { topOwners, loading, error, fetchTopMinters };
};
