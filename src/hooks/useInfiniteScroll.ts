import { FETCH_FEED, SEARCH_SIMILAR_OWNER } from "@/data/queries/feed.graphl";
import { SEARCH_FOR_OWNER } from "@/data/queries/feed.graphl";
import { graphqlQLServiceNew } from "@/data/graphqlService";
import { HidePost, InfiniteScrollHook, InfiniteScrollHookResult } from "@/data/types";
import { extractErrorMessage } from "@/providers/data";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useReducer, useState } from "react";
import { toast } from "react-hot-toast";
import { useMediaQuery } from "usehooks-ts";
import { constants } from "@/constants";
import { debounce } from "lodash";
import { useFetchHiddenPost } from "./db/HidePostHook";
import { useMbWallet } from "@mintbase-js/react";
import { useFetchBlockUser } from "./db/BlockUserHook";

const initialState = {
  items: [],
  offset: 1,
  isLoading: false,
  calledOffsets: [0],
  total: null,
  searchItems: [],
  nonBlockItems: [],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        items: [...state.items, ...action.payload],
        isLoading: false,
      };
    case "FETCH_SEARCH_SUCCESS":
      return {
        ...state,
        searchItems: [...state.searchItems, ...action.payload],
        isLoading: false,
    };
    case "BLOCK_FILTER_SUCCESS":
      return {
        ...state,
        nonBlockItems: [...state.nonBlockItems, ...action.payload],
        isLoading: false,
    };
    case "FETCH_RESET":
      return initialState;
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    case "SET_CALLED_OFFSETS":
      return {
        ...state,
        calledOffsets: [...state.calledOffsets, action.payload],
      };
    case "SET_OFFSET":
      return { ...state, offset: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const useInfiniteScrollGQL = (
  queryKey: string,
  isVisible: boolean,
  graphQLObj?: any,
  initialSearch?: string,
  hiddedTokenIds?: any,
  activeId?:any
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchInput, setSearchInput] = useState(initialSearch || "");
  const queryClient = useQueryClient();
  const { hiddenPost, fetchHiddenPost } = useFetchHiddenPost();
  const { fetchBlockUser } = useFetchBlockUser();
  const [activeAccount, setActiveAccount] = useState(activeId || "");
  const [blockedIdList, setBlockedIdList] = useState<string[]>([]);
  const [hidedIds, setHidedIds] = useState<string[]>([]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const fetchNum = isDesktop ? 12 : 15;

  const fetchItems = async () => {
    dispatch({ type: "FETCH_START" });


    const variables = {
      limit: fetchNum,
      accountIds: [
        constants.proxyContractAddress,
        ...constants.legacyProxyAddresses,
      ],
      hiddenIds: hidedIds,
      blockedAccounts: blockedIdList,
      searchInput:searchInput,
      contractAddress: constants.tokenContractAddress,
      offset: (state.offset - 1) * fetchNum
    };
    const scrollData = (await graphqlQLServiceNew<InfiniteScrollHook>({
      query: graphQLObj.query,
      variables: variables,
    })) as InfiniteScrollHookResult;

    const { data } : any = scrollData;

    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({ type: "SET_OFFSET", payload: state.offset + 1 });
    dispatch({ type: "SET_CALLED_OFFSETS", payload: state.offset + 1 });
    dispatch({
      type: "SET_TOTAL",
      payload: data?.mb_views_nft_tokens_aggregate?.aggregate?.count,
    });

    dispatch({
      type: "FETCH_SUCCESS",
      payload: data?.token,
    });

    return data?.token;
  };



  // useInfiniteQuery
  const { data, fetchNextPage, isFetchingNextPage, error } = useInfiniteQuery(
    [queryKey, state.offset],
    ()=> searchInput ? debouncedFetchSearchItems() : fetchItems(),
    {
      getNextPageParam: () => state.offset >= 0,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: state.calledOffsets.includes(state.offset)
    }
  );

  const fetchHidedIds = async() => {
    const hidedPosts = await fetchHiddenPost(activeAccount);
    console.log("Active Id", activeAccount);
    console.log("Hidden Ids", hiddedTokenIds)
    const idsList = hidedPosts?.hiddedTokenIds.map(token => token.id) || [];
    setHidedIds(idsList);
  }

  const fetchBlockedUsers = async() => {
    const blockedUsers = await fetchBlockUser(activeAccount);
    console.log("Active Id", activeAccount);
    console.log("Hidden Ids", hidedIds);
    console.log("Blocked User Ids", blockedIdList);
    const idsList = blockedUsers?.blockedUsers.map(blockedUser => blockedUser.blockedUserId) || [];
    setBlockedIdList(idsList);
  }

  const debouncedFetchSearchItems = debounce(fetchItems, 3000);

  useEffect(() => {
    if(activeAccount) {
      fetchBlockedUsers();
      fetchHidedIds();
    }
    else {
      fetchNextPage();
    }
  }, [activeAccount]);
  useEffect(() => {
    if(searchInput) {
      debouncedFetchSearchItems();
    } else {
      fetchNextPage();
    }
  }, [searchInput]);
  

  useEffect(() => {
    if (error) {
      console.error(error);
      dispatch({ type: "SET_ERROR", payload: error });

      const errMsg = extractErrorMessage(error as Error);
      toast.error(
        `src/hooks/useInfiniteScroll.ts \n \n Query: ${queryKey} \n \n ${errMsg}`,
        { duration: 40000, position: "bottom-left", id: "scroll" }
      );
    }
  }, [error]);

  const handleScroll = () => {
    const hasNewPage = state.items.length < state.total;

    if (!state.isLoading && isVisible && hasNewPage && !isFetchingNextPage) {
      const newOffset = state.offset + 1;
      if (!state.calledOffsets.includes(newOffset)) {
        fetchNextPage();
        // setTimeout(fetchNextPage, 5000);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state.offset, isVisible]);

  const resetItemList = () => {
    dispatch({ type: "FETCH_RESET" });
  };

  const isMinthenInfiniteScrollNum = state.items.length < fetchNum;

  return {
    items: state.items,
    resetItemList,
    setSearchInput,
    setActiveAccount, 
    loadingItems:
      state.items.length < state.total && !isMinthenInfiniteScrollNum
        ? Array.from({ length: 1 }, (_) => ({ id: "" }))
        : null,
    total: state.total,
    error: state.error,
  };
};

export default useInfiniteScrollGQL;