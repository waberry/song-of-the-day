import axios, { CancelToken } from "axios";
import { Dispatch } from "redux";

const RESULT_LIMIT = 10;
const RESULT_TYPES: string[] = ["artist", "album", "track"];

interface FetchHitsParams {
  query: string;
  authToken: string;
  dispatch: Dispatch<any>; // Adjust the type according to your action types
  cancelToken: CancelToken | undefined;
}

async function fetchHits({
  query,
  authToken,
  dispatch,
  cancelToken,
}: FetchHitsParams): Promise<void> {
  if (query === "") {
    axios.isCancel("empty input");
    dispatch({ type: "FETCH_SUCCESS", payload: null });
    return;
  }

  const resultTypesFmt: string = RESULT_TYPES.join(",");
  dispatch({ type: "FETCH_START" });

  const encodedQuery: string = encodeURIComponent(query);
  const url: string = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=${resultTypesFmt}&include_external=audio&limit=${RESULT_LIMIT}&market=US`;

  try {
    const result = await axios(url, {
      cancelToken,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const payload: any = result.data; // Adjust the type according to your response data structure
    dispatch({ type: "FETCH_SUCCESS", payload });
  } catch (err) {
    console.error(err);
    axios.isCancel(err) || dispatch({ type: "FETCH_FAILURE" });
  }
}

export default fetchHits;
