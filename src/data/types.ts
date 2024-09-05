export interface TokenData {
  createdAt: string;
  description: string;
  id: string;
  media: string;
  metadata_id: string;
  title: string;
  owner: String | null;
  tags?: string[]
}

export interface TokenFeedData {
  token: TokenData[];
}

export interface InfiniteScrollHook {
  mb_views_nft_tokens_aggregate: { aggregate: { count: string } };
  token: TokenData[];
}

export interface InfiniteScrollHookResult {
  data: InfiniteScrollHook;
}

export interface FirstTokenResult {
  tokenError: unknown;
  isLoading: boolean;
  tokensFetched: TokenData[] | null;
  newToken: TokenData | null;
}

export interface FirstTokenProps {
  newToken: TokenData | null;
  isLoading: boolean;
  firstTokenisBlocked: boolean;
  isFirstTokenError:boolean
}

// Added by john

export interface SocialMedia {
  name: string;
  title: string;
  path: string;
  message: string;
  enabled: boolean;
}

export interface HidePost {
  accountId : string;
  hiddedTokenIds: HideTokenId[];
}

export interface HideTokenId {
  id: string;
}

export interface BlockUserType {
  accountId : string;
  blockedUsers: BlockedUser[];
}

export interface BlockedUser {
  blockedUserId: string;
}

export interface ProfileType {
  accountId: string;
}

export interface CreditsType {
  accountId: string;
  credit: number;
}

export interface CreditsTypeReq {
  accountId: string;
  credit: number;
  detuct: boolean;
}

export interface HashesType {
  accountId: string;
  amount: number;
  hash: string;
}

interface NEARSocialUserProfileInput {
  keys: string[];
  options?: {
    return_type?: "BlockHeight" | "History" | "True";
    values_only?: boolean;
    return_deleted?: boolean;
  };
}

export interface ExternalFundingSource {
  investorName: string;
  description: string;
  amountReceived: string;
  denomination: string;
  date?: string;
}

export interface ProfileLinktree {
  twitter?: string;
  github?: string;
  telegram?: string;
  website?: string;
}

export interface Image {
  ipfs_cid?: string;
  nft?: {
    contractId: string;
    tokenId: string;
  };
}

export enum Category {
  "social-impact" = "Social Impact",
  "non-profit" = "NonProfit",
  climate = "Climate",
  "public-good" = "Public Good",
  "de-sci" = "DeSci",
  "open-source" = "Open Source",
  community = "Community",
  education = "Education",
}

export interface NEARSocialUserProfile {
  name?: string;
  linktree?: ProfileLinktree;
  image?: Image;
  backgroundImage?: Image;
  description?: string;
  tags?: Record<string, string>;
  horizon_tnc?: string;
  // Project
  // required fields
  plPublicGoodReason?: string;
  plCategories?: string;
  // optional fields
  active?: boolean;
  location?: string;
  tagline?: string;
  services?: string;
  plGithubRepos?: string[];
  plFundingSources?: ExternalFundingSource[];
  plSmartContracts?: [string, string][];
  category?:
    | keyof typeof Category
    | {
        text: string;
      };
}

export type NetworkId = "testnet" | "mainnet";

export interface GiveawayType {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  totalPrizePool: number;
  token: string;
  winnerCount: number;
//   prizePerWinner: number; 
}