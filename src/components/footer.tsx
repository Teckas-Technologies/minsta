"use client";

import { Mint } from "@/components/Mint";
import { constants } from "@/constants";
import { useMbWallet } from "@mintbase-js/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactEventHandler, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";
import { useApp } from "@/providers/app";
import useMintImage from "@/utils/useMint";

export const FooterButton = ({ onClick }: { onClick: ReactEventHandler }) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const fileInputRef = useRef<any>(null);
  const { push } = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {connect, activeAccountId, isConnected } = useMbWallet();
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

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

// const handleUpload = () => {
//     if (!file) {
//         alert("No file selected.");
//         return;
//     }
//     if(isConnected){
//       mintGif(file);
//       console.log(file, "Uploading...");
//       // setGalleryOpen(false);
//       setUploading(true);
//     } else {
//       connect();
//     }
// };



  return (
  <>
    <div className="footer-actions w-full flex gap-2 justify-center">
        <button
          className="rounded-full h-24 w-24 bg-primary -top-24 left-12 flex items-center justify-center"
          onClick={onClick}
        >
          <div className="rounded-full h-20 w-20 gradientButton flex items-center justify-center">
            <InlineSVG
              src="/images/photo_camera.svg"
              className="fill-current text-camera h-12"
            />
          </div>
        </button>
        <button className="rounded-full h-24 w-24 bg-primary -top-24 right-12 flex items-center justify-center"
          onClick={()=>{isConnected ? push("/fileupload") : connect()}}
        >
          <div className="rounded-full h-20 w-20 gradientButton flex items-center justify-center">
            <InlineSVG
              src="/images/photo_gallery.svg"
              className="fill-current text-camera h-12"
            />
          </div>
        </button>
    </div>
    {/* {galleryOpen &&
                <div className="gallery-model-page">
                    <div className={`gallery-model`}>
                        {!uploading ?
                        <>
                            <div className={file && tag.length > 0 ? `file-upload h-[8rem]` : file && tag.length === 0 ? "file-upload h-[8rem]" : "file-upload h-[13rem]"} onClick={handleFileUploadClick}>
                              <InlineSVG
                                  src="/images/cloud_upload.svg"
                                  className="icon fill-current text-camera"
                              />
                              <p className="allow">{file ? `Selected file : ${file.name}` : "* Allows only png, jpg, jpeg"}</p>
                            </div>
                            {file && 
                            <div className="gif-tags flex flex-col items-center">
                              <div className="input-field flex gap-3">
                                <input type="text" placeholder="Enter tags..." className="border-none outline-none"  value={tag} onChange={(e)=> {setTag(e.target.value)}}/>
                                <button className="btn success-btn" onClick={addTag}>Add</button>
                              </div>
                              {tags.length > 0 && 
                              <div className="tags-list mt-2 flex gap-2">
                                {tags.map((tag, index) => (
                                  <div
                                    key={index}
                                    className="tag1 rounded px-2 py-1 cursor-pointer"
                                    onClick={()=>removeTag(tag)}
                                  >
                                    {tag}
                                  </div>
                                ))}
                                </div>}
                            </div>
                            }
                            <div className="gallery-upload-btns">
                                <button className="btn btn-cancel" onClick={() => {setGalleryOpen(!galleryOpen); setFile(null);}}>Cancel</button>
                                <button className="btn btn-upload" onClick={handleUpload}>Upload</button>
                            </div>
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
      } */}
  </>
  )
};

const Footer = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const { isConnected } = useMbWallet();

  const { takePicture, openModal } = useApp();

  const renderFooterButtons = () => {
    const { isClosed } = constants;

    switch (pathname) {
      case "/":
        return !isClosed ? (
          <footer className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-primary h-16">
            <div className="camera">
              <FooterButton
                onClick={
                  isConnected ? () => push("/camera") : () => openModal("default")
                }
              />
            </div>
          </footer>
        ) : null;
      case "/leaderboard":
        return !isClosed ? (
          <footer className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-primary h-16">
            <FooterButton
              onClick={
                isConnected ? () => push("/camera") : () => openModal("default")
              }
            />
            
          </footer>
        ) : null;
      case "/camera":
        return null;
      default:
        return null;
    }
  };

  return renderFooterButtons();
};

export default Footer;
