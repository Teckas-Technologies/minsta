import { useContext, useState } from "react";
import "@near-wallet-selector/modal-ui/styles.css";
import * as nearAPI from "near-api-js";
import { NearContext } from "@/wallet/WalletSelector";
import { constants } from "@/constants";

const useNearSocialDB = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { wallet, signedAccountId } = useContext(NearContext);

    const getSocialData = async ({ path }: { path: string }) => {
        try {
          if (!wallet) {
            throw new Error("Wallet is undefined");
          }
      
          const response = await wallet?.viewMethod({
            contractId: constants.SOCIAL_DB_CONTRACT_ID, 
            method: 'keys',
            args: { keys: [path] },
          });
      
          if (!response) return;
          console.log("Social Data >> ", response);
      
          return response;
        } catch (error: any) {
          console.error("getSocialData:", error);
          throw new Error(error?.message || "An error occurred during the fetch social data process.");
        }
    };

    const getSocialProfile = async (accountId: string) => {
        setLoading(true);

        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }
            const profile = await wallet?.viewMethod({
                contractId: constants.SOCIAL_DB_CONTRACT_ID,
                method: 'get',
                args: { keys: [`${accountId}/profile/**`] },
            });
            if (!profile[accountId]) return;
            console.log("Profile >> ", profile[accountId].profile)
            return profile[accountId].profile;
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the fetch near social db process."
            );
            console.log("Error >> ", error)
        } finally {
            setLoading(false);
        }
    }

    const setSocialProfile = async (profileData: object) => {
        setLoading(true);

        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }
            const contractId = constants.SOCIAL_DB_CONTRACT_ID;
            const method = 'set';
            const args = { data: profileData };
            const gas = '30000000000000';
            const deposit = '0';

            const result = await wallet?.callMethod({ contractId, method, args, gas, deposit });
            console.log('Profile Update Result:', result);
            return result;
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the set near social db process."
            );
            console.log("Error >> ", error)
        } finally {
            setLoading(false);
        }
    }

    const getFollowing = async ({ accountId }: { accountId: string }) => {
        try {
            const response = await wallet?.viewMethod({
                contractId: constants.SOCIAL_DB_CONTRACT_ID,
                method: 'keys',
                args: {
                    keys: [`${accountId}/graph/follow/*`],
                    options: {
                        return_type: 'BlockHeight',
                        values_only: true,
                    },
                },
            }) as any;

            if (!response || !response[accountId] || !response[accountId].graph) {
                return { accounts: [], total: 0 };
            }

            const followingAccounts = Object.keys(response[accountId].graph.follow);

            return { accounts: followingAccounts, total: followingAccounts.length };
        } catch (e) {
            console.error('getFollowing:', e);
            return { accounts: [], total: 0 };
        }
    };

    const getFollowers = async ({ accountId }: { accountId: string }) => {
        try {
            const response = await wallet?.viewMethod({
                contractId: constants.SOCIAL_DB_CONTRACT_ID,
                method: 'keys',
                args: {
                    keys: [`*/graph/follow/${accountId}`],
                    options: {
                        return_type: 'BlockHeight',
                        values_only: true,
                    },
                },
            }) as Record<string, { graph: { follow: Record<string, unknown> } }>;

            if (!response) {
                return { accounts: [], total: 0 };
            }

            // Extract the followers by iterating over the response keys
            const followerAccounts = Object.keys(response).filter(
                (key) => response[key]?.graph?.follow?.[accountId]
            );

            return { accounts: followerAccounts, total: followerAccounts.length };
        } catch (e) {
            console.error('getFollowers:', e);
            return { accounts: [], total: 0 };
        }
    };

    const getAvailableStorage = async () => {
        setLoading(true);

        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }
            const storage: any = await wallet?.viewMethod({
                contractId: constants.SOCIAL_DB_CONTRACT_ID,
                method: 'storage_balance_of',
                args: { account_id: signedAccountId },
            });
            return BigInt(storage?.available) / BigInt(10 ** 19);
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the fetch near social db storage process."
            );
            console.log("Error >> ", error)
        } finally {
            setLoading(false);
        }
    }

    const buyStorage = async () => {
        setLoading(true);

        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }
            const contractId = constants.SOCIAL_DB_CONTRACT_ID;
            const method = 'storage_deposit';
            const args = { account_id: signedAccountId };
            const gas = '30000000000000';
            const amount = nearAPI.utils.format.parseNearAmount("0.05")?.toString();
            const deposit = amount;

            const result = await wallet?.callMethod({ contractId, method, args, gas, deposit });
            console.log('Storage Purchase Result:', result);
            return result;
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the purchase near social db storage process."
            );
            console.log("Error >> ", error)
        } finally {
            setLoading(false);
        }
    }

    const getBalance = async () => {
        setLoading(true);

        try {
            if (!wallet) {
                throw new Error("Wallet is undefined");
            }
            const result = await wallet?.getBalance(signedAccountId);
            return result;
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the purchase near social db storage process."
            );
            console.log("Error >> ", error)
        } finally {
            setLoading(false);
        }
    }

    const uploadIPFS = async (file: File) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("https://ipfs.near.social/add", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: file,
            });

            if (res.ok) {
                const data = await res.json();
                console.log('File Upload Result:', data);
                return data.cid;
            } else {
                setError('Upload failed with status ' + res.status);
            }
        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the file upload process."
            );
            console.log("Error >> ", error);
        } finally {
            setLoading(false);
        }
    };

    return { getSocialData, getSocialProfile, setSocialProfile, getFollowing, getFollowers, getAvailableStorage, buyStorage, getBalance, uploadIPFS, loading, error };
}

export default useNearSocialDB;