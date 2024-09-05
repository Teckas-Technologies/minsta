import { useState } from "react";
import { GiveawayType } from "@/data/types";

type GiveawayTypeFetch = "ongoing" | "ended" | "upcoming" | "all";

export const useFetchGiveaways = () => {
  const [giveaways, setGiveaways] = useState<GiveawayType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGiveaways = async (type: GiveawayTypeFetch = "all") => {
    setLoading(true);
    setError(null);
    try {
      const url = type === "all" ? `/api/giveaway` : `/api/giveaway?type=${type}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const giveaways: GiveawayType[] = await response.json(); 
      setGiveaways(giveaways);
      return giveaways;
    } catch (err) {
      console.error('Error fetching giveaways from DB:', err);
      setError("Error fetching giveaways from DB!");
    } finally {
      setLoading(false);
    }
  };

  return { giveaways, loading, error, fetchGiveaways };
};

export const useSaveGiveaways = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveGiveaway = async (data: GiveawayType) => {
    setLoading(true);
    setError(null);
    console.log("Hook >> ", data)

    try {
      const response = await fetch('/api/giveaway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      const savedGiveaway = await response.json();
      return { savedGiveaway, status: response.status };
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save giveaway to DB');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { saveGiveaway, loading, error };
};