import { HomePage } from "@/components/HomePage";
import { MINSTA_META } from "@/data/fallback";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: `${process.env.NEXT_PUBLIC_META_TITLE} - ${process.env.NEXT_PUBLIC_META_DESCRIPTION} `,
  openGraph: {
    title: process.env.NEXT_PUBLIC_META_TITLE ?? MINSTA_META.title,
    description:
      process.env.NEXT_PUBLIC_META_DESCRIPTION ?? MINSTA_META.description,
    images: [
      {
        type: "image/png",
        url: process.env.NEXT_PUBLIC_META_IMAGE ?? MINSTA_META.image,
        width: "1200",
        height: "630",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_META_TITLE ?? MINSTA_META.title,
    description:
      process.env.NEXT_PUBLIC_META_DESCRIPTION ?? MINSTA_META.description,
    siteId: "1467726470533754880",
    creator: "Mintbase",
    images: process.env.NEXT_PUBLIC_META_IMAGE ?? MINSTA_META.image,
  },
  description:
    process.env.NEXT_PUBLIC_META_DESCRIPTION ?? MINSTA_META.description,
};

export default function Home() {
  return  <HomePage />
}
