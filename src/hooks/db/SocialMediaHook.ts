import { useEffect, useState } from "react";
import { SocialMedia } from "@/data/types";


export const useFetchSocialMedias = () => {
        const [socialMedias, setSocialMedias] = useState<SocialMedia[] | null>(null)
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        const fetchSocialMedias = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/socials`);
                if (!response.ok) throw new Error('Network response was not ok');
                const socialMedias:SocialMedia[] = await response.json();
                setSocialMedias(socialMedias)
            } catch (err) {
                console.error('Error fetching social medias:', err);
                setError("Error fetching social medias!");
            } finally {
                setLoading(false);
            }
        };
  
        
        useEffect(() => {
            fetchSocialMedias();
        }, []);
  
    return { socialMedias, loading, error };
};

export const useSaveSocialMedia = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const saveSocialMedia = async (data: SocialMedia): Promise<void> => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch('/api/socials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save data');
        }
      } catch (error) {
        console.error('Error saving data:', error);
        setError('Failed to save Social Media');
      } finally {
        setLoading(false);
      }
    };
  
    return { saveSocialMedia, loading, error };
  };