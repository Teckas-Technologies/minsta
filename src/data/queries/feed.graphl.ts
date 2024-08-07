import { gql } from 'graphql-request';


export const FETCH_FEED = gql`
  query minsta_fetch_feed_minted_tokens(
    $accountIds: [String!]!
    $contractAddress: String
    $limit: Int
    $offset: Int
  ) {
    token: mb_views_nft_tokens(
      where: {
        nft_contract_id: { _eq: $contractAddress }
        burned_timestamp: { _is_null: true }
        metadata_content_flag: { _is_null: true }
        nft_contract_content_flag: { _is_null: true }
      }
      order_by: { minted_timestamp: desc },
       offset: $offset,
       limit: $limit
    ) {
      id: token_id
      createdAt: minted_timestamp
      media
      title
      description
      metadata_id
      owner
    }
    mb_views_nft_tokens_aggregate(where: {minter: {_in: $accountIds}, nft_contract_id: {_eq: $contractAddress}, burned_timestamp: {_is_null: true}}) {
      aggregate {
      count
      }
    }
  }
`;

export const FETCH_FEED_NEW = gql`
  query minsta_fetch_feed_minted_tokens(
    $accountIds: [String!]!
    $contractAddress: String
    $limit: Int
    $offset: Int
    $hiddenIds: [String!]!
    $owner: [String!]!
  ) {
    token: mb_views_nft_tokens(
      where: {
        nft_contract_id: { _eq: $contractAddress },
        burned_timestamp: { _is_null: true },
        metadata_content_flag: { _is_null: true },
        nft_contract_content_flag: { _is_null: true },
        _and: [
          { token_id: { _nin: $hiddenIds } },
          { owner: { _nin: $owner } }
        ]
      },
      order_by: { minted_timestamp: desc },
      offset: $offset,
      limit: $limit
    ) {
      id: token_id
      createdAt: minted_timestamp
      media
      title
      description
      metadata_id
      owner
    }
    mb_views_nft_tokens_aggregate(where: {minter: {_in: $accountIds}, nft_contract_id: {_eq: $contractAddress}, burned_timestamp: {_is_null: true}}) {
      aggregate {
      count
      }
    }
  }
`;

export const FETCH_FIRST_TOKEN = gql`
query minsta_fetch_firstToken($accountId: String!, $contractAddress: String) {
  token: mb_views_nft_tokens(where: {minter: {_eq: $accountId}, nft_contract_id: {_eq: $contractAddress}, 
    burned_timestamp: {_is_null: true}, metadata_content_flag: {_is_null: true}, nft_contract_content_flag: {_is_null: true}}, order_by: {minted_timestamp: desc}, limit: 1, offset: 0) {
    id: token_id
    createdAt: minted_timestamp
    media
    title
    description
    metadata_id
    owner
  }
}
`

export const SEARCH_FOR_OWNER = gql`
query minsta_search_token(
    $owner: String
    $contractAddress: String
  ) {
    token: 
 mb_views_nft_tokens(
    where: {
      nft_contract_id: {_eq: $contractAddress}
      burned_timestamp: {_is_null: true}
      metadata_content_flag: {_is_null: true}
      nft_contract_content_flag: {_is_null: true}
      owner: {_eq: $owner}}
      order_by: {minted_timestamp: desc}
  ) {
    id: token_id
    createdAt: minted_timestamp
    media
    title
    description
    metadata_id
    owner
  }
}
`


export const SEARCH_FOR_OWNER_ASC = gql`
query minsta_search_token(
    $owner: String
    $contractAddress: String
  ) {
    token: 
 mb_views_nft_tokens(
    where: {
      nft_contract_id: {_eq: $contractAddress}
      burned_timestamp: {_is_null: true}
      metadata_content_flag: {_is_null: true}
      nft_contract_content_flag: {_is_null: true}
      owner: {_eq: $owner}}
      order_by: {minted_timestamp: asc}
  ) {
    id: token_id
    createdAt: minted_timestamp
    media
    title
    description
    metadata_id
    owner
  }
}
`

export const FETCH_FEED_ASC = gql`
  query minsta_fetch_feed_minted_tokens(
    $accountIds: [String!]!
    $contractAddress: String
    $limit: Int
    $offset: Int
  ) {
    token: mb_views_nft_tokens(
      where: {
        nft_contract_id: { _eq: $contractAddress }
        burned_timestamp: { _is_null: true }
        metadata_content_flag: { _is_null: true }
        nft_contract_content_flag: { _is_null: true }
      }
      order_by: { minted_timestamp: asc },
       offset: $offset,
       limit: $limit
    ) {
      id: token_id
      createdAt: minted_timestamp
      media
      title
      description
      metadata_id
      owner
    }
    mb_views_nft_tokens_aggregate(where: {minter: {_in: $accountIds}, nft_contract_id: {_eq: $contractAddress}, burned_timestamp: {_is_null: true}}) {
      aggregate {
      count
      }
    }
  }
`;


export const FETCH_FEED_DESC = gql`
  query minsta_fetch_feed_minted_tokens(
    $accountIds: [String!]!
    $contractAddress: String
    $limit: Int
    $offset: Int
  ) {
    token: mb_views_nft_tokens(
      where: {
        nft_contract_id: { _eq: $contractAddress }
        burned_timestamp: { _is_null: true }
        metadata_content_flag: { _is_null: true }
        nft_contract_content_flag: { _is_null: true }
      }
      order_by: { minted_timestamp: desc },
       offset: $offset,
       limit: $limit
    ) {
      id: token_id
      createdAt: minted_timestamp
      media
      title
      description
      metadata_id
      owner
    }
    mb_views_nft_tokens_aggregate(where: {minter: {_in: $accountIds}, nft_contract_id: {_eq: $contractAddress}, burned_timestamp: {_is_null: true}}) {
      aggregate {
      count
      }
    }
  }
`;

export const HIDE_POST = gql`
  query minsta_search_token(
    $accountIds: [String!]!
    $contractAddress: String
    $limit: Int
    $offset: Int
    $hidePostIds: [String!]!
  ) {
    token: mb_views_nft_tokens(
      where: {
        nft_contract_id: {_eq: $contractAddress},
        burned_timestamp: {_is_null: true},
        metadata_content_flag: {_is_null: true},
        nft_contract_content_flag: {_is_null: true},
        token_id: {_in: $hidePostIds}
      }
      order_by: {minted_timestamp: desc},
      offset: $offset,
      limit: $limit
    ) {
      id: token_id
      createdAt: minted_timestamp
      media
      title
      description
      metadata_id
      owner
    }
    mb_views_nft_tokens_aggregate(
    where: {
      minter: {_in: $accountIds}, 
      nft_contract_id: {_eq: $contractAddress}, 
      burned_timestamp: {_is_null: true}
      metadata_content_flag: {_is_null: true},
      nft_contract_content_flag: {_is_null: true},
      token_id: {_in: $hidePostIds}
    }) {
      aggregate {
      count
      }
    }
}
`

export const SEARCH_SIMILAR_OWNER = gql`
  query minsta_fetch_feed_minted_tokens(
    $accountIds: [String!]!
    $contractAddress: String
    $owner: String
  ) {
    token: mb_views_nft_tokens(
      where: {nft_contract_id: 
        {_eq: $contractAddress}, 
        burned_timestamp: {_is_null: true}, 
        metadata_content_flag: {_is_null: true}, 
        nft_contract_content_flag: {_is_null: true}, 
        _or: [
          {owner: {_iregex: $owner}}, 
          {extra: {_iregex: $owner}},
          {title: {_iregex: $owner}}
        ]
      }
      order_by: {minted_timestamp: desc}
    ) {
      id: token_id
      createdAt: minted_timestamp
      media
      title
      description
      metadata_id
      owner
      extra
    }
    mb_views_nft_tokens_aggregate(where: {minter: {_in: $accountIds}, nft_contract_id: {_eq: $contractAddress}, burned_timestamp: {_is_null: true}}) {
      aggregate {
      count
      }
    }
  }
`;

export const FETCH_FEED_UNI = gql`
  query minsta_fetch_feed_minted_tokens(
    $accountIds: [String!]!
    $contractAddress: String
    $limit: Int
    $offset: Int
    $hiddenIds: [String!]!
    $owner: [String!]!
    $search: String
  ) {
    token:  mb_views_nft_tokens(
    where: {nft_contract_id: {_eq: $contractAddress}, 
      burned_timestamp: {_is_null: true},
      metadata_content_flag: {_is_null: true}, 
      nft_contract_content_flag: {_is_null: true}, 
      token_id: {_nin: $hiddenIds}, 
      owner: {_nin: $owner},
       _or:[
        {title:{_iregex:$search}},
        {owner:{_iregex:$search}},
        {extra:{_iregex:$search}}
      ]
     
    },
    order_by: {minted_timestamp: desc}
    offset: $offset
    limit: $limit
  ) {
    id: token_id
    createdAt: minted_timestamp
    media
    title
    description
    metadata_id
    owner
    extra
  }
    mb_views_nft_tokens_aggregate(where: {minter: {_in: $accountIds}, nft_contract_id: {_eq: $contractAddress}, burned_timestamp: {_is_null: true}}) {
      aggregate {
      count
      }
    }
  }
`;


export const FETCH_FEED_ALL = gql`
  query minsta_fetch_feed_minted_tokens(
    $accountIds: [String!]!
    $contractAddress: String
    $limit: Int
    $offset: Int
    $hiddenIds: [String!]!
    $owner: [String!]!
    $search: String
    $order_by: mb_views_nft_tokens_order_by!
  ) {
  token: mb_views_nft_tokens(
    where: {
      nft_contract_id: { _eq: $contractAddress }
      burned_timestamp: { _is_null: true }
      metadata_content_flag: { _is_null: true }
      nft_contract_content_flag: { _is_null: true }
      _and: [
        { token_id: { _nin: $hiddenIds } }
        { owner: { _nin: $owner } }
        {
          _or: [
            { owner: { _iregex: $search } }
            { extra: { _iregex: $search } }
            { title: { _iregex: $search } }
            { reference_blob: { _cast: { String: {_iregex: $search}}}}
          ]
        }
      ]
    }
    order_by: [$order_by]
    offset: $offset
    limit: $limit
  ) {
    id: token_id
    createdAt: minted_timestamp
    media
    title
    description
    metadata_id
    owner
    extra
  }
  mb_views_nft_tokens_aggregate(
    where: {
      minter: { _in: $accountIds }
      nft_contract_id: { _eq: $contractAddress }
      burned_timestamp: { _is_null: true }
      metadata_content_flag: { _is_null: true }
      nft_contract_content_flag: { _is_null: true }
      _and: [
        { token_id: { _nin: $hiddenIds } }
        { owner: { _nin: $owner } }
        {
          _or: [
            { owner: { _iregex: $search } }
            { extra: { _iregex: $search } }
            { title: { _iregex: $search } }
            { reference_blob: { _cast: { String: {_iregex: $search}}}}
          ]
        }
      ]
    }
  ) {
    aggregate {
      count
    }
  }
}`