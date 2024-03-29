import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  data: any[] | null;
  loading: boolean;
  error: boolean;
}

const initialState: SearchState = {
  data: null,
  loading: false,
  error: false,
};

const searchSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = false;
    },
    fetchSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchFailure(state) {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure } = searchSlice.actions;
export default searchSlice.reducer;
