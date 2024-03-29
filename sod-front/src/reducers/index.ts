import { configureStore } from "@reduxjs/toolkit";
import songsReducer from "./slices/searchSlice";

const store = configureStore({
  reducer: {
    songs: songsReducer,
    // Add more slices here if needed
  },
});

export default store;
