import { useState } from "react";
import { CreditsType } from "@/data/types";


export const useFetchCredits = () => {
        const [credits, setCredits] = useState<CreditsType | null>(null)
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        const fetchCredits = async (accountId: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/credits?accountId=${accountId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const credits:CreditsType = await response.json();
                setCredits(credits)
                return credits;
            } catch (err) {
                console.error('Error fetching credits from DB:', err);
                setError("Error fetching credits from DB!");
            } finally {
                setLoading(false);
            }
        };
  
    return { credits, loading, error, fetchCredits };
};

export const useSaveCredits = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const saveCredits = async (data: CreditsType) => {
      setLoading(true);
      setError(null);
      console.log("Hook >> ", data)
  
      try {
        const response = await fetch('/api/credits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save data');
        }
        const savedCredits = await response.json();
        return {savedCredits, status : response.status};
      } catch (error) {
        console.error('Error saving data:', error);
        setError('Failed to save credits to DB');
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    return { saveCredits, loading, error };
  };