import { useMbWallet } from "@mintbase-js/react";
import { useEffect, useState } from "react";
import { constants } from "@/constants";
import { setupWalletSelector, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMintbaseWallet } from '@near-wallet-selector/mintbase-wallet';
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import { FinalExecutionStatus } from "near-api-js/lib/providers";
import * as nearAPI from "near-api-js";

const useTransfer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selector, setSelector] = useState<WalletSelector | null>(null);
    const [modal, setModal] = useState<WalletSelectorModal | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const { providers, utils } = nearAPI;

    useEffect(() => {
        initializeWalletSelector();
    }, []);

    const initializeWalletSelector = async () => {
        try {
            const selectorInstance = await setupWalletSelector({
                network: "testnet",
                modules: [
                    setupMintbaseWallet(),
                    setupMyNearWallet(),
                    setupMeteorWallet() as any,
                ],
            });
            const modalInstance = setupModal(selectorInstance, {
                contractId: "test.testnet",
            });
            setSelector(selectorInstance);
            setModal(modalInstance);
            const wallet = await selectorInstance.wallet();
            const accounts = await wallet.getAccounts();
            if (accounts.length > 0) {
                setAccount(accounts[0].accountId);
            }
        } catch (error) {
            console.error("Failed to initialize wallet selector:", error);
        }
    };

    const getWallet = async () => {
        if (!selector) {
            throw new Error("Wallet selector is not initialized.");
        }
        try {
            return await selector.wallet();
        } catch (error) {
            console.error("Failed to retrieve the wallet:", error);
            setLoading(false);
            throw new Error("Failed to retrieve the wallet");
        }
    };

    const isSignedIn = () => {
        return account !== null;
    };

    const getAccount = ()=>{
        return account;
    }

    const signIn = async () => {
        if (modal) {
            try {
                modal.show();
                const wallet = await getWallet()
                if (!wallet) {
                    console.error("No wallet found.");
                    return;
                }
                const response = await wallet.signIn({ contractId: "test.testnet", accounts: [] });
                // Extract the accountId if the response is an object
                console.log(response[0].accountId);
                setAccount(response[0].accountId);
                return response[0].accountId;
            } catch (error) {
                console.error("Failed to sign in:", error);
            }
        } else {
            console.error("Modal is not initialized.");
        }
    }

    const signOut = async () => {
        try {
            const wallet = await getWallet();
            if (!wallet) {
                console.error("No wallet found.");
                return;
            }

            await wallet.signOut();
    
            setAccount(null);
            console.log("Successfully signed out.");
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };
    

    const transfer = async (receiverId: string) => {
        // if (!activeAccountId) {
        //     setError("Active account ID is not set.");
        //     return;
        // }
        setLoading(true);

        const amountInYocto = utils.format.parseNearAmount("0.05");

        try {
            const wallet = await getWallet();
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }
            const transaction = await wallet.signAndSendTransaction({
                signerId: account as string,
                receiverId: "sweety08.testnet",
                actions: [
                    {
                        type: "Transfer",
                        params: {
                            deposit: amountInYocto as string
                        },
                    },
                ],
            });
            console.log("Transaction sent:", transaction);
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the transaction process."
            );
            console.log("Error >> ", error)
        } finally {
            setLoading(false);
        }
    }

    const getBalance = async (accountId: string) => {
        if (!selector) {
            throw new Error("Wallet selector is not initialized.");
        }
        try {
            const provider = new providers.JsonRpcProvider({ url: 'https://rpc.testnet.near.org' });
            const account: any = await provider.query({
                request_type: 'view_account',
                account_id: accountId,
                finality: 'final',
            });
            // return amount on NEAR
            return account.amount ? Number(utils.format.formatNearAmount(account.amount)) : 0;
        } catch (error) {
            console.error("Failed to get the balance:", error);
            setLoading(false);
            throw new Error("Failed to get the balance:");
        }
    };

    const getTransactionResult = async (txhash: string) => {
        try {
            console.log("txhash : ", txhash);
            const provider = new providers.JsonRpcProvider({ url: selector?.options.network.nodeUrl || 'https://rpc.testnet.near.org' });
            const transaction = await provider.txStatus(txhash, 'unnused');
            console.log("Transaction fetched: ", transaction);
            await providers.getTransactionLastResult(transaction);
            if ((transaction.status as FinalExecutionStatus).SuccessValue !== undefined) {

                const amount = transaction.transaction?.actions[0]?.Transfer?.deposit;
                
                if (amount) {
                    return { success: true, amount: amount };
                } else {
                    console.warn("Transaction successful but no amount found.");
                    return { success: true, amount: null };
                }
            } else {
                console.warn("Transaction failed or SuccessValue is not an empty string.");
                return { success: false };
            }
        } catch (error) {
            console.error("Failed to get transaction result:", error);
            throw error;
        }
        
    };

    return { transfer, signIn, signOut, getBalance,getAccount, getTransactionResult,isSignedIn, initializeWalletSelector, loading, error };

}

export default useTransfer;




// ==================================================


// import { useMbWallet } from "@mintbase-js/react";
// import { useState } from "react";
// import { constants } from "@/constants";

// const useTransfer = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const { selector, activeAccountId } = useMbWallet();

//     const getWallet = async () => {
//         try {
//             return await selector.wallet();
//         } catch (error) {
//             console.error("Failed to retrieve the wallet:", error);
//             setLoading(false);
//             throw new Error("Failed to retrieve the wallet");
//         }
//     };

//     const transfer = async (receiverId: string, amountInYocto: string) => {
//         if (!activeAccountId) {
//             setError("Active account ID is not set.");
//             return;
//         }
//         setLoading(true);

//         try {
//             const wallet = await getWallet();

//             console.log("Active Account ID:", activeAccountId);
//             console.log("Receiver ID:", receiverId);
//             console.log("Amount in Yocto:", amountInYocto);

//             const transaction = await wallet.signAndSendTransaction({
//                 signerId: activeAccountId,
//                 callbackUrl: "https://minsta.org",
//                 receiverId: "fungible_rhmor.testnet",
//                 actions: [
//                     {
//                         type: 'Transfer',
//                         params: {
//                             deposit: amountInYocto
//                         },
//                     },
//                 ],
//             });
//             console.log("Step 5 >>", transaction)
//             return transaction;

//         } catch (error: any) {
//             setError(
//                 error?.message || "An error occurred during the transaction process."
//             );
//             console.log("Error >> ", error)
//         } finally {
//             setLoading(false);
//         }
//     }

//     return { transfer, loading, error };

// }

// export default useTransfer;


// ================================================================

// import * as nearAPI from "near-api-js";

// type Payload = {
//     receiver_id?: string,
//     amount?: string,
// };

// export const getSignUrl = async (
//     account_id: string,
//     method: string,
//     params: Payload,
//     deposit: string,
//     gas: string,
//     receiver_id: string,
//     meta: string,
//     callback_url: string,
//     network = "testnet"
// ): Promise<string | undefined> => {
//     try {
//         // const deposit_value = typeof deposit === 'string' ? deposit : nearAPI.utils.format.parseNearAmount('' + deposit);
//         const deposit_value = deposit;
//         console.log("Step 2 >>", deposit_value)
//         const actions = [
//             method === '!transfer'
//                 ? nearAPI.transactions.transfer(deposit_value)
//                 : nearAPI.transactions.functionCall(
//                     method,
//                     Buffer.from(JSON.stringify(params)),
//                     gas,
//                     deposit_value
//                 ),
//         ];
//         console.log("Step 3 >>", actions)
//         const keypair = nearAPI.utils.KeyPair.fromRandom('ed25519');
//         console.log("Step 4 >>", keypair)
//         const provider = new nearAPI.providers.JsonRpcProvider({ url: `https://rpc.${network}.near.org` });
//         console.log("Step 5 >>", provider)
//         const block = await provider.block({ finality: 'final' });
//         console.log("Step 6 >>", block)
//         const txs = [
//             nearAPI.transactions.createTransaction(
//                 account_id,
//                 keypair.getPublicKey(),
//                 receiver_id,
//                 1,
//                 actions,
//                 nearAPI.utils.serialize.base_decode(block.header.hash)
//             ),
//         ];
//         console.log("Step 7 >>", txs)
//         // https://testnet.wallet.mintbase.xyz/sign-transaction?transactions_data=%255B%257B%2522receiverId%2522%253A%2522wrap.testnet%2522%252C%2522actions%2522%253A%255B%257B%2522type%2522%253A%2522FunctionCall%2522%252C%2522params%2522%253A%257B%2522methodName%2522%253A%2522ft_transfer%2522%252C%2522args%2522%253A%257B%2522receiver_id%2522%253A%2522sweety08.testnet%2522%252C%2522amount%2522%253A%25225000000000000000000000000%2522%252C%2522memo%2522%253Anull%257D%252C%2522gas%2522%253A%252215000000000000%2522%252C%2522deposit%2522%253A%25221%2522%257D%257D%255D%257D%255D&callback_url=http%3A%2F%2Flocalhost%3A3000%2Ffileupload
//         // https://testnet.wallet.mintbase.xyz/sign-transaction?transactions_data=FwAAAGFraXJhLWRhdGFtaW5lci50ZXN0bmV0AMr8TaydY6xPB9lKFlO0yiisVX6IOfs7Dl7PFyxlnRNqAQAAAAAAAAAQAAAAc3dlZXR5MDgudGVzdG5ldJurOxDl1MbEt5W4LtxkKYDOTf1x6jvpFk2Eq9ZnJocuAQAAAAILAAAAZnRfdHJhbnNmZXJFAAAAeyJyZWNlaXZlcl9pZCI6InN3ZWV0eTA4LnRlc3RuZXQiLCJhbW91bnQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9AMBuMdkQAQABAAAAAAAAAAAAAAAAAAAA&callbackUrl=https%3A%2F%2Fminsta.org%2F
//         // const newUrl = new URL('sign-transaction', `https://testnet.wallet.mintbase.xyz/`);
//         // console.log("Step 8 >>", newUrl)
//         // newUrl.searchParams.set('transactions_data', txs.map(transaction => nearAPI.utils.serialize.serialize(nearAPI.transactions.SCHEMA, transaction)).map(serialized => Buffer.from(serialized).toString('base64')).join(','));
//         // newUrl.searchParams.set('callbackUrl', callback_url);

//         const newUrl = new URL('sign', `https://wallet.${network}.near.org/`);
//         console.log("Step 8 >>", newUrl)
//         newUrl.searchParams.set('transactions', txs.map(transaction => nearAPI.utils.serialize.serialize(nearAPI.transactions.SCHEMA, transaction)).map(serialized => Buffer.from(serialized).toString('base64')).join(','));
//         newUrl.searchParams.set('callbackUrl', callback_url);
//         if (meta) newUrl.searchParams.set('meta', meta);
//         return newUrl.href;
//     } catch (e) {
//         console.error("Error creating sign URL", e);
//         return;
//     }
// };