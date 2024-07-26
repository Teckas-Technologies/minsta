import { useDarkMode } from "@/context/DarkModeContext";
import { convertBase64ToFile } from "@/utils/base64ToFile";
import useMintImage from "@/utils/useMint";
import { useMbWallet } from "@mintbase-js/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
    const [darkMode, setDarkMode] = useState<boolean>();
    const {mode} = useDarkMode();
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [preview, setPreview] = useState(false);
    const [convertedPhotoFile, setconvertedPhotoFile] = useState<File>();
    const [generating, setGenerating] = useState(false);

    useEffect(()=> {
      if(mode === "dark") {
        setDarkMode(true);
      } else{
        setDarkMode(false);
      }
    }, [mode])

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
    
      const {mintGif, fileToBase64, reduceImageSize, getTitleAndDescription, loading, error} = useMintImage();
    
      const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          const file = event.target.files[0];
          setFile(file);
          const fileURL = URL.createObjectURL(file);
          setFilePreview(fileURL);
          setGenerating(true)
          const photo = await fileToBase64(file);
          const photoFile = convertBase64ToFile(photo);
          setconvertedPhotoFile(photoFile)
          const replicatePhoto = await reduceImageSize(photo, 10); 
          const titleAndDescription = await getTitleAndDescription(replicatePhoto);
          setTitle(titleAndDescription?.title)
          setDescription(titleAndDescription?.description)
          setGenerating(false);
        } else {
            alert("Only png, jpg, and jpeg files are allowed.");
        }
    };
    
    const handleUpload = () => {
        if (!convertedPhotoFile) {
            alert("No file selected.");
            return;
        }
        if(isConnected){
          setPreview(false)
          mintGif(convertedPhotoFile, title, description, tags);
          console.log(file, "Uploading...");
          setUploading(true);
          setTitle("");
          setDescription("");
          setTags([]);
          setFile(null);
          setFilePreview(null);
        } else {
          connect();
        }
    };


    return (
        <div className={darkMode ? "dark" : ""}>
        <main className="h-[100vh] w-[100%] px-4 relative flex flex-col items-center photo-main bg-white dark:bg-slate-800">
            <div className={`photo-box ${darkMode ? "box-shadow-dark" : "box-shadow"} h-auto w-full md:h-auto md:w-96 flex flex-col gap-4 scroll mb-2`}>
                <div className="gallery-model-page1">
                    <div className={`gallery-model1`}>
                        {!uploading ?
                        <>
                            {!filePreview ? 
                            <div className="file-upload h-[12rem]" onClick={handleFileUploadClick}>
                              <InlineSVG
                                  src="/images/cloud_upload.svg"
                                  className="icon fill-current text-camera"
                              />
                              <p className="allow">{file ? `Selected file : ${file.name}` : "* Allows only png, jpg, jpeg"}</p>
                            </div> : 
                            <div className="file-uploa h-[12rem]">
                              <img src={filePreview} alt="" className="rounded-md h-full w-full" />
                            </div>}
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
                    {!generating ? <>
                      <div className="input-field">
                        <input type="text" placeholder="Enter the title of the NFT..." className="border-none outline-none w-full" value={title} onChange={(e)=> {setTitle(e.target.value)}}/>
                      </div>
                      <div className="input-field">
                        <input type="text" placeholder="Enter the description of the NFT..." className="border-none outline-none w-full" value={description} onChange={(e)=> {setDescription(e.target.value)}}/>
                      </div></> : <div className="generating flex flex-col items-center gap-2 pb-2">
                        <div className="loader"></div>
                        <h2 className="dark:text-white">Generating Title & Description...</h2>
                      </div> }
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
                    className="text-secondaryBtnText w-full border border-secondaryBtnText rounded px-4 py-2 dark:text-white dark:border-white"
                    onClick={()=> push("/")}
                    >
                    Back
                    </button>
                    <button
                    className="gradientButton w-full text-primaryBtnText rounded px-4 py-2"
                    onClick={()=>setPreview(true)}
                    // disabled={inputOpen ? true : false}
                    >
                    Preview
                    </button>
                </div>
                </>
                }
            </div>
            {preview && <div className="preview absolute top-0 left-0 min-h-[100vh] h-[100%] right-0 bg-sky-100 dark:bg-slate-800 flex items-center justify-center pt-[15rem] pb-[10rem]">
              <div className="preview-box w-[20rem] md:w-[25rem] bg-white p-[1rem] md:px-[2.5rem] md:py-[1rem] rounded-md">
                <div className="title-font text-2xl text-center">Preview</div>
                <div className="moment w-[18rem] h-[18rem] md:w-[20rem] md:h-[20rem]">
                  {filePreview ? <img src={filePreview} alt="" className="rounded-md h-full w-full"/> : ""}
                </div>
                {title && <div className="title pt-3 pb-2">
                  <h2><span className="title-font">Title :</span> {title}</h2>
                </div>}
                {description && <div className="description">
                  <h2 className="text-justify line-clamp-3"><span className="title-font">Description :</span> {description}</h2>
                </div>}
                {tags.length > 0 && (
                  <div className="added-tags flex gap-2 p-2 my-2">
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
                <div className="btn-groups flex gap-3 py-2">
                  <button className="text-secondaryBtnText w-full border border-secondaryBtnText rounded px-4 py-2 dark:text-slate-900 dark:border-slate-800" onClick={()=>setPreview(false)}>Cancel</button>
                  <button className={`${!title || !description || !file ? 'cursor-not-allowed' : 'cursor-pointer'} gradientButton w-full text-primaryBtnText rounded px-4 py-2`} onClick={handleUpload} disabled={!title || !description || !file}>Upload</button>
                </div>
              </div>
              </div>}
        </main>
        </div>
    )
}