import { useContext, useState } from "react";
import "@near-wallet-selector/modal-ui/styles.css";
import * as nearAPI from "near-api-js";
import { NearContext } from "@/wallet/WalletSelector";

const useNEARTransfer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { wallet, signedAccountId } = useContext(NearContext);

    const transfer = async (amount: string) => {
        if (!signedAccountId) {
            setError("Active account ID is not set.");
            return;
        }
        setLoading(true);

        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }
            const amountInYocto = nearAPI.utils.format.parseNearAmount(amount);

            const transaction = {
                receiverId: 'minstaorg.testnet',
                actions: [
                    {
                        type: "Transfer",
                        params: {
                            deposit: amountInYocto,
                        },
                    },
                ],
            };
            return await wallet.signAndSendTransactions({ transactions: [transaction] })
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the transaction process."
            );
            console.log("Error >> ", error)
        } finally {
            setLoading(false);
        }
    }

    return { transfer, loading, error };
}

export default useNEARTransfer;