import { GiveawayType } from "@/data/types"
import { OwnerCount } from "@/hooks/useGiveawayWinner";
import { useImage } from "@/utils/socialImage";
import useNearSocialDB from "@/utils/useNearSocialDB";
import useNEARTransfer from "@/utils/useTransfer";
import { useEffect, useState } from "react";
import InlineSVG from "react-inlinesvg"

interface props {
    giveaway: GiveawayType | undefined;
    winners: OwnerCount[],
    timeMessage: string;
    setModel: (e: boolean) => void;
}

export const GiveawayInfo = ({ giveaway, winners, setModel, timeMessage }: props) => {
    const [winnerProfiles, setWinnerProfiles] = useState<{ [key: string]: any }>({});
    const { getImage } = useImage();
    const { getSocialProfile } = useNearSocialDB();
    const accounts: string[] = [];
    const { transferReward, transferToken } = useNEARTransfer();
    let amount = giveaway ? giveaway?.totalPrizePool / giveaway?.winnerCount : 0

    useEffect(() => {
        const fetchProfiles = async () => {
            const profileDataPromises = winners.map(async (winner) => {
                try {
                    const profileData = await getSocialProfile(winner.owner);
                    if (profileData) {
                        const image = await getImage({
                            image: profileData?.image,
                            type: "image",
                        });

                        return {
                            account: winner.owner,
                            profileData: {
                                ...profileData,
                                image,
                            },
                        };
                    }

                    return { account: winner.owner, profileData: null };
                } catch (err) {
                    console.error(`Error fetching profile for ${winner.owner}: `, err);
                    return { account: winner.owner, profileData: null };
                }
            });

            const profilesArray = await Promise.all(profileDataPromises);
            const profilesMap = profilesArray.reduce((acc, { account, profileData }) => {
                acc[account] = profileData;
                return acc;
            }, {} as { [key: string]: any });

            setWinnerProfiles(profilesMap);
        };

        if (winners.length > 0) {
            fetchProfiles();
        }
    }, [winners]);

    const handleDistribute = async () => {
        if(!giveaway) return;
        if(giveaway?.token === "NEAR"){
            await transferReward(amount.toString(), accounts);
        } else {
            await transferToken("5", accounts, giveaway?.token);
        }
    }

    return (
        <div className="know-more-giveaways fixed mt-11 overflow-y-scroll top-0 min-h-[100vh] h-auto left-0 right-0 bg-sky-50 dark:bg-slate-800 flex justify-center items-center">
            <div className="giveaway-details-box relative bg-white w-[20rem] md:w-[30rem] rounded-md px-4 py-2">
                <div className="title w-full text-center py-2 mt-8">
                    <h2 className="title-font">Giveaway Info</h2>
                </div>
                <div className="info">
                    <h2><span className="title-font text-md">Title:</span> {giveaway?.title}</h2>
                    <h2><span className="title-font text-md">Start Date:</span> {giveaway?.startDate ? new Date(giveaway.startDate).toDateString() : 'N/A'}</h2>
                    <h2><span className="title-font text-md">End Date:</span> {giveaway?.endDate ? new Date(giveaway.endDate).toDateString() : 'N/A'}</h2>

                    <h2 className="flex items-center"><span className="title-font flex text-md">Reward:</span> <div className="flex items-center">{giveaway !== undefined && giveaway.token === "NEAR" ? <div className="box-near h-10 w-12 p-2">
                        <img src="images/near-logo.png" className="h-full w-full object-contain" alt="" />
                    </div> : "$"}{giveaway !== undefined && giveaway.totalPrizePool}</div></h2>
                </div>
                <div className="giveaway-description mt-3">
                    <h2><span className="title-font text-md">Description:</span></h2>
                    <p className="text-justify">{giveaway?.description} </p>
                </div>
                {winners.length > 0 && <div className="giveaway-description mt-3">
                    <h2><span className="title-font text-md">Winners:</span></h2>
                    <div className="scroll-winners h-[8rem] md:h-[10rem] box-shadow p-2 rounded-md overflow-scroll">
                        {winners.map((winner: OwnerCount, index: any) => {
                            const profile = winnerProfiles[winner.owner];
                            accounts.push(winner.owner);
                            return (
                                <div key={index} className="winners-acc box-shadow mb-2 w-full flex items-center px-2 py-1 gap-2 rounded-md">
                                    <div className="img-win">
                                        <img src={profile?.image || "images/contact2.png"} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    </div>
                                    <div className="acc-name flex flex-col max-w-[13rem] overflow-hidden md:max-w-[22rem] md:overflow-hidden">
                                        <h2>{profile?.name || "No-Name"}</h2>
                                        <p className="overflow-hidden text-ellipsis whitespace-nowrap">{winner.owner}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>}
                <div className="close flex justify-center my-2">
                    <button className="btn cancel-btn" onClick={handleDistribute}>Distribute</button>
                </div>
                <div className="absolute top-3 left-3">
                    <div className="endsin px-2 py-1 border bg-green-500 rounded-3xl">
                        <h2 className="text-sm text-white">{timeMessage}</h2>
                    </div>
                </div>
                <div className="absolute top-3 right-3">
                    <div className="endsin p-2 border border-red-500 bg-sky-50 rounded-full cursor-pointer" onClick={() => setModel(false)}>
                        <InlineSVG
                            src="/images/close.svg"
                            className="fill-current w-4 h-4 text-slate-800"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}