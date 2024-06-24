"use client";

import { constants } from "@/constants";
import { useApp } from "@/providers/app";
import { useMbWallet } from "@mintbase-js/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactEventHandler, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";

export const FooterButton = ({ onClick }: { onClick: ReactEventHandler }) => {

  const [galleryOpen, setGalleryOpen] = useState(false);
  const fileInputRef = useRef<any>(null);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
          onClick={()=>setGalleryOpen(!galleryOpen)}
        >
          <div className="rounded-full h-20 w-20 gradientButton flex items-center justify-center">
            <InlineSVG
              src="/images/photo_gallery.svg"
              className="fill-current text-camera h-12"
            />
          </div>
        </button>
    </div>
    {galleryOpen &&
      <div className="gallery-model-page">
        <div className="gallery-model">
          <div className="file-upload" onClick={handleFileUploadClick}>
            <InlineSVG
              src="/images/cloud_upload.svg"
              className="icon fill-current text-camera"
              color="#000"
            />
            <p className="allow">* Allows only png, jpg, jpeg</p>
          </div>
          <div className="gallery-upload-btns">
            <button className="btn btn-cancel" onClick={()=> setGalleryOpen(!galleryOpen)}>Cancel</button>
            <button className="btn btn-upload">Upload</button>
          </div>
        </div>
        <div className="file-upload-input hidden">
          <form action="/">
            <input type="file" ref={fileInputRef} />
          </form>
        </div>
      </div>
    }
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
