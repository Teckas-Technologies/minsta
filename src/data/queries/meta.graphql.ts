import { gql } from "graphql-request";

export const FETCH_META = gql`
query v2_omnisite_GetMetadataStaticReferences($metadataId: String!) {
  nft_metadata(where: {id: {_eq: $metadataId}}) {
    title
    media
    description
    nft_contract_id
    extra
    reference_blob
  }
    owners: nft_tokens(
      where: {
        metadata_id: {_eq: $metadataId },
        burned_timestamp: { _is_null: true }
      }
      distinct_on: owner
    ) {
      id: token_id
      owner
    }
}
`;
