import { useContext, useState } from "react";
import "@near-wallet-selector/modal-ui/styles.css";
import * as nearAPI from "near-api-js";
import { NearContext } from "@/wallet/WalletSelector";
import { constants } from "@/constants";

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
                receiverId: constants.receiverId,
                actions: [
                    {
                        type: "Transfer",
                        params: {
                            deposit: amountInYocto,
                        },
                    },
                ],
            };
            const results = await wallet.signAndSendTransactions({ transactions: [transaction] });
            let signerId: string | undefined;
            let depositAmount: string | undefined;
            let hash: string | undefined;

            results?.forEach((result) => {
                signerId = result.transaction.signer_id;
                hash = result.transaction.hash;
                const action = result.transaction.actions[0];

                if (action?.Transfer) {
                    depositAmount = action.Transfer.deposit;
                }
            });

            return {
                success: true,
                signerId,
                depositAmount,
                hash
            };
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the transaction process."
            );
            return {
                success: false,
                error: error?.message || "An error occurred during the transaction process."
            };
        } finally {
            setLoading(false);
        }
    }

    const transferReward = async (amount: string, receiverIds: string[]) => {
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

            const ids = ["fungible_rhmor.testnet", "harrison-thrya.testnet"];

            const transactions = ids.map((receiverId) => ({
                receiverId,
                actions: [
                    {
                        type: "Transfer",
                        params: {
                            deposit: amountInYocto,
                        },
                    },
                ],
            }));

            return await wallet.signAndSendTransactions({ transactions });
        } catch (error: any) {
            setError(error?.message || "An error occurred during the transaction process.");
            return {
                success: false,
                error: error?.message || "An error occurred during the transaction process."
            };
        } finally {
            setLoading(false);
        }
    }

    const transferToken = async (amount: string, receiverIds: string[], token: string) => {
        if (!signedAccountId) {
            setError("Active account ID is not set.");
            return;
        }
        setLoading(true);

        let tokenAddress = "";

        if(token === "USDC") {
            tokenAddress = constants.usdcContractAddress;
        } else if (token === "USDT") {
            tokenAddress = constants.usdtContractAddress;
        } else {
            tokenAddress = constants.usdcContractAddress;
        }

        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }

            const amountInYocto = nearAPI.utils.format.parseNearAmount(amount);

            const ids = ["fungible_rhmor.testnet", "exact_spikespiegel.testnet"];

            const transactions = ids.map((receiverId) => ({
                receiverId: tokenAddress,
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            methodName: "ft_transfer",
                            args: {
                                receiver_id: receiverId,
                                amount: amountInYocto,
                            },
                            gas: "30000000000000",
                            deposit: "1",
                        },
                    },
                ],
            }));

            return await wallet.signAndSendTransactions({ transactions });
        } catch (error: any) {
            setError(error?.message || "An error occurred during the USDC transfer process.");
            return {
                success: false,
                error: error?.message || "An error occurred during the USDC transfer process."
            };
        } finally {
            setLoading(false);
        }
    };

    return { transfer, transferReward, transferToken, loading, error };
}

export default useNEARTransfer;