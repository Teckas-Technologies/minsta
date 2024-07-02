import { useApp } from "@/providers/app";
import { Spinner } from "./Spinner";
import Image from "next/image";
import { useState } from "react";

export function Mint({
  backStep,
  currentPhoto,
}: {
  backStep: () => void;
  currentPhoto: string;
}) {
  const { isLoading, mintImage } = useApp();
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

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

  return (
    <main className="h-[100Vh] w-[100%] px-4  flex flex-col items-center photo-main">
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
        <div className="photo-box h-auto w-full md:h-auto md:w-96 flex flex-col gap-4 scroll mb-2">
          <Image src={currentPhoto} alt="image" width={468} height={468} className="photo-img"/>

          <div className="tags pb-2 px-2">
            <div className="input-field">
            <input type="text" placeholder="Enter the title of the NFT..." className="border-none outline-none w-full" value={title} onChange={(e)=> {setTitle(e.target.value)}}/>
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
              onClick={() => mintImage(currentPhoto, title)}
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
  );
}
