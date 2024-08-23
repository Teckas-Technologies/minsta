"use client"
import { useContext, useCallback } from "react";
import useNearSocialDB from "./useNearSocialDB";
import { NearContext } from "@/wallet/WalletSelector";

export interface Image {
    ipfs_cid?: string;
    nft?: {
        contractId: string;
        tokenId: string;
    };
}

type Props = {
    accountId?: string;
    image?: Image;
    type?: "backgroundImage" | "image";
    fallbackurl?: string;
};

type TokenResponse = {
    metadata: {
        reference: string;
        media: string;
    };
};

type TokenInput = {
    token_id: string;
};

type MetadateRes = {
    base_uri: string;
};

/**
 * Check account profile and get its avatar|background image provided by URL | IPFS | NFT
 * @param
 * @returns
 */

export const useImage = () => {
    const { getSocialProfile } = useNearSocialDB();
    const { wallet, signedAccountId } = useContext(NearContext);

    const getImage = useCallback(async ({
        accountId,
        image,
        type,
        fallbackurl,
    }: Props) => {
        let socialImage = image;

        try {
            if (!socialImage && accountId) {
                const profile = await getSocialProfile(accountId);
                if (!profile) return console.log("Error fetching social profile");

                socialImage = profile[type || "image"];
            }

            if (socialImage?.nft) {
                const { tokenId, contractId } = socialImage.nft;

                const tokenMetadata = await wallet?.viewMethod({
                    contractId: contractId,
                    method: "nft_token",
                    args: { token_id: tokenId },
                }) as TokenResponse;

                const nftMetadata = await wallet?.viewMethod({
                    contractId: contractId,
                    method: "nft_metadata",
                    args: { token_id: tokenId },
                }) as MetadateRes;

                const tokenMedia = tokenMetadata.metadata.media || "";
                let imageUrl = null;

                if (nftMetadata && tokenMetadata) {
                    imageUrl =
                        tokenMedia.startsWith("https://") ||
                        tokenMedia.startsWith("http://") ||
                        tokenMedia.startsWith("data:image")
                            ? tokenMedia
                            : nftMetadata.base_uri
                            ? `${nftMetadata.base_uri}/${tokenMedia}`
                            : tokenMedia.startsWith("Qm") || tokenMedia.startsWith("ba")
                            ? `https://ipfs.near.social/ipfs/${tokenMedia}`
                            : tokenMedia;

                    if (!tokenMedia && tokenMetadata.metadata.reference) {
                        if (
                            nftMetadata.base_uri === "https://arweave.net" &&
                            !tokenMetadata.metadata.reference.startsWith("https://")
                        ) {
                            const data = await fetch(
                                `${nftMetadata.base_uri}/${tokenMetadata.metadata.reference}`,
                            );
                            const res = await data.json();

                            imageUrl = res.body?.media;
                        } else if (
                            tokenMetadata.metadata.reference.startsWith("https://") ||
                            tokenMetadata.metadata.reference.startsWith("http://")
                        ) {
                            const data = await fetch(tokenMetadata.metadata.reference);
                            const res = await data.json();

                            imageUrl = JSON.parse(res.body).media;
                        } else if (tokenMetadata.metadata.reference.startsWith("ar://")) {
                            const data = await fetch(
                                `${"https://arweave.net"}/${tokenMetadata.metadata.reference.split("//")[1]}`,
                            );
                            const res = await data.json();

                            imageUrl = JSON.parse(res.body).media;
                        }
                    }
                }

                return imageUrl;
            } else if (socialImage?.ipfs_cid) {
                return `https://ipfs.near.social/ipfs/${socialImage.ipfs_cid}`;
            } else {
                return fallbackurl ?? type === "image" ? "no_image" : "no_image";
            }
        } catch (err) {
            console.log("Error fetching image", err);
            return fallbackurl ?? type === "image" ? "no_image" : "no_image";
        }
    }, [wallet, getSocialProfile]);

    return { getImage };
};
