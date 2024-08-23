import { useState } from "react";
import { CreditsType, HashesType } from "@/data/types";


export const useFetchHashes = () => {
        const [hashes, setHashes] = useState<HashesType | null>(null)
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        const fetchHashes = async (hash: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/hashes?hash=${hash}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const hashes = await response.json();
                setHashes(hashes)
                return hashes;
            } catch (err) {
                console.error('Error fetching hashes from DB:', err);
                setError("Error fetching hashes from DB!");
            } finally {
                setLoading(false);
            }
        };
  
    return { hashes, loading, error, fetchHashes };
};

export const useSaveHashes = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const saveHashes = async (data: HashesType) => {
      setLoading(true);
      setError(null);
      console.log("Hook >> ", data)
  
      try {
        const response = await fetch('/api/hashes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save data');
        }
        const savedHashes = await response.json();
        return {savedHashes, status : response.status};
      } catch (error) {
        console.error('Error saving hash data:', error);
        setError('Failed to save hash to DB');
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    return { saveHashes, loading, error };
  };