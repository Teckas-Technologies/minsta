import { useState, useRef, useImperativeHandle, useEffect } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useImageCrop } from "@/utils/useImageCrop";
import Image from "next/image";

interface Props {
    src: string;
    setUrl: (url: string) => void;
    imgCropRef: any,
    tools: { crop: boolean, rotate: boolean, effects: boolean };
    loading: boolean;
}

export const ImageCrop = ({ src, setUrl, imgCropRef, tools, loading }: Props) => {
    const [rotation, setRotation] = useState(0);
    // const [height, setHeight] = useState();
    // const [width, setWidth] = useState();
    const [crop, setCrop] = useState<Crop>({
        unit: "px",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [completedCrop, setCompletedCrop] = useState<Crop>({
        unit: "px",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const imgRef = useRef<HTMLImageElement | null>(null);

    const { canvasRef, getCroppedImage } = useImageCrop();

    const onImageLoad = (e: any) => {
        // setHeight(e.currentTarget.height);
        // setWidth(e.currentTarget.width);
        setCompletedCrop({
            unit: 'px',
            x: 0,
            y: 0,
            width: e.currentTarget.height,
            height: e.currentTarget.width
        })
    }

    useImperativeHandle(imgCropRef, () => ({
        rotateRight: () => {
            let newRotation = rotation + 90;
            if (newRotation >= 360) {
                newRotation = 0;
            }
            setRotation(newRotation);
        },
        save: async () => {
            if (imgRef.current) {
                const croppedImageUrl = await getCroppedImage(imgRef.current, completedCrop, rotation);
                if (croppedImageUrl) {
                    setUrl(croppedImageUrl);
                    setRotation(0);
                    setCompletedCrop({
                        unit: '%',
                        x: 0,
                        y: 0,
                        width: 50,
                        height: 50
                    })
                }
            }
        }
    }));

    return (
        <div>
            {tools.crop ? (<ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                className="m-3 relative"
                aspect={1}
            >
                <Image src={src} alt="image" ref={imgRef} onLoad={onImageLoad} width={468} height={468} style={{ transform: `rotate(${rotation}deg)`, objectFit: 'cover' }} className="photo-img overflow-hidden rounded-md" />
                {loading && <div className="absolute bg-zinc-400 top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center z-50">
                        <div className="loader"></div>
                        <h2 className="title-font">Saving details</h2>
                    </div>}
            </ReactCrop>) : (
                <div className="relative">
                    <Image src={src} alt="image" ref={imgRef} onLoad={onImageLoad} width={468} height={468} style={{ transform: `rotate(${rotation}deg)`, objectFit: 'cover' }} className={`photo-img px-3 py-3 overflow-hidden  rounded-md`} />
                    {loading && <div className="absolute bg-zinc-400 top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center z-50">
                        <div className="loader"></div>
                        <h2 className="title-font">Saving details</h2>
                    </div>}
                </div>
            )}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};
