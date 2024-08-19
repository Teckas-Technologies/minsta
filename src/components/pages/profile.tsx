import { DynamicGrid } from "../DynamicGrid"
import { FirstToken } from "../FirstToken"
import { FeedScroll } from "../feed/feedscroll"
import { useHomePageData } from "@/hooks/useHomePageData"
import { InfiniteScrollHook, NEARSocialUserProfile, ProfileType } from "@/data/types"
import { useContext, useEffect, useRef, useState } from "react"
import InlineSVG from "react-inlinesvg"
import { useDarkMode } from "@/context/DarkModeContext"
import { useGrid } from "@/context/GridContext"
import { ProfileCard } from "../ProfileCard";
import { marked } from 'marked';
import { EditProfile } from "../EditProfile"
import { useRouter } from "next/navigation"
import { useFetchProfile, useSaveProfile } from "@/hooks/db/ProfileHook"
import { NearContext } from "@/wallet/WalletSelector"
import useNearSocialDB from "@/utils/useNearSocialDB"
import { useImage } from "@/utils/socialImage";

export const ProfilePage = () => {

    const { firstTokenProps, tokensFetched, blockedNfts, totalLoading, totalNfts } = useHomePageData();
    const [filteredNFT, setFilteredNFT] = useState<InfiniteScrollHook | undefined>();
    const { wallet, signedAccountId } = useContext(NearContext);
    const { grid, toggleGrid } = useGrid();
    const [accountId, setAccountId] = useState("")
    const [dataItems, setDataItems] = useState(false);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [newData, setNewData] = useState<InfiniteScrollHook | undefined>();
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const [result, setResult] = useState("");
    const [profile, setProfile] = useState<NEARSocialUserProfile>();
    const [dbProfile, setDbProfile] = useState<ProfileType>();
    const [images, setImages] = useState<string[]>();
    const [following, setFollowing] = useState<number | null>(null);
    const [followers, setFollowers] = useState<number | null>(null);
    const [description, setDescription] = useState<string>("");
    const [services, setServices] = useState<string>("");
    const [edit, setEdit] = useState(false);
    const [desMore, setDesmore] = useState(false);
    const [serviceMore, setServicemore] = useState(false);
    const router = useRouter();
    const [activeAccountIdNew, setActiveAccountIdNew] = useState("");
    const { fetchDBProfile } = useFetchProfile();
    const [isOverflowing, setIsOverflowing] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const { saveDBProfile } = useSaveProfile();
    const { getSocialProfile, getAvailableStorage, getFollowing, getFollowers } = useNearSocialDB();
    const { getImage } = useImage();

    useEffect(() => {
        const descriptionEl = descriptionRef.current;
        if (descriptionEl) {
            setTimeout(() => {
                setIsOverflowing(descriptionEl.scrollHeight > descriptionEl.clientHeight);
            }, 100);
        }
    }, [description, desMore, dbProfile?.about]);

    useEffect(() => {
        if (signedAccountId) {
            setActiveAccountIdNew(signedAccountId)
        }
    }, [signedAccountId])

    // useEffect(() => {
    //     if (signedAccountId) {
    //         const getDBAvailableStorage = async () => {
    //             const storage = await getAvailableStorage()
    //             console.log("Storage >> ", storage)
    //         }
    //         getDBAvailableStorage();
    //     }
    // }, [signedAccountId, accountId, edit]);

    useEffect(() => {
        if (signedAccountId) {
            const fetchProfile = async () => {
                try {
                    const profileData = await getSocialProfile(accountId)
                    // const followingData = await getFollowing({ accountId: accountId });
                    // const followersData = await getFollowers({ accountId: accountId });
                    setProfile(profileData);
                    // setFollowing(followingData.total);
                    // setFollowers(followersData.total);
                    console.log("Profile data >> ", profileData)
                    if (profileData) {
                        const image = getImage({
                            image: profileData?.image,
                            type: "image",
                        });
                        const backgroundImage = getImage({
                            image: profileData?.backgroundImage,
                            type: "backgroundImage",
                        });

                        const images = await Promise.all([image, backgroundImage]);
                        setImages(images);
                    }
                } catch (err) {
                    console.log("Error >> ", err)
                }
            }

            fetchProfile();
        }
    }, [signedAccountId, accountId, edit]);

    useEffect(() => {
        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode])

    useEffect(() => {
        if (!itemsLoading) {
            setTimeout(() => setItemsLoading(true), 100)
            setTimeout(() => setItemsLoading(false), 3000)
        }
    }, [])

    useEffect(() => {
        if (profile?.description) {
            const rawHtml = marked(profile.description);
            setDescription(rawHtml as string);
        }
    }, [profile?.description]);

    useEffect(() => {
        if (profile?.services) {
            const rawHtml = marked(profile.services);
            setServices(rawHtml as string);
        }
    }, [profile?.services]);

    const preprocessHTMLContent = (html: string) => {
        const result = html
            .replace(/### (.+)/g, '<h3 class="font-bold text-md">$1</h3>')
            .replace(/- (.+)/g, '<li class="list-disc ml-5">$1</li>')
            // .replace(/\n/g, '<br />')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>');

        return result;
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const accountId = searchParams.get("accountId") || "";
        setAccountId(accountId);
    }, []);

    const updateQueryParam = (key: string, value: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        if (value) {
            searchParams.set(key, value);
        } else {
            searchParams.delete(key);
        }
        const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
        router.push(newRelativePathQuery);
    };
    console.log(images)

    return (
        <div className={darkMode ? "dark" : ""}>
            <main className="px-4 lg:px-12 mx-auto flex flex-col items-center justify-start mt-5 bg-slate-50 dark:bg-slate-800 min-h-[99vh] h-auto scroll-smooth overflow-y-scroll">
                <div className={`banner relative space-y-2 flex flex-col items-center justify-start w-full  rounded-lg ${!edit ? 'h-[20rem]' : 'h-auto'}`} style={{ backgroundImage: `url('${(images && images[1] !== "no_image" && !edit) && images[1] || !edit && '/images/dark_banner.jpg'}')`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                    <div className="page-title mt-20">
                        <h2 className={`title-font text-3xl ${!edit ? 'text-white' : 'dark:text-white'} underline underline-offset-4`}>{edit ? 'Edit Profile' : 'Profile'}</h2>
                    </div>
                    {!edit ?
                        <>
                            <div className="max-w-md flex gap-3 iems-center flex ml-auto mr-5 justify-center">
                                {accountId === signedAccountId && <div className=" flex items-center justify-center dark:bg-white bg-slate-800 p-2 rounded-full" onClick={() => setEdit(true)}>
                                    <InlineSVG
                                        src="/images/pencil.svg"
                                        className="fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer"
                                        color="#222f3e"
                                    />
                                </div>}
                                <div className="md:hidden flex items-center justify-center dark:bg-white bg-slate-800 p-2 rounded-full" onClick={toggleGrid}>
                                    <InlineSVG
                                        src="/images/grid.svg"
                                        className="fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer"
                                        color="#222f3e"
                                    />
                                </div>
                            </div>
                            {/* <div className="set-banner">
                                <div className="set-banner-pic bg-white flex items-center px-2 py-1 gap-2 rounded-md cursor-pointer">
                                    <InlineSVG
                                        src="/images/camera_fill.svg"
                                        className="fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer"
                                        color="#222f3e"
                                    />
                                    <h2>Add cover photo</h2>
                                </div>
                            </div> */}
                        </> :
                        <EditProfile setEdit={setEdit} accountId={activeAccountIdNew} />}
                    {!edit && <ProfileCard profile={profile} images={images} accountId={accountId} />}
                </div>

                {/* {!dataItems && !itemsLoading && 
                    <div className="not-data flex items-center gap-3 mt-[20%]">
                        <InlineSVG
                            src="/images/no_data.svg"
                            className="fill-current text-camera h-6 text-slate-800 dark:text-white"
                        />
                        <h2 className="dark:text-white">No Moments!</h2>
                    </div>
                }
                */}
                <div className={`profile-content w-full md:px-[20rem] ${!edit && 'md:mt-[15%] mt-[55%]'}`}>
                    {/* {profile && followers !== null && followers !== undefined && following !== null && following !== undefined && !edit &&
                        <div className="flex justify-center">
                            <div className="flex items-center w-[70%] md:w-[20rem] justify-center gap-3 m-2 py-2 rounded-lg border-1 border border-sky-500">
                                <div className="following">
                                    <h2 className="dark:text-white">Following</h2>
                                    <h4 className="dark:text-white text-center">{following}</h4>
                                </div>
                                <div className="divider">
                                    <p className="dark:text-white">|</p>
                                </div>
                                <div className="followers">
                                    <h2 className="dark:text-white">Followers</h2>
                                    <h4 className="dark:text-white text-center">{followers}</h4>
                                </div>
                            </div>
                        </div>} */}
                    {profile?.description && !edit && <div>
                        <h2 className="title-font dark:text-white text-xl py-2 underline underline-offset-4">Description</h2>
                        {/* <p className={`text-justify content dark:text-white ${!desMore ? "line-clamp-2" : ""}`} dangerouslySetInnerHTML={{ __html: preprocessHTMLContent(description) || dbProfile?.about as string }}></p> */}
                        <p
                            ref={descriptionRef}
                            className={`text-justify content dark:text-white ${!desMore ? "line-clamp-2" : ""}`}
                            dangerouslySetInnerHTML={{
                                __html: preprocessHTMLContent(profile?.description ?? ""),
                            }}
                        ></p>
                        {isOverflowing && (
                            <button
                                className={`btn my-1 flex gap-2 items-center ${!desMore ? "success-btn" : "delete-btn"}`}
                                onClick={() => setDesmore(!desMore)}
                            >
                                {!desMore ? "Show More" : "Show Less"}
                                {!desMore ? (
                                    <InlineSVG
                                        src="/images/arrow_right.svg"
                                        className="fill-current w-6 h-6 text-white font-xl cursor-pointer"
                                        color="#222f3e"
                                    />
                                ) : (
                                    <InlineSVG
                                        src="/images/arrow_up.svg"
                                        className="fill-current w-6 h-5 text-white font-xl cursor-pointer"
                                        color="#222f3e"
                                    />
                                )}
                            </button>
                        )}
                    </div>}

                    {(profile?.tags && Object.keys(profile.tags).length > 0 && !edit) && (
                        <div>
                            <h2 className="title-font dark:text-white text-xl py-2 underline underline-offset-4">Tags</h2>
                            <div className="tags flex items-center gap-2">
                                {Object.entries(profile.tags).map(([key, value], i) => (
                                    <div className="tag rounded-lg" key={i}>
                                        <p>#{key}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* {(dbProfile?.tags && dbProfile?.tags?.length > 0 && !edit) && <div>
                        <h2 className="title-font dark:text-white text-xl py-2 underline underline-offset-4">Tags</h2>
                        <div className="tags flex items-center gap-2">
                            {dbProfile?.tags &&
                                dbProfile?.tags.map((str, i) => (
                                    <div className="tag rounded-lg" key={i}>
                                        <p>#{str}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>} */}
                    {profile?.services && !edit && <div>
                        <h2 className="title-font dark:text-white text-xl py-2 underline underline-offset-4">Services</h2>
                        <p className={`text-justify content dark:text-white ${!serviceMore ? "line-clamp-1" : ""}`} dangerouslySetInnerHTML={{ __html: preprocessHTMLContent(services) }}></p>
                        <button className={`btn my-1 flex gap-2 items-center ${!serviceMore ? "success-btn" : "delete-btn"}`} onClick={() => setServicemore(!serviceMore)}>
                            {!serviceMore ? "Show More" : "Show Less"}
                            {!serviceMore ?
                                <InlineSVG
                                    src="/images/arrow_right.svg"
                                    className="fill-current w-6 h-6 text-white font-xl cursor-pointer"
                                    color="#222f3e"
                                /> :
                                <InlineSVG
                                    src="/images/arrow_up.svg"
                                    className="fill-current w-6 h-5 text-white font-xl cursor-pointer"
                                    color="#222f3e"
                                />}
                        </button>
                    </div>}
                </div>
                {!edit && <h4 className={`title-font dark:text-white text-2xl font-lg ${profile ? 'mt-11' : 'mt-1'}  underline underline-offset-4`}>Moments</h4>}
                {
                    itemsLoading && !result && !edit &&
                    <div className="mt-5 h-[50px]">
                        <div className="loader">
                        </div>
                    </div>
                }
                {!edit && <DynamicGrid mdCols={2} nGap={6} nColsXl={4} nColsXXl={6} grid={parseInt(grid ? grid : "1")}>
                    <FeedScroll blockedNfts={filteredNFT ? filteredNFT.token : []} grid={parseInt(grid ? grid : "1")} search={accountId} dark={darkMode} hidepostids={[]} dataItems={dataItems} setDataItems={setDataItems} setItemsLoading={setItemsLoading} setResult={setResult} hiddenPage={false} activeId={accountId} profilePage={true} />
                </DynamicGrid>}
                {
                    result && !edit &&
                    <div className="pb-5">
                        <h2 className="dark:text-white">{result}</h2>
                    </div>
                }
            </main>
        </div>
    )
}