import { FETCH_FEED_ALL, FETCH_FEED_UNI, HIDE_POST } from "@/data/queries/feed.graphl";
import { graphqlQLServiceNew } from "@/data/graphqlService";
import { InfiniteScrollHook, InfiniteScrollHookResult } from "@/data/types";
import { extractErrorMessage } from "@/providers/data";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useReducer, useState } from "react";
import { toast } from "react-hot-toast";
import { useMediaQuery } from "usehooks-ts";
import { constants } from "@/constants";
import { debounce } from "lodash";
import { useFetchHiddenPost } from "./db/HidePostHook";
import { useFetchBlockUser } from "./db/BlockUserHook";

const initialState = {
  items: [],
  offset: 1,
  isLoading: false,
  calledOffsets: [0],
  total: null,
  searchItems: [],
  nonBlockItems: [],
  hidedItems: []
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
    case "HIDED_POST_SUCCESS":
      return {
        ...state,
        hidedItems: [...state.hidedItems, ...action.payload],
        isLoading: false,
      };
    case "FETCH_RESET":
      return initialState;
    case "RESET_ITEMS":
      return { ...state, items: [] };
    case "RESET_SEARCH_ITEMS":
      return { ...state, searchItems: [] };
    case "RESET_NON_BLOCK_ITEMS":
      return { ...state, searchItems: [] };
    case "RESET_HIDED_ITEMS":
      return { ...state, hidedItems: [] };
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
  initialSearch?: string,
  hiddenPage?: any,
  activeId?: any,
  profilePage?: any
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchInput, setSearchInput] = useState("");
  const queryClient = useQueryClient();
  const { fetchHiddenPost } = useFetchHiddenPost();
  const { fetchBlockUser } = useFetchBlockUser();
  const [activeAccount, setActiveAccount] = useState(activeId || "");
  const [hiddenPageNew, setHiddenPageNew] = useState(hiddenPage || false);
  const [profilePageNew, setProfilePageNew] = useState(profilePage || false);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [isFetchFirst, setIsFetchFirst] = useState(true);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const fetchNum = isDesktop ? 8 : 10;

  useEffect(()=>{
    setActiveAccount(activeId);
    if(profilePageNew){
      setSearchInput(activeAccount);
    }
  }, [activeAccount, activeId])

  const fetchItemsAll = async () => {
    // dispatch({ type: "RESET_SEARCH_ITEMS" });
    // dispatch({ type: "RESET_NON_BLOCK_ITEMS" });
    // dispatch({ type: "RESET_ITEMS" });
    // dispatch({ type: "FETCH_RESET" });
    dispatch({ type: "FETCH_START" });

    console.log("Fetch All Items ----->")

    const hidedPosts = await fetchHiddenPost(activeAccount);
    const user = await fetchBlockUser(activeAccount);
        
    const idsList = hidedPosts?.hiddedTokenIds?.map(token => token.id) || [];
    const blockedUsers = user?.blockedUsers?.map(blockedUser => blockedUser.blockedUserId) || [];
    setHiddenIds(idsList);
    setBlockedUserIds(blockedUsers)

    console.log("Active Account >> ", activeAccount)
    console.log("Hided Ids List >> ", idsList);
    console.log("Blocked Users List >> ", blockedUsers)
    console.log("Seearch Text >> ", searchInput);
    console.log("Seearch Text Length >> ", searchInput.length);
  
    const variables = {
      limit: fetchNum,
      accountIds: [
        constants.proxyContractAddress,
        ...constants.legacyProxyAddresses,
      ],
      hiddenIds: profilePageNew ? [] : idsList,
      owner: profilePageNew ? [] : blockedUsers,
      contractAddress: constants.tokenContractAddress,
      offset: (state.offset - 1) * fetchNum,
      search: profilePageNew ? activeAccount || searchInput : searchInput
    };

    console.log("Variables >> ", variables);

    const scrollData = (await graphqlQLServiceNew<InfiniteScrollHook>({
      query: FETCH_FEED_ALL,
      variables: variables,
    })) as InfiniteScrollHookResult;

    const { data }: any = scrollData;

    console.log("Scroll Data >> ", data);

    dispatch({ type: "SET_LOADING", payload: false });
    console.log("Is First >> ", isFetchFirst)
    console.log("Offset >> ", state.offset)
    if(isFetchFirst) {
      setIsFetchFirst(false);
      dispatch({ type: "SET_OFFSET", payload: state.offset });
      dispatch({ type: "SET_CALLED_OFFSETS", payload: state.offset });
      console.log("Offset New >> ", state.offset)
    } 
    if(!isFetchFirst) {
      dispatch({ type: "SET_OFFSET", payload: state.offset + 1 });
      dispatch({ type: "SET_CALLED_OFFSETS", payload: state.offset + 1 });
      console.log("Offset New >> ", state.offset + 1)
    }
    dispatch({
      type: "SET_TOTAL",
      payload: data?.mb_views_nft_tokens_aggregate?.aggregate?.count,
    });

    console.log("Search Input >> ", searchInput)

    if(searchInput){
      console.log("Entered search input")
      dispatch({
        type: "FETCH_SEARCH_SUCCESS",
        payload: data?.token,
      });
    } else if(!searchInput && activeAccount){
      console.log("Entered not search input")
      dispatch({
        type: "BLOCK_FILTER_SUCCESS",
        payload: data?.token,
      });
    } else {
      console.log("Entered common")
      setLoadingFirst(true);
      dispatch({
        type: "FETCH_SUCCESS",
        payload: data?.token,
      });
    }

    return data?.token;
  };

  // const debouncedFetchSearchItems = debounce(fetchItemsAll, 3000);

  const fetchHidedItems = async () => {
    // dispatch({ type: "RESET_HIDED_ITEMS" });
    // dispatch({ type: "FETCH_RESET" });
    dispatch({ type: "FETCH_START" });
    console.log("Hided Items ----->");

    console.log("Account Id  >> ", activeAccount);
  
    const hidedPosts = await fetchHiddenPost(activeAccount);
  
    const idsList = hidedPosts?.hiddedTokenIds?.map(token => token.id) || [];

    console.log("Hidden Ids  >> ", idsList);
  
    const variables = {
      limit: fetchNum,
      accountIds: [
        constants.proxyContractAddress,
        ...constants.legacyProxyAddresses,
      ],
      hidePostIds: idsList,
      contractAddress: constants.tokenContractAddress,
      offset: (state.offset - 1) * fetchNum,
    };

    console.log("Variables  >> ", variables);
  
    const hidedData = (await graphqlQLServiceNew<InfiniteScrollHook>({
      query: HIDE_POST,
      variables: variables,
    })) as InfiniteScrollHookResult;
  
    const { data } = hidedData;

    console.log("Data  >> ", data);
  
    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({ type: "SET_OFFSET", payload: state.offset + 1 });
    dispatch({ type: "SET_CALLED_OFFSETS", payload: state.offset + 1 });
    dispatch({
      type: "SET_TOTAL",
      payload: data?.mb_views_nft_tokens_aggregate?.aggregate?.count,
    });
    dispatch({
      type: "HIDED_POST_SUCCESS",
      payload: data?.token,
    });
  
    return data?.token;
  };

  // useInfiniteQuery
  const { data, fetchNextPage, isFetchingNextPage, error } = useInfiniteQuery(
    [queryKey, state.offset],
    () => hiddenPageNew ? fetchHidedItems() : fetchItemsAll(),
    {
      getNextPageParam: () => state.offset >= 0,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      enabled:
        !state.calledOffsets.includes(state.offset) && !searchInput,
    }
  );

  useEffect(() => {
      fetchNextPage();
  }, [searchInput, activeAccount, hiddenPageNew, profilePageNew, loadingFirst, isFetchFirst]);

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
    const hasNewPage = activeAccount && !searchInput && !hiddenPageNew
    ? state.nonBlockItems.length < state.total
    : searchInput && activeAccount || profilePageNew
    ? state.searchItems.length < state.total
    : hiddenPageNew 
    ? state.hidedItems.length < state.total
    : state.items.length < state.total;

    if (!state.isLoading && isVisible && hasNewPage && !isFetchingNextPage) {
      const newOffset = state.offset + 1;
      if (!state.calledOffsets.includes(newOffset)) {
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state.offset, isVisible, activeAccount, state.items, state.searchItems, isFetchFirst, loadingFirst]);

  const resetItemList = () => {
    dispatch({ type: "FETCH_RESET" });
  };

  
  const itemsToUse = activeAccount && searchInput === "" && !hiddenPageNew ? state.nonBlockItems : searchInput !== "" && !hiddenPageNew ? state.searchItems : hiddenPageNew ? state.hidedItems : state.items;
  const isMinthenInfiniteScrollNum = itemsToUse.length < fetchNum;

  return {
    items: itemsToUse,
    isLoading: state.isLoading,
    setIsFetchFirst,
    resetItemList,
    setSearchInput,
    setActiveAccount, 
    setHiddenPageNew,
    setProfilePageNew,
    loadingItems:
      itemsToUse.length < state.total && !isMinthenInfiniteScrollNum
        ? Array.from({ length: 1 }, (_) => ({ id: "" }))
        : null,
    total: state.total,
    error: state.error,
  };
};

export default useInfiniteScrollGQL;