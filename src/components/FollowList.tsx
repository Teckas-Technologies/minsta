import { useImage } from "@/utils/socialImage";
import useNearSocialDB from "@/utils/useNearSocialDB";
import { useEffect, useState } from "react";
import FollowButton from "./buttons/follow-button";
import InlineSVG from "react-inlinesvg";
import { useRouter } from "next/navigation";

interface FollowListProps {
    accounts: string[];
}

export const FollowList = ({ accounts }: FollowListProps) => {
    const [profiles, setProfiles] = useState<{ [key: string]: any }>({});
    const { getImage } = useImage();
    const { getSocialProfile } = useNearSocialDB();
    const { push } = useRouter();

    useEffect(() => {
        const fetchProfiles = async () => {
            const profileDataPromises = accounts.map(async (account) => {
                try {
                    const profileData = await getSocialProfile(account);
                    if (profileData) {
                        const image = await getImage({
                            image: profileData?.image,
                            type: "image",
                        });

                        const backgroundImage = await getImage({
                            image: profileData?.backgroundImage,
                            type: "backgroundImage",
                        });

                        return {
                            account,
                            profileData: {
                                ...profileData,
                                image,
                                backgroundImage,
                            },
                        };
                    }

                    return { account, profileData };
                } catch (err) {
                    console.error(`Error fetching profile for ${account}: `, err);
                    return { account, profileData: null };
                }
            });

            const profilesArray = await Promise.all(profileDataPromises);
            const profilesMap = profilesArray.reduce((acc, { account, profileData }) => {
                acc[account] = profileData;
                return acc;
            }, {} as { [key: string]: any });

            setProfiles(profilesMap);
        };

        if(accounts.length > 0){
            fetchProfiles();
        }
    }, [accounts]);
    if (accounts.length <= 0) {
        return <div className="text-center py-5">
            <div className="resilt flex items-center gap-2">
                <InlineSVG
                    src="/images/no_data.svg"
                    className="fill-current w-4 h-4 dark:text-white font-xl cursor-pointer"
                />
                <h2 className="dark:text-white">No data</h2>
            </div>
        </div>
    }
    return <>
        <div>
            {accounts.map((account: string, i: any) => {
                const profile = profiles[account];
                return (
                    <div key={i} className="w-full md:w-[30rem]">
                        <div className={`box-floow image-holder bg-white flex justify-between my-2 py-1 px-1 gap-1 rounded-md max-w-[20rem] overflow-hidden md:max-w-[30rem] md:overflow-hidden`} onClick={()=> push(`/profile/?accountId=${account}`)}>
                            <div className="first flex items-center">
                                <div className="img-field px-1 md:px-2">
                                    <img src={profile?.image || "/images/contact2.png"} className="w-8 h-8 rounded-full" alt={`${account}'s profile`} />
                                </div>
                                <div className="center-text max-w-[12rem] overflow-hidden md:max-w-[20rem] md:overflow-hidden">
                                    <h3>{profile?.name || "No-Name"}</h3>
                                    <h2 className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">{account}</h2>
                                </div>
                            </div>
                            <div className="btn-holder">
                                <FollowButton accountId={account} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </>
}