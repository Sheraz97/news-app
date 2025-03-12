import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewsArticle, NewsState } from "../../types";

const initialState: NewsState = {
  newsData: [],
  loading: false,
  error: null,
  totalResults: 0,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    fetchNewsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNewsSuccess(state, action: PayloadAction<{ articles: NewsArticle[]; totalResults: number }>) {
      state.newsData = action.payload.articles;
      state.totalResults = action.payload.totalResults; // Update totalResults
      state.loading = false;
    },
    fetchNewsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchNewsStart, fetchNewsSuccess, fetchNewsFailure } = newsSlice.actions;

export default newsSlice.reducer;