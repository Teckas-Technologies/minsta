import { useDarkMode } from "@/context/DarkModeContext";
import { useEffect, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";

interface ProfileData {
    name?: string;
    about?: string;
    profilePicture?: string;
    backgroundImage?: string;
    tags?: string[];
    twitter?: string;
    github?: string;
    telegram?: string;
    website?: string;
}

interface props {
    setEdit : (e:boolean)=>void
}

export const EditProfile = ({setEdit} : props) => {
    const [darkMode, setDarkMode] = useState<boolean>();
    const { mode } = useDarkMode();
    const [profileFileName, setProfileFileName] = useState('');
    const [backgroundFileName, setBackgroundFileName] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [filteredTags, setFilteredTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const dropdownRef = useRef<HTMLInputElement & HTMLUListElement | null>(null);

    const [formProfileData, setFormProfileData] = useState<ProfileData>({
        name: '',
        about: '',
        profilePicture: '',
        backgroundImage: '',
        tags: [],
        twitter: '',
        github: '',
        telegram: '',
        website: ''
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

    const handleProfileFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setProfileFileName(file.name);
            setFormProfileData({
                ...formProfileData,
                profilePicture: file.name
            });
        } else {
            setProfileFileName('');
            setFormProfileData({
                ...formProfileData,
                profilePicture: ''
            });
        }
    };

    const handleBackgroundFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setBackgroundFileName(file.name);
            setFormProfileData({
                ...formProfileData,
                backgroundImage: file.name
            });
        } else {
            setBackgroundFileName('');
            setFormProfileData({
                ...formProfileData,
                backgroundImage: ''
            });
        }
    };

    const handleFocus = (event : React.FocusEvent<HTMLInputElement>)=>{
        const target = event.target
        if(target){
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

    const removeTag = (tag: string)=>{
        setTags(tags.filter(t => t !== tag));
    }

    const listDown = [
        "rust",
        "nft",
        "web",
        "engineer"
    ]

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormProfileData({
            ...formProfileData,
            [name]: value
        });
    };

    const handleSaveProfile = () => {
        console.log(formProfileData);
        setFormProfileData({
            name: '',
            about: '',
            profilePicture: '',
            backgroundImage: '',
            tags: [],
            twitter: '',
            github: '',
            telegram: '',
            website: ''
        })
    };

    return (
        <>
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
                        {tags.length > 0 && tags.map((tag: any)=>(
                            <div key={tag} className="tags-profile py-1 px-2 border border-sky-600 rounded-md">
                                <h3 key={tag} className="text-sky-500 flex items-center gap-1">#{tag} 
                                    <InlineSVG
                                        src="/images/close.svg"
                                        className={`fill-current w-4 h-4 text-sky-500 font-xl cursor-pointer`}
                                        color="#222f3e"
                                        onClick={()=>removeTag(tag)}
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
                        <input name="twitter" id="twitter" placeholder="Enter twiter account" value={formProfileData.twitter} onChange={handleInputChange} className={`w-full outline-none`}  />
                    </div>
                </div>
                <div className="input-field w-full mt-2">
                    <label htmlFor="github" className="text-lg font-bold pl-1 dark:text-white">Github</label>
                    <div className={`social-profile w-full flex gap-2 bg-white text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                        <div className="social-link bg-slate-400 p-2 rounded-l-md">
                            <h2 className="">https://github.com/</h2>
                        </div>
                        <input name="github" id="github" placeholder="Enter github account" value={formProfileData.github} onChange={handleInputChange} className={`w-full outline-none`}  />
                    </div>
                </div>
                <div className="input-field w-full mt-2">
                    <label htmlFor="telegram" className="text-lg font-bold pl-1 dark:text-white">Telegram</label>
                    <div className={`social-profile w-full flex gap-2 bg-white text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                        <div className="social-link bg-slate-400 p-2 rounded-l-md">
                            <h2 className="">https://t.me/</h2>
                        </div>
                        <input name="telegram" id="telegram" placeholder="Enter telegram account" value={formProfileData.telegram} onChange={handleInputChange} className={`w-full outline-none`}  />
                    </div>
                </div>
                <div className="input-field w-full mt-2">
                    <label htmlFor="website" className="text-lg font-bold pl-1 dark:text-white">Website</label>
                    <div className={`social-profile w-full flex gap-2 bg-white text-lg rounded-md outline-none ${darkMode ? "image-holder-dark" : "image-holder"}`}>
                        <div className="social-link bg-slate-400 p-2 rounded-l-md">
                            <h2 className="">https://</h2>
                        </div>
                        <input name="website" id="website" placeholder="Enter website url" value={formProfileData.website} onChange={handleInputChange} className={`w-full outline-none`}  />
                    </div>
                </div>
                <div className="profile-upload mt-4 mb-2 flex gap-2">
                    <button className="btn success-btn" onClick={handleSaveProfile}>Save Profile</button>
                    <button className="btn cancel-btn dark:text-white border dark:border-white" onClick={()=>setEdit(false)}>Cancel</button>
                </div>
                
            </div>
        </div>
        </>
    )
}