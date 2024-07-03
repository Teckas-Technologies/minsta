"use client";

import React, { useEffect, useRef, useState } from "react";
import { constants } from "@/constants";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUrl";
import InlineSVG from "react-inlinesvg";
import { useMbWallet } from "@mintbase-js/react";

const ImageThumb = ({ token, index, dark }: any) => {
  const imageUrl = token?.media;
  const [error, setError] = useState(false);
  const { isConnected, activeAccountId } = useMbWallet();
  const [shareModal, setShareModal] = useState(false);
  type MessageKeys = 'facebook' | 'twitter' | 'whatsapp';
  const toggleShareRef = useRef<HTMLDivElement | null>(null);

  const [socialMedias, setSocialMedias] = useState<Array<{name: MessageKeys, title: string, path: string, message: string, enabled: boolean}>>([
      { name: 'facebook', title: "Facebook", path: "/images/facebook.svg", message: "", enabled: true },
      { name: 'twitter', title: "Twitter", path: "/images/twitter_x.svg",  message: "", enabled: true },
      { name: 'whatsapp', title: "Whatsapp", path: "/images/whatsapp.svg",  message: "", enabled: true },
  ]);

  const handleError = () => {
    setError(true);
  };

  const toggleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareModal(!shareModal);
  }

  const handleImageClick = () => {
    window.location.href = `meta/${token?.metadata_id}`;
  };

  const openMedia = (name: string, e:any) => {
    e.preventDefault();
    if(name === "twitter"){
      window.open(
        `https://twitter.com/intent/tweet?url=%0aCheck%20out%20mine%3A%20${
          window.location.origin
        }/meta/${decodeURIComponent(
          token?.metadata_id
        )}%2F&via=mintbase&text=${constants.twitterText}`,
        "_blank"
      );
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toggleShareRef.current && !toggleShareRef.current.contains(event.target as Node)) {
        setShareModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleShareRef]);



  if (error)
    return (
      <div className=" aspect-square flex flex-wrap	 p-10 sm:w-[18rem] md:w-[18rem] md:h-[18rem] xl:w-[18rem] xl:h-[18rem] relative justify-center items-center text-center bg-gray-200 w-full">
        <div>
          <h1 className="w-full"> No Image Metadata</h1>
          <p className="text-xs text-gray-600 w-full">
            There was an Error with the image.
          </p>
        </div>
      </div>
    );

    console.log("Dark Image >>", dark)

  if (imageUrl) {
    const finalUrl = getImageUrl(imageUrl);

    return (
      <div className={`${dark ? "image-holder-dark" : "image-holder"} p-2 rounded-md aspect-square sm:w-[18rem] md:w-[18rem] md:h-[18rem] xl:w-[18rem] xl:h-[18rem] relative`}>
        {/* <Link
          key={`${token?.metadata_id}-${index}`}
          href={`meta/${token?.metadata_id}`}
          rel="noopener noreferrer"
          passHref
        > */}
          <Image
            key={token?.metadata_id}
            src={`https://image-cache-service-z3w7d7dnea-ew.a.run.app/thumbnail?url=${finalUrl}`}
            alt={`Token ${index}`}
            className="object-cover cursor-pointer h-full w-full image rounded-md"
            width={320}
            height={320}
            quality={70}
            priority={index < 5}
            onError={handleError}
            placeholder="empty"
            unoptimized
            onClick={handleImageClick}
          />
          <button
            className="absolute top-4 right-4 bg-sky-500 text-white rounded p-1 text-xs px-2 py-1.5"
            onClick={toggleShare}
            // ref={toggleShareRef}
          >
            <InlineSVG
            src="/images/share.svg"
            className="fill-current"
            color="#fff"
            />
          </button>
          {shareModal && 
            <div className="absolute top-[-2rem] w-full flex justify-end pr-4" ref={toggleShareRef}>
              {/* <h2>Share apps...</h2> */}
              <div className="share-apps flex items-center">
                {socialMedias.map((media, i) => (
                  <div key={i} className="share-app cursor-pointer px-2 py-1 mx-1" onClick={(e)=>openMedia(media.name, e)}>
                    <InlineSVG
                      src={media.path}
                      className="fill-current"
                      color="#222f3e"
                      />
                  </div>
                ))}
              </div>
            </div>
          }
          <button
                className="absolute top-4 left-4 bg-slate-500 text-white rounded p-1 text-xs px-2 py-2"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    `https://twitter.com/intent/tweet?url=%0aCheck%20out%20mine%3A%20${
                      window.location.origin
                    }/meta/${decodeURIComponent(
                      token?.metadata_id
                    )}%2F&via=mintbase&text=${constants.twitterText}`,
                    "_blank"
                  );
                }}
              >
                <InlineSVG
                src="/images/eye_hide.svg"
                className="fill-current"
                color="#fff"
                />
              </button>
          {activeAccountId === constants.adminId && 
          <div>
            <button
                className="absolute top-4 left-14 bg-red-500 text-white rounded p-1 text-xs px-2 py-2"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    `https://twitter.com/intent/tweet?url=%0aCheck%20out%20mine%3A%20${
                      window.location.origin
                    }/meta/${decodeURIComponent(
                      token?.metadata_id
                    )}%2F&via=mintbase&text=${constants.twitterText}`,
                    "_blank"
                  );
                }}
              >
                <InlineSVG
                src="/images/trash.svg"
                className="fill-current"
                color="#fff"
                />
              </button>
            </div>}
        {/* </Link> */}
      </div>
    );
  } else {
    return null;
  }
};

export const MemoizedImageThumb = React.memo(ImageThumb);
