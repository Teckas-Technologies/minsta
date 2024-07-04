import { useDarkMode } from "@/context/DarkModeContext";
import useMintImage from "@/utils/useMint";
import { useMbWallet } from "@mintbase-js/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";

export default function FileUploadPage() {
    const fileInputRef = useRef<any>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const { push } = useRouter();
    const {connect, activeAccountId, isConnected } = useMbWallet();
    const { darkMode } = useDarkMode();

    const addTag = () => {
        if (tag.trim() !== "" && tags.length < 4) {
          setTags([...tags, tag.trim()]);
          setTag("");
        } else if (tags.length >= 4) {
          alert("You can only add up to 4 tags.");
        }
    };
    
    const removeTag = (tagText: string) => {
        setTags(tags.filter(tag => tag !== tagText));
    };

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };
    
      const {mintGif, loading, error} = useMintImage();
    
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          const file = event.target.files[0];
          console.log("File Type: ",file.type);
          setFile(file);
        } else {
            alert("Only png, jpg, and jpeg files are allowed.");
        }
    };
    
    const handleUpload = () => {
        if (!file) {
            alert("No file selected.");
            return;
        }
        if(isConnected){
          mintGif(file, title, description);
          console.log(file, "Uploading...");
          // setGalleryOpen(false);
          setUploading(true);
          setTitle("");
          setDescription("");
        } else {
          connect();
        }
    };


    return (
        <div className={darkMode ? "dark" : ""}>
        <main className="h-[100vh] w-[100%] px-4  flex flex-col items-center photo-main bg-white dark:bg-slate-800">
            <div className={`photo-box ${darkMode ? "box-shadow-dark" : "box-shadow"} h-auto w-full md:h-auto md:w-96 flex flex-col gap-4 scroll mb-2`}>
                <div className="gallery-model-page1">
                    <div className={`gallery-model1`}>
                        {!uploading ?
                        <>
                            <div className="file-upload h-[13rem]" onClick={handleFileUploadClick}>
                              <InlineSVG
                                  src="/images/cloud_upload.svg"
                                  className="icon fill-current text-camera"
                              />
                              <p className="allow">{file ? `Selected file : ${file.name}` : "* Allows only png, jpg, jpeg"}</p>
                            </div>
                            
                            {/* <button className="btn btn-cancel" onClick={() => {setGalleryOpen(!galleryOpen); setFile(null);}}>Cancel</button> */}
                            {/* <div className="gallery-upload-btns">
                                
                                <button className="btn btn-cancel" onClick={() =>  setFile(null)}>Cancel</button>
                                <button className="btn btn-upload" onClick={handleUpload}>Upload</button>
                            </div> */}
                        </> : 
                        <div className="flex flex-col justify-center items-center gap-6 w-full h-full">
                          <div className="loader"></div>
                          <h2 className="text-lg title-font">Uploading...</h2>
                        </div>}
                    </div>
                    <div className="file-upload-input hidden">
                        <form action="/">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} />
                        </form>
                    </div>
                </div>

                {!uploading && 
                <>
                <div className="tags pb-2 px-2">
                    <div className="input-field">
                      <input type="text" placeholder="Enter the title of the NFT..." className="border-none outline-none w-full" value={title} onChange={(e)=> {setTitle(e.target.value)}}/>
                    </div>
                    <div className="input-field">
                      <input type="text" placeholder="Enter the description of the NFT..." className="border-none outline-none w-full" value={description} onChange={(e)=> {setDescription(e.target.value)}}/>
                    </div>
                    <div className="input-field">
                    <input type="text" placeholder="Enter tags..." className="border-none outline-none w-full" value={tag} onChange={(e)=> {setTag(e.target.value)}}/>
                    <button className="btn success-btn" onClick={addTag}>Add</button>
                    </div>
                    {tags.length > 0 && (
                        <div className="added-tags flex gap-2 p-2 ">
                        {tags.map((tag, index) => (
                            <div
                            key={index}
                            className="tag rounded px-2 py-1 cursor-pointer"
                            onClick={()=>removeTag(tag)}
                            >
                            {tag}
                            </div>
                        ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 w-full">
                    <button
                    className="text-secondaryBtnText w-full border border-secondaryBtnText rounded px-4 py-2"
                    onClick={()=> push("/")}
                    >
                    Cancel
                    </button>
                    <button
                    className="gradientButton w-full text-primaryBtnText rounded px-4 py-2"
                    onClick={handleUpload}
                    // disabled={inputOpen ? true : false}
                    >
                    Upload
                    </button>
                </div>
                </>
                }
            </div>
        </main>
        </div>
    )
}