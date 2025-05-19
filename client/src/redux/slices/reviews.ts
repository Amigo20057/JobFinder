import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import { InitialStateReviews } from "../../types/redux.interface";

export const fetchCreateReview = createAsyncThunk(
	"reviews/fetchCreateReview",
	async (params: { aboutFinder: string; postId: string }) => {
		const { data } = await axios.post(`/reviews/${params.postId}`, params, {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem("token")}`,
			},
		});
		return data;
	}
);

export const fetchReviews = createAsyncThunk(
	"reviews/fetchReviews",
	async (postId: string) => {
		const { data } = await axios.get(`/reviews/${postId}`, {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem("token")}`,
			},
		});
		return data;
	}
);

const initialState: InitialStateReviews = {
	reviews: {
		items: [],
		status: "loading",
	},
};

const reviewsSlice = createSlice({
	name: "reviews",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCreateReview.pending, state => {
				state.reviews.items = [];
				state.reviews.status = "loading";
			})
			.addCase(fetchCreateReview.fulfilled, (state, action) => {
				state.reviews.items = action.payload;
				state.reviews.status = "loaded";
			})
			.addCase(fetchCreateReview.rejected, state => {
				state.reviews.items = [];
				state.reviews.status = "error";
			})

			.addCase(fetchReviews.pending, state => {
				state.reviews.items = [];
				state.reviews.status = "loading";
			})
			.addCase(fetchReviews.fulfilled, (state, action) => {
				state.reviews.items = action.payload;
				state.reviews.status = "loaded";
			})
			.addCase(fetchReviews.rejected, state => {
				state.reviews.items = [];
				state.reviews.status = "error";
			});
	},
});

export const reviewsReducer = reviewsSlice.reducer;
