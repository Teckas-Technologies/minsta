import type { NextApiRequest, NextApiResponse } from 'next';
import { findAllSocialMedias, saveSocialMedia } from '../../utils/SocialMediasUtils';
import { SocialMedia } from '@/data/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      //POST method is used for creating module
      case 'POST':
        const socialMedia = req.body;
        console.log("API SocialMedia :", socialMedia)
        const savedSocialMedia = await saveSocialMedia(socialMedia);
        return res.status(201).json(savedSocialMedia);
      //GET method is used for fetching module
      case 'GET':
          const socialMedias: SocialMedia[] = await findAllSocialMedias();
          return res.status(200).json(socialMedias);
      default:
        res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: "Server Error" });
  }
}