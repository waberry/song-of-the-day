import { configureStore } from '@reduxjs/toolkit'


interface HitsState {
    data: any[] | null;
    loading: boolean;
    error: boolean;
  }
  
const initialState: HitsState = {
data: null,
loading: false,
error: false,
};

export const store =  configureStore({
    reducer: {
        search: searchReducer,
    }
})





  const hitsReducer = (state = initialState, action: FetchAction<any>): HitsState => {
    switch (action.type) {
      case "FETCH_START":
        return {
          ...state,
          loading: true,
          error: false,
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          loading: false,
          data: action.payload,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          loading: false,
          error: true,
        };
      default:
        return state;
    }
  };
  