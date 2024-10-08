import { uploadReference } from "@mintbase-js/storage";
import { useContext, useState } from "react";
import { generateRandomId } from "./generateRandomId";
import { useReplicate } from "@/providers/replicate";
import { constants } from "@/constants";
import { NearContext, Wallet } from "@/wallet/WalletSelector";

type ReferenceObject = {
  title?: string;
  description?: string;
  media?: File | string;
};

const useMintImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { wallet, signedAccountId } = useContext(NearContext);
  const { addRequest } = useReplicate();

  const getWallet = async () => {
    try {
      // return await selector.wallet();
    } catch (error) {
      console.error("Failed to retrieve the wallet:", error);
      setLoading(false);
      throw new Error("Failed to retrieve the wallet");
    }
  };

  const getTitleAndDescription = async (photo: string) => {
    try {
      const requestPayload = {
        image: photo,
        prompt: `Describe this image, be direct and include important details. The title should be succinct and 5 words long. The description can be longer than 15 words and more descriptive.
      
      Respond in JSON {"title": "<title>", "description": "<description>"}`,
      };
      // const requestHash =
      //   "2facb4a474a0462c15041b78b1ad70952ea46b5ec6ad29583c0b29dbd4249591";
      const requestHash =
        "80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb";
      const response = await addRequest(requestPayload, requestHash);

      const res = JSON.parse(response.output.join(""));
      console.log("Replicate Response >> ", res)

      return res;
    } catch (error) {
      console.error("Failed to get title and description:", error);
      return {
        title: generateRandomId(10),
        description: generateRandomId(10),
      };
    }
  };

  const uploadReferenceObject = async (refObject: ReferenceObject) => {
    try {
      return await uploadReference(refObject);
    } catch (error) {
      console.error("Failed to upload reference:", error);
      setLoading(false);
      throw new Error("Failed to upload reference");
    }
  };

  const performTransaction = async (
    wallet: Wallet,
    metadata: any,
  ) => {
    if (!wallet) {
      throw new Error("Wallet is not defined.");
    }

    try {
      const res = await wallet.callMethod({
        contractId: constants.proxyContractAddress,
        method: 'mint',
        args: {
          metadata: JSON.stringify(metadata),
          nft_contract_id: constants.tokenContractAddress,
        },
        gas: '200000000000000',
        deposit: '10000000000000000000000'
      });
      console.log("Ress 1 >>> ", res);
      return res;
    } catch (error) {
      console.error("Failed to sign and send transaction:", error);
      // throw new Error("Failed to sign and send transaction");
    }
  };

  const reduceImageSize = (
    base64: string,
    maxSizeMB: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create an off-screen image element to load the base64 image
      const img = new Image();
      img.src = base64;

      // Define the onload handler
      img.onload = () => {
        // Get original dimensions
        const width = img.width;
        const height = img.height;

        // Calculate the size of the base64 string in bytes
        const sizeInBytes =
          base64.length * (3 / 4) -
          (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        // If the image size is under the limit, resolve with the original base64
        if (sizeInBytes <= maxSizeBytes) {
          resolve(base64);
          return;
        }

        // Calculate the scaling factor
        const scalingFactor = Math.sqrt(maxSizeBytes / sizeInBytes);
        const newWidth = Math.floor(width * scalingFactor);
        const newHeight = Math.floor(height * scalingFactor);

        // Create a canvas with the new dimensions
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to get canvas context"));
          return;
        }

        // Draw the scaled image on the canvas
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert the canvas to a base64 string
        const resizedBase64 = canvas.toDataURL();

        // Resolve with the resized base64 string
        resolve(resizedBase64);
      };

      // Define the onerror handler
      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  const mintImage = async (photoFile: File, title: string, description: string, tags: string[]) => {
    if (!wallet) {
      setError("Wallet is not initialized.");
      return;
    }
    if (!signedAccountId) {
      setError("Active account ID is not set.");
      return;
    }

    setLoading(true);

    try {
      const refObject = {
        title: title,
        description: description,
        media: photoFile,
        tags: `${tags[0] ? tags[0] : ""}, ${tags[1] ? tags[1] : ""}, ${tags[2] ? tags[2] : ""}, ${tags[3] ? tags[3] : ""}`
      };
      const uploadedData = await uploadReferenceObject(refObject);
      const metadata = { reference: uploadedData?.id, title: title, description: description };
      const res = await performTransaction(wallet, metadata);
      return res;
    } catch (error: any) {
      setError(
        error?.message || "An error occurred during the minting process."
      );
    } finally {
      setLoading(false);
    }
  };

  const mintGif = async (photoFile: File, title: string, description: string, tags: string[]) => {
    if (!wallet) {
      setError("Wallet is not initialized.");
      return;
    }
    if (!signedAccountId) {
      setError("Active account ID is not set.");
      return;
    }

    setLoading(true);

    try {
      const originalTitle = title && title.trim() && title;
      const originalDescription = description && description.trim() && description;
      const refObject = {
        title: originalTitle,
        description: originalDescription,
        media: photoFile,
        tags: `${tags[0] ? tags[0] : ""}, ${tags[1] ? tags[1] : ""}, ${tags[2] ? tags[2] : ""}, ${tags[3] ? tags[3] : ""}`
      };
      const uploadedData = await uploadReferenceObject(refObject);
      const metadata = { reference: uploadedData?.id, title: originalTitle, description: originalDescription };
      const res = await performTransaction(wallet, metadata);
      console.log("Ress 2 >>> ", res);
      return res;
    } catch (error: any) {
      setError(
        error?.message || "An error occurred during the minting process."
      );
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);  // Cast to string as `result` can be `string | ArrayBuffer`.
      reader.onerror = (error) => reject(error);
    });
  };

  return { mintImage, mintGif, fileToBase64, getTitleAndDescription, reduceImageSize, loading, error };
};

export default useMintImage;
