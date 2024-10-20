// authService.ts
import axios from "axios";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN_URL = "https://accounts.spotify.com/api/token";

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<string> => {
  const response = await axios.post(
    REFRESH_TOKEN_URL,
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  if (response.status === 200) {
    return response.data.access_token;
  } else {
    throw new Error("Failed to refresh token");
  }
};
