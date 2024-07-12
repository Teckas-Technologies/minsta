import { useEffect, useState } from "react";
import { HidePost } from "@/data/types";


export const useFetchHiddenPost = () => {
        const [hiddenPost, setHiddenPost] = useState<HidePost | null>(null)
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        const fetchHiddenPost = async (accountId: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/hidepost?accountId=${accountId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const hiddenPost:HidePost = await response.json();
                setHiddenPost(hiddenPost)
                return hiddenPost;
            } catch (err) {
                console.error('Error fetching hidden post:', err);
                setError("Error fetching hidden post!");
            } finally {
                setLoading(false);
            }
        };
  
    return { hiddenPost, loading, error, fetchHiddenPost };
};

export const useSaveHidePost = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const saveHidePost = async (data: HidePost & { unhide?: boolean }): Promise<void> => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch('/api/hidepost', {
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
        setError('Failed to save hide post');
      } finally {
        setLoading(false);
      }
    };
  
    return { saveHidePost, loading, error };
  };