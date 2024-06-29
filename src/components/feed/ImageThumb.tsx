"use client";

import React, { useState } from "react";
import { constants } from "@/constants";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUrl";
import InlineSVG from "react-inlinesvg";
import { useMbWallet } from "@mintbase-js/react";

const ImageThumb = ({ token, index }: any) => {
  const imageUrl = token?.media;
  const [error, setError] = useState(false);
  const { isConnected, activeAccountId } = useMbWallet();

  const handleError = () => {
    setError(true);
  };

  if (error)
    return (
      <div className=" aspect-square flex flex-wrap	 p-10 w-72 h-72 xl:w-80 xl:h-80 relative justify-center items-center text-center bg-gray-200 w-full">
        <div>
          <h1 className="w-full"> No Image Metadata</h1>
          <p className="text-xs text-gray-600 w-full">
            There was an Error with the image.
          </p>
        </div>
      </div>
    );

  if (imageUrl) {
    const finalUrl = getImageUrl(imageUrl);

    return (
      <div className="image-holder p-2 rounded-md aspect-square  sm:w-full md:w-72 h-72 xl:w-80 xl:h-80 relative">
        <Link
          key={`${token?.metadata_id}-${index}`}
          href={`meta/${token?.metadata_id}`}
          rel="noopener noreferrer"
          passHref
        >
          <Image
            key={token?.metadata_id}
            src={`https://image-cache-service-z3w7d7dnea-ew.a.run.app/thumbnail?url=${finalUrl}`}
            alt={`Token ${index}`}
            className="object-cover h-full w-full image rounded-md"
            width={320}
            height={320}
            quality={70}
            priority={index < 5}
            onError={handleError}
            placeholder="empty"
            unoptimized
          />
          <button
            className="absolute top-4 right-4 bg-sky-500 text-white rounded p-1 text-xs px-2 py-1.5"
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
            src="/images/share.svg"
            className="fill-current"
            color="#fff"
            />
          </button>
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
        </Link>
      </div>
    );
  } else {
    return null;
  }
};

export const MemoizedImageThumb = React.memo(ImageThumb);
