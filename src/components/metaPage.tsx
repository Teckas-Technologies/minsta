"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import Link from "next/link";
import { constants } from "@/constants";
import InlineSVG from "react-inlinesvg";
import { getImageUrl } from "@/utils/imageUrl";
import { useMbWallet } from "@mintbase-js/react";
import { useEffect, useRef, useState } from "react";
import { useFetchSocialMedias } from "@/hooks/db/SocialMediaHook";
import { useSaveHidePost } from "@/hooks/db/HidePostHook";
import { HidePost } from "@/data/types";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/context/DarkModeContext";

export const MetaPage = ({ meta, slug, tokenId }: any) => {
  const finalUrl = getImageUrl(meta?.data?.nft_metadata?.[0]?.media);
  const {activeAccountId, isConnected} = useMbWallet();
  const {push} = useRouter();
  const [shareModal, setShareModal] = useState(false);
  const [toast, setToast] = useState(false);
  type MessageKeys = 'facebook' | 'twitter' | 'whatsapp';
  const toggleShareRef = useRef<HTMLDivElement | null>(null);

  const { socialMedias } = useFetchSocialMedias();
  const { saveHidePost } = useSaveHidePost()

  const [showTooltip, setShowTooltip] = useState({ share: false, hide: false, delete: false });
  const [darkMode, setDarkMode] = useState<boolean>();
  const {mode} = useDarkMode();

  useEffect(()=> {
    console.log("Mode Home >> ", mode);
    if(mode === "dark") {
      setDarkMode(true);
    } else{
      setDarkMode(false);
    }
  }, [mode])

  const toggleTooltip = (tooltip: any, state: any) => {
    setShowTooltip((prevState) => ({ ...prevState, [tooltip]: state }));
  };

  let enabledMedia = socialMedias?.filter((media) => media.enabled === true);

  const toggleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareModal(!shareModal);
  }

  const openMedia = (name: string, message: string, e: any) => {
    e.preventDefault();
    const url = `${window.location.origin}/meta/${decodeURIComponent(slug)}`;
    let shareUrl = '';
  
    switch(name) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=%20${url}%2F&via=mintbase&text=${message}`;
        break;
      case 'telegram':
        shareUrl = `https://telegram.me/share/url?url=${url}&text=${message}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${message}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${message}%20${url}`;
        break;
      default:
        return;
    }
  
    window.open(shareUrl, "_blank");
  }

  const handleHidePost = async (tokenId: any, e: any) => {
    if(activeAccountId) {
      const data: HidePost = {
        accountId: activeAccountId?.toString(),
        hiddedTokenIds: [
          {
              id: tokenId
          }
        ]
      }
      await saveHidePost(data).then(()=>{
        setToast(true);
      })
    }
  }

  const handleCloseToast = () => {
    setToast(false);
    // window.location.reload();
    push("/")
  }

  // useEffect(()=> {
  //   if(toast) {
  //       setTimeout(()=> {
  //           setToast(false);
  //       }, 5000)
  //   }
  // }, [toast])

  const tags = meta?.data?.nft_metadata?.[0]?.reference_blob?.tags;

  const tagsArray = tags?.split(',').map((tag: any) => tag.trim()).filter((tag: any) => tag.length > 0) || [];

  return (
    <div className={darkMode ? "dark" : ""}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "linear" }}
      className={`flex wrap flex-col h-[100%] min-h-[100vh] px-4 items-center pb-[30px] pt-20  w-[100%] m-auto  bg-white dark:bg-slate-800`}
    >
      <div className={`meta-page-holder ${darkMode ? "box-shadow-dark" : "box-shadow"} px-4 pb-10 mt-2 rounded-lg max-w-[31.4rem]`}>
        <div className={`${darkMode ? "image-holder-dark" : "image-holder"}  md:w-[468px] md:h-[468px] relative p-2 mt-10 rounded-md`}>
          <Image
            alt={meta?.data?.nft_metadata?.[0]?.title}
            src={finalUrl}
            width="468"
            height="468"
            className="rounded-md image w-full h-full object-cover"
          />
          <button
            className="absolute top-4 right-4 bg-sky-500 text-white rounded p-1 text-xs px-2 py-2"
            onMouseEnter={() => toggleTooltip('share', true)}
            onMouseLeave={() => toggleTooltip('share', false)}
            onClick={toggleShare}
          >
            <InlineSVG
              src="/images/share.svg"
              className="fill-current"
              color="#fff"
              />
          </button>
          {showTooltip.share && !shareModal && <div className="tooltip absolute top-[-1.8rem] right-1 bg-white px-2 py-1 rounded-md box-shadow">Share</div>}
          {shareModal && 
              <div className="absolute top-[-2.2rem] w-full flex justify-end pr-4" ref={toggleShareRef}>
                {enabledMedia ?
                <div className="share-apps flex items-center">
                  {enabledMedia?.map((media, i) => (
                    <div key={i} className="share-app cursor-pointer px-2 py-1 mx-1" onClick={(e)=>openMedia(media.name, media.message, e)}>
                      <InlineSVG
                        src={media.path}
                        className="fill-current"
                        color="#222f3e"
                        />
                    </div>
                  ))}
                </div> : 
                <div className="no-share">
                  <h2>Can&apos;t Share</h2>
                </div>
                }
              </div>
            }
          {activeAccountId && 
          <button
            className="absolute hidden top-4 left-4 bg-slate-500 text-white rounded p-1 text-xs px-2 py-2"
            onMouseEnter={() => toggleTooltip('hide', true)}
            onMouseLeave={() => toggleTooltip('hide', false)}
            onClick={(e) => {handleHidePost(tokenId, e)}}
          >
            <InlineSVG
              src="/images/eye_hide.svg"
              className="fill-current"
              color="#fff"
              />
          </button>}
          {showTooltip.hide && <div className="tooltip absolute top-[-1.8rem] left-2 bg-white px-2 py-1 rounded-md box-shadow">Hide</div>}
          {activeAccountId && constants.adminId.includes(activeAccountId) && 
            <div>
              <button
                  className="absolute hidden top-4 left-14 bg-red-500 text-white rounded p-1 text-xs px-2 py-2"
                  onMouseEnter={() => toggleTooltip('delete', true)}
                  onMouseLeave={() => toggleTooltip('delete', false)}
                  onClick={(e) => {console.log("Delete")}}
                >
                  <InlineSVG
                  src="/images/trash.svg"
                  className="fill-current"
                  color="#fff"
                  />
                </button>
                {showTooltip.delete && <div className="tooltip absolute top-[-1.8rem] left-10 bg-white px-2 py-1 rounded-md box-shadow">Delete</div>}
          </div>}
        </div>
        <h2 className="font-semibold	pt-5 pb-2 leading-7 text-lg dark:text-white">
          <span className="text-lg font-bold dark:text-white">Title:</span> {meta?.data?.nft_metadata?.[0]?.title}
        </h2>
        <h3 className="text-[14px] mb-2 text-lg dark:text-white text-justify">
          <span className="text-lg font-bold dark:text-white">Description:</span> {meta?.data?.nft_metadata?.[0]?.description}
        </h3>
        {
          tagsArray[0] && <>
          <h2 className="text-lg pb-1 font-bold dark:text-white">Tags:</h2>
        <div className={`meta-tags ${darkMode ? "box-shadow" : "box-shadow"}  px-3 py-2 mb-2 rounded-lg flex gap-3 mb-3`}>
          {
            tagsArray[0] && 
            <div className={`meta-tag ${darkMode ? "box-shadow-dark" : "box-shadow"} px-2 py-1 bg-slate-800 rounded-md`}>
              <h3 className="text-white">#{tagsArray[0]}</h3>
            </div>
          }
          {
            tagsArray[1] && 
            <div className={`meta-tag ${darkMode ? "box-shadow-dark" : "box-shadow"} px-2 py-1 bg-slate-800 rounded-md`}>
              <h3 className="text-white">#{tagsArray[1]}</h3>
            </div>
          }
          {
            tagsArray[2] && 
            <div className={`meta-tag ${darkMode ? "box-shadow-dark" : "box-shadow"} px-2 py-1 bg-slate-800 rounded-md`}>
              <h3 className="text-white">#{tagsArray[2]}</h3>
            </div>
          }
          {
            tagsArray[3] && 
            <div className={`meta-tag ${darkMode ? "box-shadow-dark" : "box-shadow"} px-2 py-1 bg-slate-800 rounded-md`}>
              <h3 className="text-white">#{tagsArray[3]}</h3>
            </div>
          }
        </div>
          </>
        }
        <p className="text-[14px] text-mainText dark:text-white">
          {" "}
          Owner:{" "}
          <Link
            target="_blank"
            href={`https://www.mintbase.xyz/human/${meta?.data?.owners?.[0]?.owner}`}
            className="text-linkColor dark:text-white"
          >
            {" "}
            {meta?.data?.owners?.[0]?.owner}{" "}
          </Link>
        </p>
        <p className="text-[14px] text-mainText mb-4 dark:text-white">
          {" "}
          Contract:{" "}
          <Link
            target="_blank"
            href={`https://www.mintbase.xyz/contract/${meta?.data?.nft_metadata?.[0]?.nft_contract_id}`}
            className="text-linkColor dark:text-white"
          >
            {" "}
            {meta?.data?.nft_metadata?.[0]?.nft_contract_id}{" "}
          </Link>
        </p>
        <div className="flex gap-2 items-center">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            passHref
            href={`${constants.mintbaseBaseUrl}/meta/${slug}`}
            className="text-linkColor text-sm dark:text-white"
          >
            View on Mintbase
          </Link>
          <InlineSVG
            src="/images/link_arrow.svg"
            className="fill-current text-linkColor dark:text-white"
          />
        </div>
      </div>
      {toast && 
         <div id="toast-default" className="toast-container left-1/2 transform -translate-x-1/2 absolute ">
            <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    <span className="sr-only">Check icon</span>
                </div>
                <div className="ms-1 text-sm font-normal">Post hidden successfully!</div>
                <button type="button" onClick={handleCloseToast} className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
            {/* <div className="border-bottom-animation"></div> */}
        </div>}
    </motion.div>
    </div>
  );
};
