import axios from "axios";

interface AuthOptions {
  url: string;
  headers: { Authorization: string };
  data: { grant_type: string }; // Use 'data' instead of 'form' for clarity
}

// Environment variables should be loaded securely at runtime
// (Consider using a library like dotenv)
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

// Validate environment variables before use
if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    "Missing required environment variables: REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET",
  );
}

const generateAuthorizationHeader = () => {
  // Encode credentials in a secure way, avoiding hardcoding in source code
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64",
  );
  return `Basic ${credentials}`;
};

const authOptions: AuthOptions = {
  url: "https://accounts.spotify.com/api/token",
  headers: {
    Authorization: generateAuthorizationHeader(),
  },
  data: {
    grant_type: "client_credentials",
  },
};

const requestAuthorization = async (): Promise<string> => {
  try {
    const response = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers,
    });

    if (response.status === 200) {
      // console.log(response.data.access_token);
      return response.data.access_token;
    } else {
      throw new Error(
        `Failed to request authorization: ${response.statusText}`,
      );
    }
  } catch (error) {
    throw error; // Rethrow the error for proper handling
  }
};

// Implementation for refreshAuthorization can be added here, following similar security considerations

export { requestAuthorization };
