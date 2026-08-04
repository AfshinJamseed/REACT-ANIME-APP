// const API_KEY = "a89231aacad15dcce17d1cd10018001d";
const BASE_URL = "https://api.jikan.moe/v4";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RATE_LIMIT_GAP_MS = 400;
let lastRequestTime = 0;

const waitForRateLimit = async () => {
  const wait = Math.max(0, RATE_LIMIT_GAP_MS - (Date.now() - lastRequestTime));
  if (wait > 0) await delay(wait);
  lastRequestTime = Date.now();
};

const fetchWithRetry = async (url, retries = 3) => {
  let response;
  for (let attempt = 0; attempt <= retries; attempt++) {
    await waitForRateLimit();
    response = await fetch(url);
    if (![429, 504, 503, 408].includes(response.status) || attempt === retries) {
      return response;
    }
    await delay(500 * 2 ** attempt);
  }
  return response;
};


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
