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
import Image from "next/image"

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
    const [images, setImages] = useState<string[]>();
    const [following, setFollowing] = useState<number | null>(null);
    const [followers, setFollowers] = useState<number | null>(null);
    const [toast, setToast] = useState(false);
    const [toastText, setToastText] = useState("");
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
    const [balance, setBalance] = useState<number>(0);
    const [availableStorage, setAvailableStorage] = useState<bigint | null>();
    const [storageModel, setStorageModel] = useState(false);
    const { getSocialProfile, setSocialProfile, getAvailableStorage, buyStorage, getFollowing, getFollowers, getBalance, uploadIPFS } = useNearSocialDB();
    const { getImage } = useImage();
    const [uploadText, setUploadText] = useState<string>("");
    const [cid, setCid] = useState<string>("");
    const [uploadModel, setUploadModel] = useState<boolean>(false);
    const [backgroundFileName, setBackgroundFileName] = useState('');
    const [backgroundImageCid, setBackgroundImageCid] = useState('');

    const handleUpload = (text: string, cid: string, open: boolean) => {
        setUploadText(text);
        setUploadModel(open);
        setCid(cid);
    }

    useEffect(() => {
        if (backgroundImageCid) {
            handleUpload("Background Image", backgroundImageCid, true);
        }
    }, [backgroundImageCid])

    const handleSaveProfile = async () => {
        try {
            const profileData = {
                [signedAccountId]: {
                    profile: {
                        image: {
                            ipfs_cid: cid
                        }
                    }
                }
            };
            const bgData = {
                [signedAccountId]: {
                    profile: {
                        backgroundImage: {
                            ipfs_cid: cid
                        }
                    }
                }
            };
            if (cid) {
                if (uploadText === "Profile Image") {
                    const result = await setSocialProfile(profileData);
                    return result;
                }
                if (uploadText === "Background Image") {
                    const result = await setSocialProfile(bgData);
                    return result;
                }
            }
            return;
        } catch (error) {
            console.error('Error saving profile image:', error);
            throw error;
        }
    };

    useEffect(() => {
        const descriptionEl = descriptionRef.current;
        if (descriptionEl) {
            setTimeout(() => {
                setIsOverflowing(descriptionEl.scrollHeight > descriptionEl.clientHeight);
            }, 100);
        }
    }, [description, desMore]);

    useEffect(() => {
        if (signedAccountId) {
            setActiveAccountIdNew(signedAccountId)
        }
    }, [signedAccountId])

    useEffect(() => {
        const fetchBalance = async () => {
            const res = await getBalance();
            if(res !== undefined){
                setBalance(res);
            }
            
        }
        if (signedAccountId) {
            fetchBalance()
        }
    }, [])

    useEffect(() => {
        if (signedAccountId) {
            const getDBAvailableStorage = async () => {
                const storage = await getAvailableStorage()
                console.log("Storage >> ", storage)
                if (typeof storage === 'bigint') {
                    setAvailableStorage(storage);
                } else if (storage === undefined) {
                    setAvailableStorage(null);
                }
            }
            getDBAvailableStorage();
        }
    }, [signedAccountId, edit]);

    const handleEdit = () => {
        if(availableStorage === null || (typeof availableStorage === 'bigint' && BigInt(availableStorage) <= BigInt(512))){
            setStorageModel(true);
        } else {
            setEdit(true)
        }
    }

    const buySocialDBStorage = async () => {
        if(balance > 0.05){
            return await buyStorage();
        } else {
            setHandleToast("Insufficient Balance!", true);
            return;
        }
    }

    useEffect(() => {
        if (accountId) {
            const fetchProfile = async () => {
                try {
                    const profileData = await getSocialProfile(accountId);
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

    useEffect(() => {
        if (toast) {
            setTimeout(() => {
                setToast(false);
                setToastText("");
            }, 5000)
        }
    }, [toast]);

    const setHandleToast = (message: string, open: boolean) => {
        setToast(open);
        setToastText(message);
    }

    const handleFileClick = (inputId: string) => {
        const fileInput = document.getElementById(inputId);
        if (fileInput) {
            (fileInput as HTMLInputElement).click();
        }
    };

    const handleBackgroundFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setBackgroundFileName(file.name);
            try {
                const bgPicCid = await uploadIPFS(file);
                console.log("Background Cid >> ", bgPicCid);
                setBackgroundImageCid(bgPicCid);
            } catch (error) {
                console.error('Error converting file to Base64:', error);
            }
        } else {
            setBackgroundFileName('');
            setBackgroundImageCid("");
        }
    };

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
                                {accountId === signedAccountId && <div className=" flex items-center justify-center dark:bg-white bg-slate-800 p-2 rounded-full" onClick={handleEdit}>
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
                            {accountId === signedAccountId && <div className="set-banner">
                                <div className="set-banner-pic bg-white flex items-center px-2 py-1 gap-2 rounded-md cursor-pointer" onClick={() => handleFileClick('backgroundInput')}>
                                    <InlineSVG
                                        src="/images/camera_fill.svg"
                                        className="fill-current w-6 h-6 text-sky-500 font-xl cursor-pointer"
                                        color="#222f3e"
                                    />
                                    <h2>{profile?.backgroundImage ? "Change cover photo" : "Add cover photo"}</h2>
                                </div>
                                <input type="file" name="picture" id="backgroundInput" onChange={handleBackgroundFileChange} className={`hidden w-full p-2 text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`} />
                            </div>}
                        </> :
                        <EditProfile setEdit={setEdit} accountId={activeAccountIdNew} />}
                    {!edit && <ProfileCard profile={profile} images={images} accountId={accountId} setHandleToast={setHandleToast} handleUpload={handleUpload} />}
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
                <div className={`profile-content w-full md:px-[20rem] ${!edit && 'md:mt-[20%] mt-[77%]'}`}>
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
                {/* {
                    result && !edit &&
                    <div className="pb-5">
                        <h2 className="dark:text-white">{result}</h2>
                    </div>
                } */}
                {toast &&
                    <div id="toast-default" className="toast-container mt-6 md:top-14 top-14 left-1/2 transform -translate-x-1/2 fixed z-50">
                        <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                                <span className="sr-only">Check icon</span>
                            </div>
                            <div className="ms-1 text-sm font-normal">{toastText}</div>
                        </div>
                        <div className="border-bottom-animation"></div>
                    </div>}
                {uploadModel && <div className="upload-model fixed bg-sky-50 dark:bg-slate-800 top-0 bottom-0 right-0 left-0 flex justify-center items-center">
                    <div className={`upload-box w-[20rem] bg-white mx-3 px-3 py-2 flex flex-col items-center gap-2 rounded-md ${darkMode ? "box-shadow-dark" : "box-shadow"}`}>
                        <h2 className="title-font">Upload your {uploadText}</h2>
                        <div className="image w-[5rem] h-[5rem] relative rounded-full">
                            <img
                                src={`https://ipfs.near.social/ipfs/${cid}`}
                                alt="Profile NFT"
                                className="rounded-full object-cover w-full h-full"
                            />
                        </div>
                        <div className="btns flex gap-2">
                            <button className="px-4 py-2 border border-slate-800 cursor-pointer rounded-md" onClick={() => handleUpload("", "", false)}>Cancel</button>
                            <button className="btn bg-sky-500 cursor-pointer" onClick={handleSaveProfile}>Upload</button>
                        </div>
                    </div>
                </div>}

                {storageModel && <div className="upload-model fixed bg-sky-50 dark:bg-slate-800 top-0 bottom-0 right-0 left-0 flex justify-center items-center">
                    <div className={`upload-box w-[20rem] bg-white mx-3 px-3 py-2 flex flex-col items-center gap-2 rounded-md ${darkMode ? "box-shadow-dark" : "box-shadow"}`}>
                        <h2 className="title-font">Insufficient Storage!</h2>
                        <p className="text-justify">{`You don't have enough space to set the profile on near.social. Please buy ${availableStorage !== null ? "additional" : ""} storage on near.social by spending 0.05 NEAR.`}</p>
                        <div className="btns flex gap-2">
                            <button className="px-4 py-2 border border-slate-800 cursor-pointer rounded-md" onClick={()=>setStorageModel(false)}>Cancel</button>
                            <button className="btn bg-sky-500 cursor-pointer" onClick={buySocialDBStorage}>Buy</button>
                        </div>
                    </div>
                </div>}

            </main>
        </div>
    )
}