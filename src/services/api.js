// const API_KEY = "a89231aacad15dcce17d1cd10018001d";
const BASE_URL = "https://api.jikan.moe/v4";

export const getPopularAnimes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/top/anime`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error Fetching Animes: ", error);
    return [];
  }
};
export const searchAnimes = async (query) => {
  try {
    if (!query) return [];
    const response = await fetch(`
        ${BASE_URL}/anime?q=${encodeURIComponent(query)}
    `);
    if (!response.ok) {
      throw new Error(`status: ${response.status}`);  
    }
    const data = await response.json();
    return data && Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error Fetching Animes: ", error);
    return [];
  }
};
console.log(getPopularAnimes());
