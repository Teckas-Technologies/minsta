"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { constants } from "@/constants";
import InlineSVG from "react-inlinesvg";
import { NearContext } from "@/wallet/WalletSelector";

const ViewYourNfts = () => {
  const { wallet, signedAccountId } = useContext(NearContext);

  return signedAccountId ? (
    <div className="flex gap-2 items-center">
      <Link
        target="_blank"
        rel="noopener noreferrer"
        passHref
        href={`${constants.mintbaseBaseUrl}/human/${signedAccountId}/owned/0`}
        className="text-linkColor text-sm dark:text-white"
      >
        View your NFTs
      </Link>
      <InlineSVG
        src="/images/link_arrow.svg"
        className="fill-current text-linkColor dark:text-white"
      />
    </div>
  ) : null;
};

export default ViewYourNfts;
