import { Mint } from "@/components/Mint";
import { FooterButton } from "@/components/footer";
import Webcam from "react-webcam";
import { useCamera } from "@/hooks/useCamera";
import InlineSVG from "react-inlinesvg";
import { useDarkMode } from "@/context/DarkModeContext";
import { useContext, useEffect, useState } from "react";
import { NearContext } from "@/wallet/WalletSelector";
import { CreditsTypeReq, HashesType } from "@/data/types";
import { useFetchCredits, useSaveCredits } from "@/hooks/db/CreditHook";
import { useFetchHashes, useSaveHashes } from "@/hooks/db/HashHook";
import * as nearAPI from "near-api-js";
import { calculateCredit } from "@/utils/calculateCredit";

export default function CameraPage() {
  const {
    picture,
    tryAgain,
    cameraLoaded,
    toggleCamera,
    permissionGranted,
    webcamRef,
    facingMode,
    setCameraLoaded,
    setPicture,
    capture,
  } = useCamera();
  const [darkMode, setDarkMode] = useState<boolean>();
  const { mode } = useDarkMode();
  const { wallet, signedAccountId } = useContext(NearContext);
  const [txhash, setTxhash] = useState("");
  const { fetchCredits } = useFetchCredits();
  const { saveCredits } = useSaveCredits();
  const { fetchHashes } = useFetchHashes();
  const { saveHashes } = useSaveHashes();

  useEffect(() => {
    if (mode === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [mode])

  useEffect(() => {
    const getresult = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams) {
        const hash = searchParams.get('transactionHashes');
        if (hash) {
          // setTxhash(hash)
          const res = await fetchHashes(hash as string);
          if (res?.exist) {
            return;
          }
          try {
            const result = await wallet?.getTransactionResult(hash);
            if (result?.success) {
              if (result.signerId) {
                const amt = nearAPI.utils.format.formatNearAmount(result.amount);
                const resCredit = calculateCredit(parseFloat(amt));
                const data: CreditsTypeReq = {
                  accountId: result.signerId,
                  credit: resCredit,
                  detuct: false
                };
                await saveCredits(data);

                let credit = await fetchCredits(result.signerId);
                // setCredits(credit?.credit as number);
                const hashData: HashesType = {
                  accountId: result.signerId,
                  amount: parseFloat(amt),
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
  }, [txhash, signedAccountId])

  if (picture) {
    return <Mint currentPhoto={picture} backStep={tryAgain} setPicture={setPicture} txhash={txhash} />;
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <main className="h-camera overflow-hidden	 w-screen flex items-center justify-center bg-white dark:bg-slate-800 min-h-[99vh]">
        <div className="h-1/2 relative m-camera">
          {!!cameraLoaded && (
            <h2 className="align-center flex font-semibold mb-4 text-mainText text-center">
              <span className="w-full dark:text-white">Let&apos;s Take a Picture </span>
              <div className="h-8 w-8 right-0 absolute" onClick={toggleCamera}>
                <InlineSVG
                  src="/images/cameraswitch.svg"
                  className="fill-current text-mainText dark:text-white"
                />
              </div>
            </h2>
          )}
          {/* 
            {pageLoaded && !permissionGranted && (
            <button onClick={requestCameraPermission}>Try Again</button>
          )} */}

          {permissionGranted && !picture && (
            <Webcam
              ref={webcamRef}
              className="flex h-full w-full "
              screenshotFormat="image/webp"
              forceScreenshotSourceSize
              screenshotQuality={1}
              videoConstraints={{
                height: 1024,
                width: 1024,
                aspectRatio: 1,
                facingMode: facingMode,
              }}
              onPlaying={() => {
                setCameraLoaded(true);
              }}
            />
          )}
        </div>
      </main>
      {!picture && (
        <footer className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-primary h-16 dark:bg-slate-800">
          <FooterButton onClick={capture} />
        </footer>
      )}
    </div>
  );
}
