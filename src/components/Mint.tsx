import { useApp } from "@/providers/app";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { convertBase64ToFile } from "@/utils/base64ToFile";
import { Cloudinary } from '@cloudinary/url-gen';
import { Resize } from '@cloudinary/url-gen/actions/resize';
import { Effect } from '@cloudinary/url-gen/actions/effect';
import InlineSVG from "react-inlinesvg";
import { CreditsTypeReq } from "@/data/types";
import { useFetchCredits, useSaveCredits } from "@/hooks/db/CreditHook";
import { NearContext } from "@/wallet/WalletSelector";
import { useRouter } from "next/navigation";
import BuyCreditButton from "./buttons/buy-credit-button";
import { calculateCredit } from "@/utils/calculateCredit";
import { ImageCrop } from "./ImageCrop";


const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "john8844"
  },
  url: {
    secure: true
  }
});

const ART_FILTERS = ["al_dente", "athena", "audrey", "aurora", "daguerre", "eucalyptus", "fes", "frost", "hairspray", "hokusai", "incognito", "linen", "peacock", "primavera", "quartz", "red_rock", "refresh", "sizzle", "sonnet", "ukulele", "zorro"]

export function Mint({
  backStep,
  currentPhoto,
  setPicture,
  txhash
}: {
  backStep: () => void;
  currentPhoto: string;
  setPicture: (e: any) => void;
  txhash: string
}) {
  const { isLoading, mintImage, reduceImageSize, getTitleAndDescription } = useApp();
  const [title, setTitle] = useState("");
  const { wallet, signedAccountId } = useContext(NearContext);
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>();
  const { mode } = useDarkMode();
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState(false);
  const [cldData, setCldData] = useState<any>();
  const [filter, setFilter] = useState<string | null>(null)
  const [toggleFilter, setToggleFilter] = useState(false);
  const [active, setActive] = useState(false);
  const [loadingEffect, setLoadingEffect] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const { fetchCredits } = useFetchCredits();
  const { saveCredits } = useSaveCredits();
  const [credits, setCredits] = useState<number | null>();
  const [buyCredit, setBuyCredit] = useState(false);
  const { push } = useRouter();
  const [titleLock, setTitleLock] = useState(false);
  const [desLock, setDesLock] = useState(false);
  const [balance, setBalance] = useState<any>();
  const [buyCreditModel, setBuyCreditModel] = useState(false);
  const [amount, setAmount] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const imgCropRef = useRef<{ rotateRight: () => void; save: () => void }>(null);
  const [croppedUrl, setcroppedUrl] = useState("");
  const [tools, setTools] = useState({
    crop: false,
    rotate: false,
    effects: false
  })
  const [src, setSrc] = useState<string>(currentPhoto);

  const cloudImage = cldData?.public_id && cloudinary.image(cldData?.public_id);

  if (cloudImage && filter && toggleFilter) {
    cloudImage.effect(`e_art:${filter}`)
  }

  // const src = cloudImage?.toURL() || currentPhoto;
  useEffect(() => {
    if (cloudImage) {
      const newSrc = cloudImage?.toURL();
      setSrc(newSrc);
    }
  }, [cloudImage]);

  useEffect(() => {
    if (mode === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [mode])

  useEffect(() => {
    if (signedAccountId) {
      const fetchDbCredit = async () => {
        try {
          let credit = await fetchCredits(signedAccountId);

          if (credit === null) {
            const data: CreditsTypeReq = {
              accountId: signedAccountId,
              credit: 3,
              detuct: false
            };
            await saveCredits(data);

            credit = await fetchCredits(signedAccountId);
          }

          setCredits(credit ? credit.credit : 0);
        } catch (error) {
          console.error("Error fetching or saving credits:", error);
          setCredits(0);
        }
      };

      fetchDbCredit();
    }
  }, [signedAccountId, title, description]);

  const handleSignIn = async () => {
    return wallet?.signIn();
  };

  useEffect(() => {
    if (!currentPhoto) return;
    (async function run() {
      const response = await fetch('/api/cloudinary', {
        method: 'POST',
        body: JSON.stringify({
          image: currentPhoto
        })
      }).then(r => r.json())
      setCldData(response);
    })();
  }, [])


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

  function isBase64(str: string) {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  async function urlToFile(url: string, filename: string, mimeType: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  useEffect(() => {
    const addCroppedImgToEffects = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/cloudinary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: croppedUrl }),
        });
        const data = await response.json();
        setCldData(data);
        setTools({
          crop: false,
          rotate: false,
          effects: false
        })
        setLoading(false)
      } catch (error) {
        console.error("Error uploading cropped photo:", error);
      }
    };

    if (croppedUrl) {
      addCroppedImgToEffects();
    }
  }, [croppedUrl]);

  const handleUpload = async () => {
    setPreview(false);
    if (src) {
      let photoFile;
      if (isBase64(src)) {
        photoFile = convertBase64ToFile(src);
      } else {
        photoFile = await urlToFile(src, 'image/jpeg', 'image/jpeg');
      }
      const res = await mintImage(photoFile, title, description, tags);
      // if(res){
      //   // setUploading(false);
      //   setHandleToast("Minted Successfully!", true);
      //   setTimeout(()=>push("/"), 5000)
      // } else if(!res) {
      //   // setUploading(false);
      //   setHandleToast("Minting Failed!", true);
      //   setTimeout(()=>push("/"), 5000)
      // }
      setTitle("");
      setDescription("");
      setTags([])
    }
  }

  const handleFilterClick = (selectedFilter: string) => {
    setLoadingEffect(true);
    if (filter === selectedFilter && toggleFilter) {
      setToggleFilter(false);
      setFilter(null);
      setActive(false)
    } else {
      setToggleFilter(true);
      setFilter(selectedFilter);
      setActive(true)
    }
    setTimeout(() => setLoadingEffect(false), 1600)
  };

  const generation = async () => {
    if (!currentPhoto) {
      setHandleToast("No file chosen!", true);
      return;
    }
    if (credits === null || credits === undefined || credits <= 0) {
      setBuyCredit(true);
      return;
    }
    if (!signedAccountId) {
      handleSignIn();
      return;
    }
    if (titleLock && desLock) {
      setHandleToast("Locked title & description!", true);
      return;
    }
    try {
      await generate();
      const data: CreditsTypeReq = {
        accountId: signedAccountId,
        credit: credits - 1,
        detuct: true
      };
      await saveCredits(data);
      setCredits(credits - 1);
    } catch (error) {
      console.error("Error generating title and description:", error);
      setHandleToast("Failed to generate title and description. Please try again.", true);
    }
  };

  const generate = async () => {
    if (currentPhoto) {
      setGenerating(true);
      const replicatePhoto = await reduceImageSize(currentPhoto, 10);
      const titleAndDescription = await getTitleAndDescription(replicatePhoto);
      const trimmedTitle = titleAndDescription?.title?.slice(0, 40);
      const trimmedDescription = titleAndDescription?.description?.slice(0, 100);
      if (!titleLock) {
        setTitle(trimmedTitle);
      }
      if (!desLock) {
        setDescription(trimmedDescription);
      }
      setGenerating(false);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const openPreview = () => {
    if (!title && !description) {
      setHandleToast("Title & Description is required!", true)
    } else if (!title) {
      setHandleToast("Title is required!", true)
    } else if (!description) {
      setHandleToast("Description is required!", true)
    } else {
      setPreview(true)
    }
  }

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
        setToastText("");
      }, 5000)
    }
  }, [toast]);

  const setHandleToast = (message: string, open: boolean) => {
    setToast(open);
    setToastText(message);
  }

  const eraseAll = () => {
    // setTitle("");
    // setDescription("");
    // setPicture(null);
    setPreview(false);
  }

  const handleTransfer = () => {
    try {
      if (!signedAccountId) {
        handleSignIn();
      } else if (balance < 0.05) {
        setHandleToast("Insufficient Balance!", true);
      } else {
        setBuyCreditModel(true);
      }
    } catch (error) {
      console.error("Failed to sign and send transaction:", error);
    }
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <main className="h-[100Vh] relative w-[100%] px-4 flex flex-col items-center scroll photo-main dark:bg-slate-800">
        {isLoading ? (
          <>
            {" "}
            {/* <Spinner /> */}

            <br />
            <div className={`photo-box ${darkMode ? "box-shadow-dark" : "box-shadow"} h-auto w-full md:h-auto md:w-96 flex flex-col items-center pt-3 gap-4 scroll mb-2`}>
              <div className="loader"></div>
              <h1 className="text-xl sm:text-2xl font-semibold mb-4 text-mainText text-center dark:text-white">
                Uploading your image...
              </h1>
            </div>
          </>
        ) : (<>
          {!preview && !buyCredit && !buyCreditModel && <div className={`photo-box ${darkMode ? "box-shadow-dark" : "box-shadow"} h-auto w-full md:h-auto md:w-96 flex flex-col gap-4 mb-2`}>
            <div className="scroll-div h-auto">
              <div className={`relative`}>
                <ImageCrop src={src} setUrl={setcroppedUrl} imgCropRef={imgCropRef} tools={tools} loading={loading} />
              </div>
              <div className="tools w-full flex justify-center pt-2">
                <div className="toolbar bg-slate-400 px-2 py-2 rounded-md flex items-center gap-2">
                  <div className={`tool bg-white rounded-md w-7 h-7 p-1 pr-1.5 flex items-center justify-center cursor-pointer ${tools.crop && "border-2 border-sky-600"}`} onClick={() => setTools({ crop: !tools.crop, rotate: false, effects: false })}>
                    <InlineSVG
                      src="/images/crop.svg"
                      className="fill-current text-mainText w-4 h-4"
                    />
                  </div>
                  <div className={`tool bg-white rounded-md w-7 h-7 p-1 pr-1.5 flex items-center justify-center active:bg-sky-100 cursor-pointer ${tools.rotate && "border-2 border-sky-600"}`} onClick={() => { setTools({ crop: false, rotate: true, effects: false }); imgCropRef.current?.rotateRight(); }}>
                    <InlineSVG
                      src="/images/rotate.svg"
                      className="fill-current text-mainText w-4 h-4"
                    />
                  </div>
                  <div className={`tool bg-white rounded-md w-7 h-7 p-1 flex items-center justify-center cursor-pointer ${tools.effects && "border-2 border-sky-600"}`} onClick={() => setTools({ crop: false, rotate: false, effects: !tools.effects })}>
                    <InlineSVG
                      src="/images/stars.svg"
                      className="fill-current text-mainText w-4 h-4"
                    />
                  </div>
                  <div className={`tool bg-white border-2 border-sky-600 rounded-md w-7 h-7 p-1 flex items-center justify-center cursor-pointer`} onClick={() => imgCropRef.current?.save()}>
                    <InlineSVG
                      src="/images/check2.svg"
                      className="fill-current text-mainText w-4 h-4"
                    />
                  </div>
                </div>
              </div>
              {tools.effects && <>
                <h2 className="title-font text-lg text-center dark:text-white mt-2 mb-1">Effects</h2>
                <div className={`photo-box ${darkMode ? "box-shadow-dark" : "box-shadow"} flex gap-2 overflow-x-scroll w-full h-[9.5rem] mb-2 p-2 mx-1`}>
                  {ART_FILTERS.map((art: any, i: any) => (
                    <div key={i} className={`art-box ${darkMode ? "box-shadow-dark" : "box-shadow"} cursor-pointer w-24 h-full flex flex-col p-2 items-center rounded-md`} onClick={() => handleFilterClick(art)}>
                      <div className="im relative flex justify-center w-24 h-[80%]">
                        <img src={cloudinary.image('minsta thumb/ibshxb1i1c6qte2boxey').resize(Resize.fill().width(200).height(200)).effect(Effect.artisticFilter(art)).toURL()} alt="" className="w-[80%] h-full rounded-md object-cover" />
                        {active && filter === art && <div className="layout absolute top-0 bottom-0 left-2 right-2 bg-slate-900 opacity-50 flex items-center justify-center rounded-md">
                          <div className="active-layout bg-slate-600 p-3 rounded-full">
                            <InlineSVG
                              src="/images/check.svg"
                              className="fill-current text-mainText w-9 h-9 dark:text-white"
                            />
                          </div>
                        </div>}
                      </div>
                      <div className="text w-24 h-[20%] flex justify-center items-center">
                        <h4 className="dark:text-white text-center">{art}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </>}

              <div className="tags pb-2 pt-2 px-2">
                <div className="generate-btn w-full flex pb-4 justify-between gap-2">
                  <button className="btn success-btn flex items-center gap-2" onClick={generation} disabled={generating}>
                    <InlineSVG
                      src="/images/robot.svg"
                      className="fill-current dark:text-white"
                    /> <h2 className="title-font text-white">Generate using AI</h2>
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="credits border-2 border-green-700 rounded-md pl-2 pr-3 py-2 flex justify-center items-center gap-2">
                      <InlineSVG
                        src="/images/fire.svg"
                        className="fill-current text-red-500 dark:text-yellow-500"
                      /> <h2 className="title-font dark:text-white">{credits}</h2>
                    </div>
                    <div className="buy-credit bg-green-700 flex justify-center items-center rounded-md gap-2 px-2 py-2 cursor-pointer" onClick={handleTransfer}>
                      <h2 className="text-white">{"Buy"}</h2>
                    </div>
                  </div>
                </div>
                {!generating ? <>
                  <div className="input-field flex items-center">
                    <input type="text" placeholder="Enter the title of the NFT..." className="border-none outline-none w-full" value={title} maxLength={40} onChange={(e) => {
                      if (e.target.value.length <= 40) {
                        setTitle(e.target.value);
                      }
                    }} />
                    <div className="lock flex items-center justify-center cursor-pointer" onClick={() => setTitleLock(!titleLock)}>
                      <InlineSVG
                        src={`${titleLock ? "/images/lock.svg" : "/images/unlock.svg"}`}
                        className="fill-current h-6 w-6 text-red-500 dark:text-white text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="input-field flex items-center">
                    <input type="text" placeholder="Enter the description of the NFT..." className="border-none outline-none w-full" value={description} maxLength={100} onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setDescription(e.target.value);
                      }
                    }} />
                    <div className="lock flex items-center justify-center cursor-pointer" onClick={() => setDesLock(!desLock)}>
                      <InlineSVG
                        src={`${desLock ? "/images/lock.svg" : "/images/unlock.svg"}`}
                        className="fill-current h-6 w-6 text-red-500 dark:text-white text-slate-800"
                      />
                    </div>
                  </div></> : <div className="flex flex-col items-center">
                  <div className="loader"></div>
                  <h2 className="dark:text-white py-2">Generating Title & Description...</h2>
                </div>}
                <div className="input-field">
                  <input type="text" placeholder="Enter tags..." className="border-none outline-none w-full" value={tag} onKeyDown={handleKeyDown} onChange={(e) => { setTag(e.target.value) }} />
                  <button className="btn success-btn" onClick={addTag}>Add</button>
                </div>
                {tags.length > 0 && (
                  <div className="added-tags flex flex-wrap gap-2 px-2 py-1 ">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="tag rounded px-2 py-1 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button
                className="text-secondaryBtnText w-full border dark:border-white border-secondaryBtnText rounded px-4 py-2 dark:text-white"
                onClick={backStep}
              >
                Try again
              </button>
              <button
                className="gradientButton w-full text-primaryBtnText rounded px-4 py-2"
                onClick={openPreview}
              // disabled={!title && !description}
              >
                Preview
              </button>
            </div>
          </div>}
          {buyCredit && <div className=" bg-slate-800 dark:bg-white md:w-[40%] p-3 flex justify-center items-center rounded-md">
            <div className="buy-alert-box w-full flex flex-col gap-3 h-auto bg-white dark:bg-slate-800 rounded-md py-2 px-3">
              <div className="head flex flex-col gap-2">
                <h2 className="title-font text-center dark:text-white">Insufficient Credits!</h2>
                <p className="dark:text-white text-justify">
                  You don&apos;t have enough credits for the mind-blowing AI title and description generation. Buy your AI credits.
                </p>
                <p className="dark:text-white text-center">
                  1 credit = 0.05 NEAR.
                </p>
              </div>
              <div className="btns-credit flex items-center justify-center gap-2">
                <button className="btn cancel-btn dark:text-white dark:border-white" onClick={() => setBuyCredit(false)}>Close</button>
              </div>
            </div>
          </div>}
          {<div className={`${buyCreditModel ? "" : "hidden"} bg-slate-800 dark:bg-white md:w-[40%] p-3 flex justify-center items-center rounded-md`}>
            <div className="buy-alert-box w-full flex flex-col gap-3 h-auto bg-white box-shadow text-center rounded-md py-2 px-3">
              <div className="head flex flex-col gap-2">
                <h2 className="title-font">Buy Credits!</h2>
                <div className={`input-box h-11 w-full rounded-md flex items-center justify-between ${darkMode ? "box-shadow" : "box-shadow"}`}>
                  {/* <input type="number" min={0.05} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} className={`bg-white px-4 py-2 flex-grow rounded-md h-11 text-sm border-none outline-none`} /> */}
                  <button
                    className="px-4 py-2 bg-slate-300 dark:bg-slate-600 dark:text-white rounded-l-md"
                    onClick={() => setAmount(prev => Math.max(0.05, parseFloat((prev - 0.05).toFixed(2))))}
                  >
                    -
                  </button>
                  <span className="bg-white px-4 py-2 flex-grow text-center text-sm">{amount.toFixed(2)}</span>
                  <button
                    className="px-4 py-2 bg-slate-300 dark:bg-slate-600 dark:text-white rounded-r-md"
                    onClick={() => setAmount(prev => parseFloat((prev + 0.05).toFixed(2)))}
                  >
                    +
                  </button>
                  <div className="box-near h-11 w-13 p-2 pr-4">
                    <img src="images/near-logo.png" className="h-full w-full" alt="" />
                  </div>
                </div>
                <div className="credit-value">
                  <h2>{!isNaN(amount) ? amount : 0} NEAR = {calculateCredit(!isNaN(amount) ? amount : 0)} Credits</h2>
                </div>
                <div className="btns flex gap-2 justify-center">
                  <button className="px-4 py-2 border border-slate-800 cursor-pointer rounded-md" onClick={() => setBuyCreditModel(false)}>Cancel</button>
                  <BuyCreditButton amount={amount} setHandleToast={setHandleToast} setCredits={setCredits} txhash={txhash} />
                </div>
              </div>
            </div>
          </div>}
        </>
        )}
        {preview && <div className="preview absolute top-0 left-0 min-h-[100vh] h-[100%] right-0 bg-sky-100 dark:bg-slate-800 flex items-center justify-center pt-[15rem] pb-[10rem]">
          <div className="preview-box w-[20rem] md:w-[25rem] bg-white p-[1rem] md:px-[2.5rem] md:py-[1rem] rounded-md">
            <div className="title-font text-2xl text-center">Preview</div>
            <div className="moment w-[18rem] h-[18rem] md:w-[20rem] md:h-[20rem]">
              <Image src={src} alt="image" width={468} height={468} className="photo-img" />
            </div>
            {title && <div className="title pt-3 pb-2">
              <h2><span className="title-font">Title :</span> {title}</h2>
            </div>}
            {description && <div className="description">
              <h2 className="text-justify line-clamp-3"><span className="title-font">Description :</span> {description}</h2>
            </div>}
            {tags.length > 0 && (
              <div className="added-tags flex flex-wrap gap-2 p-2 my-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="tag rounded px-2 py-1 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
            <div className="btn-groups flex gap-3 py-2">
              <button className="text-secondaryBtnText w-full border border-secondaryBtnText rounded px-4 py-2 dark:text-slate-900 dark:border-slate-800" onClick={eraseAll}>Cancel</button>
              <button className={`${!title || !description || !currentPhoto ? 'cursor-not-allowed' : 'cursor-pointer'} gradientButton w-full text-primaryBtnText rounded px-4 py-2`} onClick={handleUpload} disabled={!title || !description || !currentPhoto}>Upload</button>
            </div>
          </div>
        </div>}
        {toast &&
          <div id="toast-default" className="toast-container mt-6 md:top-14 top-14 left-1/2 transform -translate-x-1/2 fixed ">
            <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="sr-only">Check icon</span>
              </div>
              <div className="ms-1 text-sm font-normal">{toastText}</div>
            </div>
            <div className="border-bottom-animation"></div>
          </div>}
      </main>
    </div>
  );
}
