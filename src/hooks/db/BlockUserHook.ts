import { useEffect, useState } from "react";
import { BlockUserType, HidePost } from "@/data/types";


export const useFetchBlockUser = () => {
        const [blockUser, setBlockUser] = useState<BlockUserType | null>(null)
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        const fetchBlockUser = async (accountId: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/blockuser?accountId=${accountId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const blockUser:BlockUserType = await response.json();
                console.log(" Block User : ", blockUser)
                setBlockUser(blockUser)
                return blockUser;
            } catch (err) {
                console.error('Error fetching block user:', err);
                setError("Error fetching block user!");
            } finally {
                setLoading(false);
            }
        };
  
    return { blockUser, loading, error, fetchBlockUser };
};

export const useSaveBlockUser = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const saveBlockUser = async (data: BlockUserType): Promise<void> => {
      setLoading(true);
      setError(null);
  
      try {
        console.log("Hook Block User :", data)
        const response = await fetch('/api/blockuser', {
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
        setError('Failed to save block user');
      } finally {
        setLoading(false);
      }
    };
  
    return { saveBlockUser, loading, error };
  };