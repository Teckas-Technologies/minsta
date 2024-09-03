"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { constants } from "@/constants";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUrl";
import InlineSVG from "react-inlinesvg";
import { useFetchSocialMedias } from "@/hooks/db/SocialMediaHook";
import { useSaveHidePost } from "@/hooks/db/HidePostHook";
import { BlockUserType, HidePost } from "@/data/types";
import { useSaveBlockUser } from "@/hooks/db/BlockUserHook";
import { NearContext } from "@/wallet/WalletSelector";
import useLongPress from "@/hooks/useLongPress";
import { graphQLService } from "@/data/graphqlService";
import { FETCH_META } from "@/data/queries/meta.graphql";
import { useRouter } from "next/navigation";
import useMints from "@/utils/useNftDrops";

const ImageThumb = ({ token, index, grid, dark, setToast, hiddenPage, profilePage }: any) => {
  const imageUrl = token?.media;
  const [error, setError] = useState(false);
  const { push } = useRouter();
  const { wallet, signedAccountId } = useContext(NearContext);
  const [shareModal, setShareModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [mobDeleteModal, setMobDeleteModal] = useState(false);
  const toggleShareRef = useRef<HTMLDivElement | null>(null);
  const toggleActionModelRef = useRef<HTMLDivElement | null>(null);
  const { socialMedias } = useFetchSocialMedias();
  const { saveHidePost } = useSaveHidePost();
  const { saveBlockUser } = useSaveBlockUser();
  const [actionModel, setActionModel] = useState(false);

  const [showTooltip, setShowTooltip] = useState({ share: false, hide: false, delete: false });

  const toggleTooltip = (tooltip: any, state: any) => {
    setShowTooltip((prevState) => ({ ...prevState, [tooltip]: state }));
  };

  let enabledMedia = socialMedias?.filter((media) => media.enabled === true);

  const handleError = () => {
    setError(true);
  };

  const toggleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareModal(!shareModal);
  }

  const handleImageClick = () => {
    window.location.href = `meta/${token?.metadata_id}`;
    // window.open(`meta/${token?.metadata_id}`, '_blank', 'noopener noreferrer');
  };

  const handleActionModel = () => {
    setActionModel(true);
  };

  const handleRightClick = (e: any) => {
    e.preventDefault();
    window.open(`meta/${token?.metadata_id}`, '_blank', 'noopener noreferrer');
  };

  // const openMedia = (name: string, message:string, e:any) => {
  //   e.preventDefault();
  //   if(name === "twitter"){
  //     window.open(
  //       `https://twitter.com/intent/tweet?url=%0aCheck%20out%20mine%3A%20${
  //         window.location.origin
  //       }/meta/${decodeURIComponent(
  //         token?.metadata_id
  //       )}%2F&via=mintbase&text=${message}`,
  //       "_blank"
  //     );
  //   }
  // }

  const openMedia = (name: string, message: string, e: any) => {
    e.preventDefault();
    const url = `${window.location.origin}/meta/${decodeURIComponent(token?.metadata_id)}`;
    let shareUrl = '';

    switch (name) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=%20%0A%0A${url}%2F&via=mintbase&text=${message}`;
        break;
      case 'telegram':
        shareUrl = `https://telegram.me/share/url?text=${message}&url=${url}%0A%0A`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}%0A&t=${message}%0A`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${message}%0A%0A${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toggleActionModelRef.current && !toggleActionModelRef.current.contains(event.target as Node)) {
        setActionModel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleActionModelRef]);

  const handleHidePost = async (tokenId: any, unhide: boolean, e: any) => {
    const data: HidePost & { unhide?: boolean } = {
      accountId: signedAccountId?.toString() || "",
      hiddedTokenIds: [
        {
          id: tokenId
        }
      ],
      unhide
    }
    await saveHidePost(data).then(() => {
      if (unhide) {
        setToast("Moment Unhidden Successfully!", true);
      } else {
        setToast("Moment Hidden Successfully!", true);
      }
    })
  }

  const handleDeleteUser = async (token: any, e: any) => {
    const data: BlockUserType = {
      accountId: signedAccountId?.toString() || "",
      blockedUsers: [
        {
          blockedUserId: token?.owner,
        }
      ]
    }
    await saveBlockUser(data).then((res) => {
      if (res?.status == 200) {
        setDeleteModal(false);
        setToast("User Blocked Successfully!", true);
      }
    });
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState("");

  const getData = async () => {
    const posts = await graphQLService({
      query: FETCH_META,
      variables: { metadataId: token?.metadata_id },
      network: constants.network as "testnet" | "mainnet",
    });
    const title = posts?.data?.nft_metadata?.[0]?.title
    const description = posts?.data?.nft_metadata?.[0]?.description
    const account = posts?.data?.owners?.[0]?.owner;
    setTitle(title);
    setDescription(description);
    setAccountId(account);
    return;
  }

  const handleOnClick = () => {
    if (grid !== 1) {
      handleActionModel();
    } else {
      handleImageClick();
    }
  }

  const [model, setModel] = useState(false);
  const { action, handlers } = useLongPress({ onClick: handleOnClick });

  useEffect(() => {
    if (action === "longpress") {
      getData();
      setModel(true);
    }
  }, [action]);
  const { mintNFT } = useMints();

  const nftDrops = async (media: string, title: string, description: string) => {
    await mintNFT(media, title, description)
  }

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

  if (imageUrl) {
    const finalUrl = getImageUrl(imageUrl);

    return (
      <>
        <div className={`${dark ? "image-holder-dark" : "image-holder"} p-2 md:pb-11 pb-2 rounded-md aspect-square sm:w-[18rem] md:w-[18rem] md:h-[18rem] xl:w-[18rem] xl:h-[18rem] relative`}>
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
            onContextMenu={handleRightClick}
            // onClick={grid !== 1 ? handleActionModel : handleImageClick}
            {...handlers}
          />
          <div className="nft-card-details md:mt-2 mt-2">
            <button className={`bg-yellow-400 active:bg-yellow-500 px-3 py-1 rounded-3xl flex items-center gap-1 ${(grid === 2 || grid === 3) && "px-1" }`} onClick={()=> nftDrops(token.media, token.title, token.description)}>
              <InlineSVG
                src="/images/collections.svg"
                className={`fill-current h-4 w-4  md:text-md text-sm ${(grid === 3) && "text-xs w-3 h-3" }`}
              />
              <h3 className={`md:text-md text-sm ${(grid === 3) && "text-xs" }`}>Collect</h3>
            </button>
          </div>
          {
            actionModel && <div className="absolute top-2 left-2 bottom-2 right-2 bg-sky-100 rounded-md flex flex-col gap-2 items-center justify-center" ref={toggleActionModelRef}>
              <div className={`${profilePage ? "flex" : "flex-col flex"} actions gap-2`}>
                <div className="action-row1 flex gap-2">
                  <button
                    className={`top-4 right-4 bg-sky-500 text-white rounded p-1 text-xs ${grid === 2 ? "px-2 py-2" : "px-1 py-1"}`}
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
                  <button
                    className={`${profilePage ? "hidden" : ""} top-4 left-4 bg-slate-500 text-white rounded p-1 text-xs ${grid === 2 ? "px-2 py-2" : "px-1 py-1"}`}
                    onMouseEnter={() => toggleTooltip('hide', true)}
                    onMouseLeave={() => toggleTooltip('hide', false)}
                    onClick={(e) => { handleHidePost(token?.id, hiddenPage, e) }}
                  >
                    {!hiddenPage ?
                      <InlineSVG
                        src="/images/eye_hide.svg"
                        className="fill-current"
                        color="#fff"
                      /> :
                      <InlineSVG
                        src="/images/eye.svg"
                        className="fill-current"
                        color="#fff"
                      />}
                  </button>
                </div>
                <div className={`action-row2 flex gap-2`}>
                  <button
                    className={`${hiddenPage || profilePage ? "hidden" : ""} top-4 left-14 bg-red-500 text-white rounded p-1 text-xs ${grid === 2 ? "px-2 py-2" : "px-1 py-1"} `}
                    onMouseEnter={() => toggleTooltip('delete', true)}
                    onMouseLeave={() => toggleTooltip('delete', false)}
                    onClick={() => { setMobDeleteModal(true) }}
                  >
                    <InlineSVG
                      src="/images/trash.svg"
                      className="fill-current"
                      color="#fff"
                    />
                  </button>
                  <button
                    className={`${hiddenPage ? "hidden" : ""} top-4 left-14 bg-slate-700 text-white rounded p-1 text-xs ${grid === 2 ? "px-2 py-2" : "px-1 py-1"}`}
                    onClick={handleImageClick}
                  >
                    <InlineSVG
                      src="/images/eye.svg"
                      className="fill-current"
                      color="#fff"
                    />
                  </button>
                </div>
              </div>
              <div className="close-actions">
                <button
                  className={`top-4 left-14 bg-neutral-500 text-white rounded-full p-1 text-xs ${grid === 2 ? "px-2 py-2" : "px-1 py-1"}`}
                  onClick={() => setActionModel(false)}
                >
                  <InlineSVG
                    src="/images/close.svg"
                    className="fill-current"
                    color="#fff"
                  />
                </button>
              </div>
            </div>
          }
          {grid === 1 &&
            <button
              className="absolute top-4 right-4 bg-sky-500 text-white rounded p-1 text-xs px-2 py-1.5"
              onMouseEnter={() => toggleTooltip('share', true)}
              onMouseLeave={() => toggleTooltip('share', false)}
              onClick={toggleShare}
            // ref={toggleShareRef}
            >
              <InlineSVG
                src="/images/share.svg"
                className="fill-current"
                color="#fff"
              />
            </button>
          }

          {showTooltip.share && !shareModal && <div className="tooltip absolute top-[-1.8rem] right-1 bg-white px-2 py-1 rounded-md box-shadow">Share</div>}
          {shareModal &&
            <div className={`absolute top-[-2rem] w-full flex justify-end ${grid === 3 ? 'pr-0' : 'pr-4'}`} ref={toggleShareRef}>
              {enabledMedia ?
                <div className="share-apps flex items-center">
                  {enabledMedia?.map((media, i) => (
                    <div key={i} className={`share-app cursor-pointer ${grid === 3 ? "px-1" : "px-2"} py-1 mx-1`} onClick={(e) => openMedia(media.name, media.message, e)}>
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
          {
            signedAccountId && !profilePage && grid === 1 &&
            <button
              className="absolute top-4 left-4 bg-slate-500 text-white rounded p-1 text-xs px-2 py-2"
              onMouseEnter={() => toggleTooltip('hide', true)}
              onMouseLeave={() => toggleTooltip('hide', false)}
              onClick={(e) => { handleHidePost(token?.id, hiddenPage, e) }}
            >
              {!hiddenPage ?
                <InlineSVG
                  src="/images/eye_hide.svg"
                  className="fill-current"
                  color="#fff"
                /> :
                <InlineSVG
                  src="/images/eye.svg"
                  className="fill-current"
                  color="#fff"
                />}
            </button>
          }
          {showTooltip.hide && <div className="tooltip absolute top-[-1.8rem] left-2 bg-white px-2 py-1 rounded-md box-shadow">{hiddenPage ? "Unhide" : "Hide"}</div>}
          {!hiddenPage && !profilePage && signedAccountId && grid === 1 &&
            <div>
              <button
                className="absolute top-4 left-14 bg-red-500 text-white rounded p-1 text-xs px-2 py-2"
                onMouseEnter={() => toggleTooltip('delete', true)}
                onMouseLeave={() => toggleTooltip('delete', false)}
                onClick={() => setDeleteModal(!deleteModal)}
              >
                <InlineSVG
                  src="/images/trash.svg"
                  className="fill-current"
                  color="#fff"
                />
              </button>
              {showTooltip.delete && <div className="tooltip absolute top-[-1.8rem] left-10 bg-white px-2 py-1 rounded-md box-shadow">Delete</div>}
              {deleteModal &&
                <div className="absolute top-0 left-0 bottom-0 right-0 rounded-md bg-sky-50 w-full flex justify-center items-center px-2">
                  <div className="delete-content flex flex-col items-center gap-3 rounded-md px-2 py-2 bg-white box-shadow">
                    <h3 className="text-center">Are you sure want to delete the all moments from this user?</h3>
                    <div className="delete-btns flex items-center justify-center gap-2">
                      <button className="btn cancel-btn" onClick={() => setDeleteModal(false)}>Cancel</button>
                      <button className="btn delete-btn" onClick={(e) => handleDeleteUser(token, e)}>Delete</button>
                    </div>
                  </div>
                </div>
              }
            </div>}
          {/* </Link> */}
          {mobDeleteModal && <div>
            <div className="fixed top-0 left-0 bottom-0 right-0 rounded-md bg-opacity-0 z-50 bg-sky-50 w-full flex justify-center items-center px-2 mt-[5rem]">
              <div className="delete-content flex flex-col items-center block opacity-100 gap-3 rounded-md px-3 py-4 mx-5 bg-white box-shadow">
                <h3 className="text-center">Are you sure want to delete the all moments from this user?</h3>
                <div className="delete-btns flex items-center justify-center gap-2">
                  <button className="btn cancel-btn" onClick={() => { setMobDeleteModal(false); setActionModel(false) }}>Cancel</button>
                  <button className="btn delete-btn" onClick={(e) => handleDeleteUser(token, e)}>Delete</button>
                </div>
              </div>
            </div>
          </div>}
        </div>

        {model && <div className="fixed model-moment top-0 bottom-0 right-0 left-0 bg-sky-50 dark:bg-slate-800 flex items-center justify-center z-5">
          <div className="model-box bg-white w-[22rem] box-shadow rounded-md mx-4 p-3">
            <div className="image rounded-md mb-3">
              <Image
                key={token?.metadata_id}
                src={`https://image-cache-service-z3w7d7dnea-ew.a.run.app/thumbnail?url=${finalUrl}`}
                alt={`Token ${index}`}
                className="object-cover cursor-pointer h-[20rem] w-[20rem] md:max-w-[20rem] image rounded-md"
                width={320}
                height={320}
                quality={70}
                priority={index < 5}
                onError={handleError}
                placeholder="empty"
                unoptimized
              />
            </div>
            {accountId && <div className="account-modal mb-3">
              <div className="acc-model bg-slate-800 p-3 flex rounded-full items-center justify-center gap-2 cursor-pointer" onClick={() => push(`/profile/?accountId=${accountId}`)}>
                <InlineSVG
                  src="/images/profile.svg"
                  className="fill-current h-5 w-5 text-white"
                />
                <div className="owner-name max-w-[15rem] overflow-hidden md:max-w-[15rem] md:overflow-hidden">
                  <h2 className="text-white overflow-hidden text-ellipsis whitespace-nowrap">{accountId}</h2>
                </div>
              </div>
            </div>}
            {title && <h2><span className="title-font">Title : </span>{title}</h2>}
            {description && <h2><span className="title-font">Description : </span>{description}</h2>}
            <div className="close w-full flex justify-center mt-4">
              <div className="close-icon bg-red-500 p-2 rounded-full cursor-pointer" onClick={() => setModel(false)}>
                <InlineSVG
                  src="/images/close.svg"
                  className="fill-current text-white"
                />
              </div>
            </div>
          </div>
        </div>}

      </>
    );
  } else {
    return null;
  }
};

export const MemoizedImageThumb = React.memo(ImageThumb);
