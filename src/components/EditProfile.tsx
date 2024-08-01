import { useDarkMode } from "@/context/DarkModeContext";
import { getFollowers, getFollowing, getSocialProfile, NEARSocialUserProfile } from "@/contracts/social";
import { getImage } from "@/contracts/social/image";
import { useFetchProfile, useSaveProfile } from "@/hooks/db/ProfileHook";
import { arrayBufferToBase64 } from "@/utils/arrayBufferToBase64";
import { fileToArrayBuffer } from "@/utils/fileToArrayBuffer";
import { useMbWallet } from "@mintbase-js/react";
import { useEffect, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";

interface ProfileType {
    accountId: string;
    name: string;
    profileImage?: string;
    backgroundImage?: string;
    about: string;
    tags: string[];
    linkTree: {
        twitter: string;
        github: string;
        telegram: string;
        website: string;
    };
}

interface props {
    setEdit: (e: boolean) => void;
    accountId: string;
}

const listDown = [
    "rust",
    "nft",
    "web",
    "engineer"
]

export const EditProfile = ({ setEdit, accountId }: props) => {
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const { activeAccountId, connect, isConnected } = useMbWallet();
    const [profileFileName, setProfileFileName] = useState('');
    const [backgroundFileName, setBackgroundFileName] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [filteredTags, setFilteredTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const dropdownRef = useRef<HTMLInputElement & HTMLUListElement | null>(null);
    const { saveDBProfile } = useSaveProfile();
    const { fetchDBProfile } = useFetchProfile();
    const [loadding, setLoading] = useState(false);
    const [toast, setToast] = useState(false);
    const [toastText, setToastText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [profile, setProfile] = useState<NEARSocialUserProfile>();
    const [images, setImages] = useState<string[]>();
    const [following, setFollowing] = useState<number | null>(null);
    const [followers, setFollowers] = useState<number | null>(null);

    useEffect(() => {
        if (activeAccountId) {
            const fetchProfile = async () => {
                try {
                    const profileData = await getSocialProfile({ accountId: activeAccountId });
                    const followingData = await getFollowing({ accountId: activeAccountId });
                    const followersData = await getFollowers({ accountId: activeAccountId });
                    setProfile(profileData);
                    setFollowing(followingData.total);
                    setFollowers(followersData.total);
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
                        setImages(images)
                    }
                } catch (err) {
                    console.log("Error >> ", err)
                }
            }
            fetchProfile();
            
            setFormProfileData({
                ...formProfileData,
                accountId: activeAccountId
            });
            const fetchAndSetProfile = async () => {
                const profile = await fetchDBProfile(activeAccountId);
                if (profile) {
                    setFormProfileData((prevData) => ({
                        ...prevData,
                        ...profile,
                        linkTree: {
                            ...prevData.linkTree,
                            ...profile.linkTree,
                        },
                    }));
                    if(profile.tags && profile.tags?.length > 0){
                        setTags(profile.tags);
                    }
                }
            };
            setFormProfileData((prevData) => ({
                ...prevData,
                accountId: activeAccountId,
            }));
            fetchAndSetProfile();
        }
    }, [activeAccountId, submitted]);

    useEffect(() => {
        if (toast) {
            setTimeout(() => {
                setToast(false);
                setToastText("");
            }, 5000)
        }
    }, [toast]);

    const [formProfileData, setFormProfileData] = useState<ProfileType>({
        accountId: '',
        name: '',
        about: '',
        profileImage: '',
        backgroundImage: '',
        tags: [],
        linkTree: {
            twitter: '',
            github: '',
            telegram: '',
            website: ''
        }
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        if (mode === "dark") {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }, [mode])

    const handleFileClick = (inputId: string) => {
        const fileInput = document.getElementById(inputId);
        if (fileInput) {
            (fileInput as HTMLInputElement).click();
        }
    };

    const handleProfileFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfileFileName(file.name);
            try {
                // const base64 = await fileToArrayBuffer(file);
                // console.log("Base 1 >> ", base64)
                const arrayBuffer = await file.arrayBuffer();
                const base64String = arrayBufferToBase64(arrayBuffer);
                setFormProfileData(prevData => ({
                    ...prevData,
                    profileImage: base64String.toString()
                }));
            } catch (error) {
                console.error('Error converting file to Base64:', error);
            }
        } else {
            setProfileFileName('');
            setFormProfileData(prevData => ({
                ...prevData,
                profileImage: ''
            }));
        }
    };
    
    const handleBackgroundFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setBackgroundFileName(file.name);
            try {
                // const base64 = await fileToArrayBuffer(file);
                // console.log("Base 2 >> ", base64)
                const arrayBuffer = await file.arrayBuffer();
                const base64String = arrayBufferToBase64(arrayBuffer);
                setFormProfileData(prevData => ({
                    ...prevData,
                    backgroundImage: base64String.toString()
                }));
            } catch (error) {
                console.error('Error converting file to Base64:', error);
            }
        } else {
            setBackgroundFileName('');
            setFormProfileData(prevData => ({
                ...prevData,
                backgroundImage: ''
            }));
        }
    };
    

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        const target = event.target
        if (target) {
            const filtered = listDown.filter(tag =>
                !tags.includes(tag)
            );
            setFilteredTags(filtered);
            setShowDropdown(true);
        }
    }

    const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInputValue(inputValue);

        if (inputValue.length === 0) {
            setFilteredTags(listDown);
            setShowDropdown(true);
        } else {
            const filtered = listDown.filter(tag =>
                tag.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(tag)
            );
            setFilteredTags(filtered);
            setShowDropdown(true);
        }
    };

    const handleTagSelection = (tag: string) => {
        if (!tags.includes(tag)) {
            setFormProfileData({
                ...formProfileData,
                tags: [...tags, tag]
            });
            setTags([...tags, tag]);
        }
        setInputValue('');
        setShowDropdown(false);
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        if (name in formProfileData.linkTree) {
            setFormProfileData((prevData) => ({
                ...prevData,
                linkTree: {
                    ...prevData.linkTree,
                    [name]: value
                }
            }));
        } else {
            setFormProfileData({
                ...formProfileData,
                [name]: value
            });
        }
    };

    const handleSaveProfile = async () => {
        console.log("Form Data >> ", formProfileData)
        setLoading(true);
        if (formProfileData.accountId && formProfileData.name) {
            await saveDBProfile(formProfileData).then((res) => {
                console.log("Response >> ", res?.savedProfile)
                setToast(true);
                if (res?.status === 200) {
                    setToastText("Profile Saved Successfully!")
                } else {
                    setToastText("Error Saving Data!")
                }
                setFormProfileData({
                    accountId: '',
                    name: '',
                    about: '',
                    profileImage: '',
                    backgroundImage: '',
                    tags: [],
                    linkTree: {
                        github: '',
                        telegram: '',
                        twitter: '',
                        website: ''
                    }
                });
                setProfileFileName('');
                setBackgroundFileName('');
                setTags([]);
                setInputValue('');
                // setEdit(false)
            })
        } else {
            setToast(true)
            setToastText("Missing Required Field")
        }
        setLoading(false);
        setSubmitted(!submitted);
    };

    return (
        <div className="w-full">
            {loadding ?
                <div className="loading pt-11 flex flex-col items-center gap-5">
                    <div className="loader"></div>
                    <h1 className="dark:text-white">Saving Profile Details...</h1>
                </div> :
                <div className={`${darkMode ? 'dark' : ''} edit-profile w-full flex flex-col justify-center items-center pb-5 dark:bg-slate-800`}>
                    <div className={`${darkMode ? "image-holder-dark" : "image-holder"} profile-form-holder w-full md:w-[40%] rounded-md p-3`}>
                        <div className="input-field w-full">
                            <label htmlFor="name" className="text-lg font-bold pl-1 dark:text-white">Name</label>
                            <input type="text" name="name" id="name" placeholder="Enter your name..." value={formProfileData.name} onChange={handleInputChange} className={`w-full p-2 text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`} />
                        </div>
                        <div className="input-field w-full mt-2">
                            <label htmlFor="profileInput" className="text-lg font-bold pl-1 dark:text-white">Profile Picture</label>
                            <input type="file" name="picture" id="profileInput" onChange={handleProfileFileChange} className={`hidden w-full p-2 text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`} />
                            <div className={`file-input w-full p-2 text-lg rounded-md bg-white outline-none flex items-center gap-2 ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                                <button
                                    type="button"
                                    className="custom-file-input w-[8rem] bg-sky-500 py-1 px-2 rounded-md text-white"
                                    onClick={() => handleFileClick('profileInput')}
                                >
                                    Choose File
                                </button>
                                <h3 className="overflow-hidden text-ellipsis whitespace-nowrap">{profileFileName ? profileFileName : 'No file chosen'}</h3>
                            </div>
                        </div>
                        <div className="input-field w-full mt-2">
                            <label htmlFor="backgroundInput" className="text-lg font-bold pl-1 dark:text-white">Background Image</label>
                            <input type="file" name="picture" id="backgroundInput" onChange={handleBackgroundFileChange} className={`hidden w-full p-2 text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`} />
                            <div className={`file-input w-full p-2 text-lg rounded-md bg-white outline-none flex items-center gap-2 ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                                <button
                                    type="button"
                                    className="custom-file-input w-[8rem] bg-sky-500 py-1 px-2 rounded-md text-white"
                                    onClick={() => handleFileClick('backgroundInput')}
                                >
                                    Choose File
                                </button>
                                <h3 className="overflow-hidden text-ellipsis whitespace-nowrap">{backgroundFileName ? backgroundFileName : 'No file chosen'}</h3>
                            </div>
                        </div>
                        <div className="input-field w-full mt-2">
                            <label htmlFor="about" className="text-lg font-bold pl-1 dark:text-white">About</label>
                            <textarea name="about" id="about" placeholder="Type About Yourself..." value={formProfileData.about} onChange={handleInputChange} className={`w-full p-2 text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`} />
                        </div>
                        <div className="input-field w-full mt-2">
                            <label htmlFor="tags" className="text-lg font-bold pl-1 dark:text-white">Tags</label>
                            <div className={`w-full relative flex gap-2 p-2 text-lg rounded-md outline-none bg-white ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                                {tags.length > 0 && tags.map((tag: any) => (
                                    <div key={tag} className="tags-profile py-1 px-2 border border-sky-600 rounded-md">
                                        <h3 key={tag} className="text-sky-500 flex items-center gap-1">#{tag}
                                            <InlineSVG
                                                src="/images/close.svg"
                                                className={`fill-current w-4 h-4 text-sky-500 font-xl cursor-pointer`}
                                                color="#222f3e"
                                                onClick={() => removeTag(tag)}
                                            />
                                        </h3>
                                    </div>
                                ))}
                                <input
                                    name="tags"
                                    id="tags"
                                    placeholder="rust, engineer, artist, nft, learner"
                                    value={inputValue}
                                    onChange={handleTagInputChange}
                                    onFocus={handleFocus}
                                    ref={dropdownRef}
                                    className={`w-full outline-none`} />
                                {showDropdown && filteredTags.length > 0 && (
                                    <ul className="absolute top-[101%] bg-white w-full mt-1 py-1 rounded-md shadow-md" ref={dropdownRef}>
                                        {filteredTags.map(tag => (
                                            <li
                                                key={tag}
                                                className="cursor-pointer px-3 py-1 hover:bg-gray-200"
                                                onClick={() => handleTagSelection(tag)}
                                            >
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="input-field w-full mt-2">
                            <label htmlFor="twitter" className="text-lg font-bold pl-1 dark:text-white">Twitter</label>
                            <div className={`social-profile w-full flex gap-2 bg-white text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                                <div className="social-link bg-slate-400 p-2 rounded-l-md">
                                    <h2 className="">https://twitter.com/</h2>
                                </div>
                                <input name="twitter" id="twitter" placeholder="Enter twiter account" value={formProfileData?.linkTree?.twitter} onChange={handleInputChange} className={`w-full outline-none`} />
                            </div>
                        </div>
                        <div className="input-field w-full mt-2">
                            <label htmlFor="github" className="text-lg font-bold pl-1 dark:text-white">Github</label>
                            <div className={`social-profile w-full flex gap-2 bg-white text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                                <div className="social-link bg-slate-400 p-2 rounded-l-md">
                                    <h2 className="">https://github.com/</h2>
                                </div>
                                <input name="github" id="github" placeholder="Enter github account" value={formProfileData?.linkTree?.github} onChange={handleInputChange} className={`w-full outline-none`} />
                            </div>
                        </div>
                        <div className="input-field w-full mt-2">
                            <label htmlFor="telegram" className="text-lg font-bold pl-1 dark:text-white">Telegram</label>
                            <div className={`social-profile w-full flex gap-2 bg-white text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                                <div className="social-link bg-slate-400 p-2 rounded-l-md">
                                    <h2 className="">https://t.me/</h2>
                                </div>
                                <input name="telegram" id="telegram" placeholder="Enter telegram account" value={formProfileData?.linkTree?.telegram} onChange={handleInputChange} className={`w-full outline-none`} />
                            </div>
                        </div>
                        <div className="input-field w-full mt-2">
                            <label htmlFor="website" className="text-lg font-bold pl-1 dark:text-white">Website</label>
                            <div className={`social-profile w-full flex gap-2 bg-white text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                                <div className="social-link bg-slate-400 p-2 rounded-l-md">
                                    <h2 className="">https://</h2>
                                </div>
                                <input name="website" id="website" placeholder="Enter website url" value={formProfileData?.linkTree?.website} onChange={handleInputChange} className={`w-full outline-none`} />
                            </div>
                        </div>
                        <div className="profile-upload mt-4 mb-2 flex gap-2">
                            <button className="btn success-btn" disabled={formProfileData.accountId && formProfileData.name ? false : true} onClick={handleSaveProfile}>Save Profile</button>
                            <button className="btn cancel-btn dark:text-white border dark:border-white" onClick={() => setEdit(false)}>Cancel</button>
                        </div>

                    </div>
                </div>}
            {toast && <div id="toast-default" className="toast-container mt-6 md:top-14 top-14 left-1/2 transform -translate-x-1/2 fixed ">
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
        </div>
    )
}