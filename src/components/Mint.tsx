import { useApp } from "@/providers/app";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDarkMode } from "@/context/DarkModeContext";

export function Mint({
  backStep,
  currentPhoto,
}: {
  backStep: () => void;
  currentPhoto: string;
}) {
  const { isLoading, mintImage } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>();
  const {mode} = useDarkMode();

  useEffect(()=> {
    if(mode === "dark") {
      setDarkMode(true);
    } else{
      setDarkMode(false);
    }
  }, [mode])

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

  const handleUpload = () => {
    if(currentPhoto) {
      mintImage(currentPhoto, title, description, tags);
      setTitle("");
      setDescription("");
      setTags([])
    }
  }

  return (
    <div className={darkMode ? "dark" : ""}>
    <main className="h-[100Vh] w-[100%] px-4 flex flex-col items-center photo-main dark:bg-slate-800">
      {isLoading ? (
        <>
          {" "}
          {/* <Spinner /> */}
          <div className="loader"></div>
          <br />
          <h1 className="text-xl sm:text-2xl font-semibold mb-4 text-mainText text-center">
            Uploading your image...
          </h1>
        </>
      ) : (
        <div className={`photo-box ${darkMode ? "box-shadow-dark" : "box-shadow"} h-auto w-full md:h-auto md:w-96 flex flex-col gap-4 scroll mb-2`}>
          <Image src={currentPhoto} alt="image" width={468} height={468} className="photo-img"/>

          <div className="tags pb-2 px-2">
            <div className="input-field">
              <input type="text" placeholder="Enter the title of the NFT..." className="border-none outline-none w-full" value={title} onChange={(e)=> {setTitle(e.target.value)}}/>
            </div>
            <div className="input-field">
              <input type="text" placeholder="Enter the description of the NFT..." className="border-none outline-none w-full" value={description} onChange={(e)=> {setDescription(e.target.value)}}/>
            </div>
            <div className="input-field">
              <input type="text" placeholder="Enter tags..." className="border-none outline-none w-full" value={tag} onChange={(e)=> {setTag(e.target.value)}}/>
              <button className="btn success-btn" onClick={addTag}>Add</button>
            </div>
            {tags.length > 0 && (
                <div className="added-tags flex gap-2 p-2 ">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="tag rounded px-2 py-1 cursor-pointer"
                      onClick={()=>removeTag(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="flex gap-4 w-full">
            <button
              className="text-secondaryBtnText w-full border border-secondaryBtnText rounded px-4 py-2"
              onClick={backStep}
            >
              Try again
            </button>
            <button
              className="gradientButton w-full text-primaryBtnText rounded px-4 py-2"
              onClick={handleUpload}
              // disabled={inputOpen ? true : false}
            >
              Upload
            </button>
          </div>
          
          {/* <div className="button-upload">
            <button
              className="gradientButton w-full text-primaryBtnText rounded px-4 py-2"
              onClick={() => mintImage(currentPhoto)}
            >
              Upload
            </button>
          </div> */}
        </div>
      )}
    </main>
    </div>
  );
}
