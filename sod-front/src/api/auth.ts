import request from "request-promise";

interface AuthOptions {
  url: string;
  headers: { Authorization: string };
  form: { grant_type: string };
  json: boolean;
}

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

if (typeof CLIENT_ID === "undefined") {
  throw new Error(
    "REACT_APP_CLIENT_ID is undefined. Make sure it's set in .env"
  );
}
if (typeof CLIENT_SECRET === "undefined") {
  throw new Error(
    "REACT_APP_CLIENT_SECRET is undefined. Make sure it's set in .env"
  );
}

const authOptions: AuthOptions = {
  url: "https://accounts.spotify.com/api/token",
  headers: {
    Authorization:
      "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
  },
  form: {
    grant_type: "client_credentials",
  },
  json: true,
};

const requestAuthorization = () => {
  return request.post(authOptions);
};

export { requestAuthorization };
