"use client";
import { useContext, useEffect, useState } from "react";
import useNearSocialDB from "@/utils/useNearSocialDB";
import { NearContext } from "@/wallet/WalletSelector";

type Props = {
    accountId: string;
};

const FollowButton = ({ accountId }: Props) => {
    const { wallet, signedAccountId } = useContext(NearContext);
    const { getSocialData, setSocialProfile } = useNearSocialDB();
    const [followEdge, setFollowEdge] = useState<Record<string, any>>();
    const [inverseEdge, setInverseEdge] = useState<Record<string, any>>();

    useEffect(() => {
        (async () => {
            if (signedAccountId) {
                const _followEdge = await getSocialData({
                    path: `${signedAccountId}/graph/follow/${accountId}`,
                });
                setFollowEdge(_followEdge);

                const _inverseEdge = await getSocialData({
                    path: `${accountId}/graph/follow/${signedAccountId}`,
                });
                setInverseEdge(_inverseEdge);
            }
        })();
    }, [signedAccountId, accountId]);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(!followEdge || !inverseEdge);
    }, [followEdge, inverseEdge]);

    const follow = followEdge && Object.keys(followEdge).length;
    const inverse = inverseEdge && Object.keys(inverseEdge).length;
    const type = follow ? "unfollow" : "follow";

    const data = {
        graph: { follow: { [accountId]: follow ? null : "" } },
        index: {
            graph: JSON.stringify({
                key: "follow",
                value: {
                    type,
                    accountId: accountId,
                },
            }),
            notify: JSON.stringify({
                key: accountId,
                value: {
                    type,
                },
            }),
        },
    };

    const [buttonText, setButtonText] = useState("Loading");

    useEffect(() => {
        const _buttonText = loading
            ? "Loading"
            : follow
                ? "Following"
                : inverse
                    ? "Follow back"
                    : "Follow";
        setButtonText(_buttonText);
    }, [loading]);

    const [updating, setUpdating] = useState(false);

    if (!accountId || !signedAccountId || signedAccountId === accountId) {
        return "";
    }

    const onClickHandler = async () => {
        if (signedAccountId && buttonText !== "Following") {
            setUpdating(true);
            await setSocialProfile({
                [signedAccountId]: data,
            });

            setButtonText("Following");
            setUpdating(false);
        }
    };

    return (
        <button
            className={`bg-sky-500 px-3 py-1 mt-1 rounded-2xl ${buttonText !== "Following" && "cursor-pointer"}`} 
            style={{ fontWeight: 600 }}
            disabled={updating || buttonText === "Following"}
            onClick={onClickHandler}
        >
            {updating ? "Loading..." : buttonText}
        </button>
    );
};

export default FollowButton;
