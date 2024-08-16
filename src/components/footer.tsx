"use client";

import { Mint } from "@/components/Mint";
import { constants } from "@/constants";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactEventHandler, useContext, useEffect, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";
import { useApp } from "@/providers/app";
import useMintImage from "@/utils/useMint";
import { useDarkMode } from "@/context/DarkModeContext";
import { NearContext } from "@/wallet/WalletSelector";

export const FooterButton = ({ onClick }: { onClick: ReactEventHandler }) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const fileInputRef = useRef<any>(null);
  const { push } = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>();
  const {mode} = useDarkMode();

  const { wallet, signedAccountId } = useContext(NearContext);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(()=> {
    if(mode === "dark") {
    setDarkMode(true);
    } else{
    setDarkMode(false);
    }
  }, [mode])

  const handleSignIn = async () => {
    return wallet?.signIn();
  };

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
          onClick={()=>{signedAccountId ? push("/fileupload") : handleSignIn}}
        >
          <div className="rounded-full h-20 w-20 gradientButton flex items-center justify-center">
            <InlineSVG
              src="/images/photo_gallery.svg"
              className="fill-current text-camera h-12"
            />
          </div>
        </button>
    </div>
  </>
  )
};

const Footer = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const { wallet, signedAccountId } = useContext(NearContext);
  const [darkMode, setDarkMode] = useState<boolean>();
  const {mode} = useDarkMode();

  const { takePicture, openModal } = useApp();

  useEffect(()=> {
    if(mode === "dark") {
    setDarkMode(true);
    } else{
    setDarkMode(false);
    }
  }, [mode])

  const renderFooterButtons = () => {
    const { isClosed } = constants;

    switch (pathname) {
      case "/":
        return !isClosed ? (
          <div className={darkMode ? "dark" : ""}>
          <footer className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-primary h-16 dark:bg-slate-800">
            <div className="camera">
              <FooterButton
                onClick={
                  signedAccountId ? () => push("/camera") : () => openModal("default")
                }
              />
            </div>
          </footer>
          </div>
        ) : null;
      case "/leaderboard":
        return !isClosed ? (
          <div className={darkMode ? "dark" : ""}>
          <footer className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-primary h-16 dark:bg-slate-800">
            <FooterButton
              onClick={
                signedAccountId ? () => push("/camera") : () => openModal("default")
              }
            />
            
          </footer>
          </div>
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
