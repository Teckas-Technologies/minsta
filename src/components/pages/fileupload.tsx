import { useDarkMode } from "@/context/DarkModeContext";
import { CreditsType, HashesType } from "@/data/types";
import { useFetchCredits, useSaveCredits } from "@/hooks/db/CreditHook";
import { convertBase64ToFile } from "@/utils/base64ToFile";
import useMintImage from "@/utils/useMint";
import { useMbWallet } from "@mintbase-js/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";
import { getTxnStatus, getBalance } from '@mintbase-js/rpc';
import useTransfer from "@/utils/useTransfer";
import { useFetchHashes, useSaveHashes } from "@/hooks/db/HashHook";

export default function FileUploadPage() {
  const fileInputRef = useRef<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { push } = useRouter();
  const { connect, selector, activeAccountId, isConnected } = useMbWallet();
  const [darkMode, setDarkMode] = useState<boolean>();
  const { mode } = useDarkMode();
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [convertedPhotoFile, setconvertedPhotoFile] = useState<File>();
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const { fetchCredits } = useFetchCredits();
  const { saveCredits } = useSaveCredits();
  const [credits, setCredits] = useState<number | null>();
  const [buyCredit, setBuyCredit] = useState(false);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    if (mode === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [mode])

  useEffect(() => {
    if (accountId) {
      const fetchDbCredit = async () => {
        try {
          let credit = await fetchCredits(accountId);
          console.log("credits coming >> ", credit);

          if (credit === null) {
            const data: CreditsType = {
              accountId: accountId,
              credit: 3
            };
            await saveCredits(data);

            credit = await fetchCredits(accountId);
          }

          setCredits(credit ? credit.credit : 0);
        } catch (error) {
          console.error("Error fetching or saving credits:", error);
          setCredits(0);
        }
      };

      fetchDbCredit();
    }
  }, [accountId, title, description, file]);

  console.log("credits setted >> ", credits);

  const [balance, setBalance] = useState<number>(0);

  const { transfer, signIn, signOut, isSignedIn,getAccount, initializeWalletSelector, getTransactionResult } = useTransfer();
  const { fetchHashes } = useFetchHashes()
  const { saveHashes } = useSaveHashes()

  const value = isSignedIn();
  console.log("Connected >> ", value)
  console.log("Account >> ", accountId)

  useEffect(()=>{
    const account = getAccount()
    if(account){
      setAccountId(account)
    }
  },[file])

  useEffect(() => {
    const getresult = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams) {
        const hash = searchParams.get('transactionHashes');
        // const account = searchParams.get('account_id');
        if (hash) {
          const res = await fetchHashes(hash as string);
          console.log("Hash Res >> ", res.exist)
          if(res?.exist) {
            console.log("Not added credits")
            return;
          }
          try {
            const result = await getTransactionResult(hash);
            console.log("Result >> ", result)
            if (result.success) {
              console.log("Step 1")
              if(accountId) {
                console.log("Step 2")
                setAccountId(accountId)
                const data: CreditsType = {
                  accountId: accountId,
                  credit: 5
                };
                await saveCredits(data);

                let credit = await fetchCredits(accountId);
                setCredits(credit?.credit);
                const hashData: HashesType = {
                  accountId: accountId,
                  amount: result.amount,
                  hash: hash
                }
                await saveHashes(hashData)
              }
            }
          } catch (err) {
            console.log("error >> ", err)
          }
        }
      }
    }
    getresult();
  }, [accountId])

  const handleSignIn = async () => {
    const accountId = await signIn();
    setAccountId(accountId as string)
  }

  useEffect(()=>{
    initializeWalletSelector();
  },[])

  const handleSignOut = async () => {
    await signOut();
    setAccountId("")
  }

  // useEffect(()=>{
  //   if(activeAccountId){
  //     const balance = async ()=>{
  //       const res = await getBalance(activeAccountId);
  //       setBalance(res)
  //     }
  //     balance();
  //   }
  // }, [])

  const handleTransfer = async () => {
    const value = isSignedIn();
    console.log("Value >> ", value)
    try {
      if (!value) {
        handleSignIn();
        await transfer("sweety08.testnet")
      } else {
        await transfer("sweety08.testnet")
      }
    } catch (error) {
      console.error("Failed to sign and send transaction:", error);
    }
  }

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

  const { mintGif, fileToBase64, reduceImageSize, getTitleAndDescription, loading, error } = useMintImage();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);
      const fileURL = URL.createObjectURL(file);
      setFilePreview(fileURL);
      // setGenerating(true)
      const photo = await fileToBase64(file);
      const photoFile = convertBase64ToFile(photo);
      setconvertedPhotoFile(photoFile)
    } else {
      setHandleToast("Only png, jpg, and jpeg files are allowed.", true)
    }
  };

  const generation = async () => {
    if (!file) {
      setHandleToast("No file chosen!", true);
      return;
    }
    if (credits === null || credits === undefined || credits <= 0) {
      setBuyCredit(true);
      return;
    }
    // if (!accountId) {
    //   setHandleToast("No active account ID!", true);
    //   return;
    // }
    try {
      await generate();
      const data: CreditsType = {
        accountId: accountId,
        credit: credits - 1
      };
      await saveCredits(data);
      setCredits(credits - 1);
    } catch (error) {
      console.error("Error generating title and description:", error);
      setHandleToast("Failed to generate title and description. Please try again.", true);
    }
  };


  const generate = async () => {
    if (file) {
      setGenerating(true);
      const photo = await fileToBase64(file);
      const replicatePhoto = await reduceImageSize(photo, 10);
      const titleAndDescription = await getTitleAndDescription(replicatePhoto);
      setTitle(titleAndDescription?.title);
      setDescription(titleAndDescription?.description);
      setGenerating(false);
    } else {
      setHandleToast("No file chosen!", true)
    }
  }

  const handleUpload = () => {
    if (!convertedPhotoFile) {
      setHandleToast("No file chosen!", true)
      return;
    }
    if (isConnected) {
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const openPreview = () => {
    if (!title && !description && !file) {
      setHandleToast("Missing required fields!", true)
    } else if (!title && !description) {
      setHandleToast("Title & Description is required!", true)
    } else if (!file) {
      setHandleToast("File is required!", true)
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

  return (
    <div className={darkMode ? "dark" : ""}>
      <main className="h-[100vh] w-[100%] px-4 relative flex flex-col items-center photo-main bg-white dark:bg-slate-800">
        <div className={`photo-box relative ${darkMode ? "box-shadow-dark" : "box-shadow"} h-auto w-full md:h-auto md:w-96 flex flex-col gap-4 scroll mb-2`}>
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
                  <div className="generate-btn w-full flex pb-4 justify-center">
                    <button className="btn success-btn flex items-center gap-2" onClick={generation}>
                      <InlineSVG
                        src="/images/robot.svg"
                        className="fill-current dark:text-white"
                      /> Generate AI Title & Description
                    </button>
                  </div>
                  <div className="input-field">
                    <input type="text" placeholder="Enter the title of the NFT..." className="border-none outline-none w-full" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                  </div>
                  <div className="input-field">
                    <input type="text" placeholder="Enter the description of the NFT..." className="border-none outline-none w-full" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                  </div></> : <div className="generating flex flex-col items-center gap-2 pb-2">
                  <div className="loader"></div>
                  <h2 className="dark:text-white">Generating Title & Description...</h2>
                </div>}
                <div className="input-field">
                  <input type="text" placeholder="Enter tags..." className="border-none outline-none w-full" value={tag} onKeyDown={handleKeyDown} onChange={(e) => { setTag(e.target.value) }} />
                  <button className="btn success-btn" onClick={addTag}>Add</button>
                </div>
                {tags.length > 0 && (
                  <div className="added-tags flex gap-2 p-2 ">
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

              <div className="flex gap-4 px-1 pb-1 w-full">
                <button
                  className="text-secondaryBtnText w-full border border-secondaryBtnText rounded px-4 py-2 dark:text-white dark:border-white"
                  onClick={() => push("/")}
                >
                  Back
                </button>
                <button
                  className="gradientButton w-full text-primaryBtnText rounded px-4 py-2"
                  onClick={openPreview}
                // disabled={inputOpen ? true : false}
                >
                  Preview
                </button>
              </div>
            </>
          }
          {buyCredit && <div className="absolute bg-slate-800 dark:bg-white top-3 left-3 right-3 bottom-3 flex justify-center items-center rounded-md">
            <div className="buy-alert-box w-[80%] flex flex-col gap-3 h-auto bg-white dark:bg-slate-800 rounded-md py-2 px-3">
              <div className="head flex flex-col gap-2">
                <h2 className="title-font text-center dark:text-white">Insufficient Credits!</h2>
                <p className="dark:text-white text-justify">You don't have enough credits for the mind-blowing AI title and description generation.
                  Spend $0.05 to get 5 credits.</p>
              </div>
              <div className="btns-credit flex items-center justify-center gap-2">
                <button className="btn cancel-btn dark:text-white dark:border-white" onClick={() => setBuyCredit(false)}>Cancel</button>
                <button className="btn success-btn border-green-600" onClick={handleTransfer}>Spent</button>
              </div>
            </div>
          </div>}
        </div>
        {preview && <div className="preview absolute top-0 left-0 min-h-[100vh] h-[100%] right-0 bg-sky-100 dark:bg-slate-800 flex items-center justify-center pt-[15rem] pb-[10rem]">
          <div className="preview-box w-[20rem] md:w-[25rem] bg-white p-[1rem] md:px-[2.5rem] md:py-[1rem] rounded-md">
            <div className="title-font text-2xl text-center">Preview</div>
            <div className="moment w-[18rem] h-[18rem] md:w-[20rem] md:h-[20rem]">
              {filePreview ? <img src={filePreview} alt="" className="rounded-md h-full w-full" /> : ""}
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
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
            <div className="btn-groups flex gap-3 py-2">
              <button className="text-secondaryBtnText w-full border border-secondaryBtnText rounded px-4 py-2 dark:text-slate-900 dark:border-slate-800" onClick={() => setPreview(false)}>Cancel</button>
              <button className={`${!title || !description || !file ? 'cursor-not-allowed' : 'cursor-pointer'} gradientButton w-full text-primaryBtnText rounded px-4 py-2`} onClick={handleUpload} disabled={!title || !description || !file}>Upload</button>
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
  )
}