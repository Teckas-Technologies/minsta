import { useRef } from "react";
import { Crop } from "react-image-crop";

export const useImageCrop = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
    const getCroppedImage = (
      image: HTMLImageElement,
      crop: Crop,
      rotation: number
    ): Promise<string | undefined> => {
      const canvas = canvasRef.current;
      if (!canvas || !crop.width || !crop.height) return Promise.resolve(undefined);
  
      const ctx = canvas.getContext("2d");
      if (!ctx) return Promise.resolve(undefined);
  
      // Calculate rotated dimensions
      const radians = (rotation * Math.PI) / 180;
      const rotatedWidth = Math.abs(crop.width * Math.cos(radians)) + Math.abs(crop.height * Math.sin(radians));
      const rotatedHeight = Math.abs(crop.width * Math.sin(radians)) + Math.abs(crop.height * Math.cos(radians));
  
      canvas.width = rotatedWidth;
      canvas.height = rotatedHeight;
  
      // Translate and rotate context
      ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
      ctx.rotate(radians);
  
      // Draw the image
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
  
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        -crop.width / 2,
        -crop.height / 2,
        crop.width,
        crop.height
      );
  
      const base64Image = canvas.toDataURL("image/jpeg");
      return Promise.resolve(base64Image);
    };
  
    return { canvasRef, getCroppedImage };
  };
  