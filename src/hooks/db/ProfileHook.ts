import { useEffect, useState } from "react";
import { ProfileType } from "@/data/types";

export const useFetchTotalProfiles = () => {
  const [totalProfiles, setTotalProfiles] = useState<number | null>(null);
  const [lastMonthProfiles, setLastMonthProfiles] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTotalProfiles(data?.totalProfiles);
      setLastMonthProfiles(data?.lastMonthProfiles)
    } catch (err) {
      console.error('Error fetching total profiles:', err);
      setError('Error fetching total profiles!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalProfiles();
  }, []);

  return { totalProfiles, lastMonthProfiles, loading, error };
};

export const useFetchProfile = () => {
        const [profile, setProfile] = useState<ProfileType | null>(null)
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        const fetchDBProfile = async (accountId: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/profile?accountId=${accountId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const profile:ProfileType = await response.json();
                setProfile(profile)
                return profile;
            } catch (err) {
                console.error('Error fetching profile from DB:', err);
                setError("Error fetching profile from DB!");
            } finally {
                setLoading(false);
            }
        };
  
    return { profile, loading, error, fetchDBProfile };
};

export const useSaveProfile = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const saveDBProfile = async (data: ProfileType | Partial<ProfileType>) => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save data');
        }
        const savedProfile = await response.json();
        return {savedProfile, status : response.status};
      } catch (error) {
        console.error('Error saving data:', error);
        setError('Failed to save profile to DB');
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    return { saveDBProfile, loading, error };
  };