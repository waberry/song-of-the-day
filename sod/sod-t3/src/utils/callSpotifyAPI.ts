import { refreshAccessToken } from "~/server/api/routers/authservice";

async function callSpotifyAPI(
  accessToken: string,
  refreshToken: string,
  url: string,
  options: RequestInit = {},
) {
  const fetchWithToken = async (token: string) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${response.statusText}`,
      );
    }

    return response.json();
  };

  try {
    return await fetchWithToken(accessToken);
  } catch (error) {
    if (error.message === "Unauthorized") {
      console.log("Token expired. Attempting to refresh...");
      const newAccessToken = await refreshAccessToken(refreshToken);
      return await fetchWithToken(newAccessToken);
    }
    throw error;
  }
}
