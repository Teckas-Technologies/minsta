import { useApp } from "@/providers/app";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { convertBase64ToFile } from "@/utils/base64ToFile";
import { Cloudinary } from '@cloudinary/url-gen';
import { Resize } from '@cloudinary/url-gen/actions/resize';
import { Effect } from '@cloudinary/url-gen/actions/effect';
import InlineSVG from "react-inlinesvg";


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
}: {
  backStep: () => void;
  currentPhoto: string;
}) {
  const { isLoading, mintImage, reduceImageSize, getTitleAndDescription } = useApp();
  const [title, setTitle] = useState("");
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
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");

  const cloudImage = cldData?.public_id && cloudinary.image(cldData?.public_id);

  if (cloudImage && filter && toggleFilter) {
    cloudImage.effect(`e_art:${filter}`)
  }

  const src = cloudImage?.toURL() || currentPhoto;

  console.log("SRC", src)

  useEffect(() => {
    if (mode === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [mode])

  // useEffect(() => {
  //   const generate = async (currentPhoto: string) => {
  //     setGenerating(true);
  //     const replicatePhoto = await reduceImageSize(currentPhoto, 10);
  //     const titleAndDescription = await getTitleAndDescription(replicatePhoto);
  //     setTitle(titleAndDescription?.title)
  //     setDescription(titleAndDescription?.description)
  //     setGenerating(false);
  //   }
  //   if (currentPhoto) {
  //     generate(currentPhoto);
  //   }
  // }, [currentPhoto])

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
      console.log("res >>> ", response)
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

  console.log("Current Photo >> ", currentPhoto)

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

  const handleUpload = async () => {
    setPreview(false);
    if (src) {
      let photoFile;
      if (isBase64(src)) {
        photoFile = convertBase64ToFile(src);
      } else {
        photoFile = await urlToFile(src, 'image/jpeg', 'image/jpeg');
      }
      mintImage(photoFile, title, description, tags);
      setTitle("");
      setDescription("");
      setTags([])
    }
  }

  const handleFilterClick = (selectedFilter: string) => {
    if (filter === selectedFilter && toggleFilter) {
      setToggleFilter(false);
      setFilter(null);
    } else {
      setToggleFilter(true);
      setFilter(selectedFilter);
    }
  };

  const generate = async () => {
    if (currentPhoto) {
      setGenerating(true);
      const replicatePhoto = await reduceImageSize(currentPhoto, 10);
      const titleAndDescription = await getTitleAndDescription(replicatePhoto);
      setTitle(titleAndDescription?.title);
      setDescription(titleAndDescription?.description);
      setGenerating(false);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const openPreview = ()=>{
    if(!title && !description) {
      setHandleToast("Title & Description is required!", true)
    } else if(!title){
      setHandleToast("Title is required!", true)
    } else if(!description) {
      setHandleToast("Description is required!", true)
    } else {
      setPreview(true)
    }
  }

  useEffect(()=> {
    if(toast) {
        setTimeout(()=> {
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
          {!preview && <div className={`photo-box ${darkMode ? "box-shadow-dark" : "box-shadow"} h-auto w-full md:h-auto md:w-96 flex flex-col gap-4 mb-2`}>
            <div className="scroll-div h-auto">
              <Image src={src} alt="image" width={468} height={468} className="photo-img" />
              <h2 className="title-font text-lg text-center dark:text-white mt-2 mb-1">Effects</h2>
              <div className={`photo-box ${darkMode ? "box-shadow-dark" : "box-shadow"} flex gap-2 overflow-x-scroll w-full h-[9.5rem] mb-2 p-2 mx-1`}>
                {ART_FILTERS.map((art: any, i: any) => (
                  <div key={i} className={`art-box ${darkMode ? "box-shadow-dark" : "box-shadow"} w-24 h-full flex flex-col p-2 items-center rounded-md`} onClick={() => handleFilterClick(art)}>
                    <div className="im relative flex justify-center w-24 h-[80%]">
                      <img src={cloudinary.image('minsta thumb/ibshxb1i1c6qte2boxey').resize(Resize.fill().width(200).height(200)).effect(Effect.artisticFilter(art)).toURL()} alt="" className="w-[80%] h-full rounded-md object-cover" />
                    </div>
                    <div className="text w-24 h-[20%] flex justify-center items-center">
                      <h4 className="dark:text-white text-center">{art}</h4>
                    </div>
                  </div>
                ))}
              </div>

              <div className="tags pb-2 pt-2 px-2">
                {!generating ? <>
                  <div className="generate-btn w-full flex pb-4 justify-center">
                    <button className="btn success-btn flex items-center gap-2" onClick={generate}>
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
                  </div></> : <div className="flex flex-col items-center">
                  <div className="loader"></div>
                  <h2 className="dark:text-white py-2">Generating Title & Description...</h2>
                </div>}
                <div className="input-field">
                  <input type="text" placeholder="Enter tags..." className="border-none outline-none w-full" value={tag} onKeyDown={handleKeyDown} onChange={(e) => { setTag(e.target.value) }} />
                  <button className="btn success-btn" onClick={addTag}>Add</button>
                </div>
                {tags.length > 0 && (
                  <div className="added-tags flex gap-2 px-2 py-1 ">
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
              <button className={`${!title || !description || !currentPhoto ? 'cursor-not-allowed' : 'cursor-pointer'} gradientButton w-full text-primaryBtnText rounded px-4 py-2`} onClick={handleUpload} disabled={!title || !description || !currentPhoto}>Upload</button>
            </div>
          </div>
        </div>}
        {toast && 
         <div id="toast-default" className="toast-container mt-6 md:top-14 top-14 left-1/2 transform -translate-x-1/2 fixed ">
            <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
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
