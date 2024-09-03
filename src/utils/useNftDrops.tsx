import { useContext, useState } from "react";
import "@near-wallet-selector/modal-ui/styles.css";
import { NearContext } from "@/wallet/WalletSelector";
import { constants } from "@/constants";
import { uploadReference } from "@mintbase-js/storage";
import { ReferenceObject } from "@mintbase-js/storage/lib/types";

const useMints = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { wallet, signedAccountId } = useContext(NearContext);

    const uploadReferenceObject = async (refObject: ReferenceObject) => {
        try {
            return await uploadReference(refObject);
        } catch (error) {
            console.error("Failed to upload reference:", error);
            setLoading(false);
            throw new Error("Failed to upload reference");
        }
    };

    const mintNFT = async (mediaUrl: string, title: string, description: string) => {
        setLoading(true);

        const refObject = {
            title: title,
            description: description,
            media: mediaUrl
        };

        const uploadedData = await uploadReferenceObject(refObject);
        const metadata = { reference: uploadedData?.id, title: title, description: description };

        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }

            const contractId = constants.proxyContractAddress;
            const method = 'mint';
            const args = {
                metadata: JSON.stringify(metadata),
                nft_contract_id: constants.tokenContractAddress
            };
            const gas = '200000000000000';
            const deposit = '10000000000000000000000';

            const result = await wallet?.callMethod({ contractId, method, args, gas, deposit });
            return result;
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the minting process."
            );
            console.log("Error >> ", error)
        } finally {
            setLoading(false);
        }
    }


    return { mintNFT, loading, error };
}

export default useMints;