import { useEffect, useState } from "react";
import { InfiniteScrollHook } from "@/data/types";
import { constants } from "@/constants";
import { SEARCH_FOR_OWNER } from "@/data/queries/feed.graphl";
import { useGraphQlQuery } from "@/data/useGraphQlQuery";

export const useSearchTokensByOwner = () => {
    // "harrison-thrya.testnet"
    const [tokenOwner, setTokenOwner] = useState<string>("");
    const [data, setData] = useState<InfiniteScrollHook | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const querySearch = {
        queryName: "q_SEARCH_FOR_OWNER",
        query: SEARCH_FOR_OWNER,
        variables: {
            owner: tokenOwner,
            contractAddress: constants.tokenContractAddress,
        },
        queryOpts: { staleTime: Infinity },
    };

    const { data: queryData, isLoading: queryLoading, error: queryError } = useGraphQlQuery<InfiniteScrollHook>(querySearch);

    useEffect(() => {
        if (tokenOwner) {
            setIsLoading(queryLoading);
            if (queryData) {
                setData(queryData);
            }
            if (queryError) {
                setError(queryError);
            }
        }
    }, [tokenOwner, queryData, queryLoading, queryError]);

    const searchTokenByOwner = (owner: string) => {
        setTokenOwner(owner);
        console.log("Owner Id >> ", owner)
        return data;
    };

    return {
        data,
        isLoading,
        error,
        searchTokenByOwner,
    };
};

