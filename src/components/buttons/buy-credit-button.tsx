"use client";
import { useContext, useEffect, useState } from "react";
import { NearContext } from "@/wallet/WalletSelector";
import useNEARTransfer from "@/utils/useTransfer";
import { useFetchCredits, useSaveCredits } from "@/hooks/db/CreditHook";
import { useFetchHashes, useSaveHashes } from "@/hooks/db/HashHook";
import { CreditsTypeReq, HashesType } from "@/data/types";
import * as nearAPI from "near-api-js";
import { calculateCredit } from "@/utils/calculateCredit";

type Props = {
    amount: number;
    setHandleToast: (text: string, open: boolean) => void;
    setCredits: (credit: number | null) => void;
    txhash?: string;
};

const BuyCreditButton = ({ amount, setHandleToast, setCredits, txhash }: Props) => {

    const { wallet, signedAccountId } = useContext(NearContext);
    const { transfer } = useNEARTransfer();
    const { fetchCredits } = useFetchCredits();
    const { saveCredits } = useSaveCredits();
    const { fetchHashes } = useFetchHashes();
    const { saveHashes } = useSaveHashes();
    const [balance, setBalance] = useState<any>();

    useEffect(() => {
        const fetchBalance = async () => {
            const res = await wallet?.getBalance(signedAccountId);
            setBalance(res);
        }
        if (signedAccountId) {
            fetchBalance();
        }
    }, [signedAccountId]);

    useEffect(() => {
        const getresult = async () => {
            if (txhash) {
                const res = await fetchHashes(txhash as string);
                if (res?.exist) {
                    return;
                }
                try {
                    const result = await wallet?.getTransactionResult(txhash);
                    if (result?.success) {
                        if (result.signerId) {
                            const amt = nearAPI.utils.format.formatNearAmount(result.amount);
                            const resCredit = calculateCredit(parseFloat(amt));
                            const data: CreditsTypeReq = {
                                accountId: result.signerId,
                                credit: resCredit,
                                detuct: false
                            };
                            await saveCredits(data);

                            let credit = await fetchCredits(result.signerId);
                            setCredits(credit?.credit as number);
                            const hashData: HashesType = {
                                accountId: result.signerId,
                                amount: parseFloat(amt),
                                hash: txhash
                            }
                            await saveHashes(hashData)
                        }
                    }
                } catch (err) {
                    console.log("error >> ", err)
                }
            }
        }
        getresult();
    }, [txhash, signedAccountId])

    const onClickHandler = async () => {
        if (balance >= amount) {
            await transfer(amount.toString());
        } else {
            setHandleToast("Insufficient Balance!", true);
        }
    };

    if (!signedAccountId) {
        return "";
    }

    return (
        <button
            className="btn bg-sky-500 cursor-pointer"
            onClick={onClickHandler}
        >
            Buy
        </button>
    );
};

export default BuyCreditButton;