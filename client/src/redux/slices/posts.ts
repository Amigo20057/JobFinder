import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import { IPost } from "../../types/post.interface.ts";
import { InitialStatePosts } from "../../types/redux.interface.ts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	const { data } = await axios.get("/posts/");
	console.log("DATA FETCH POSTS: ", data);
	return data;
});

export const fetchPostWithRecruiterById = createAsyncThunk(
	"posts/fetchPostsWithRecruiterById",
	async (id: number) => {
		const { data } = await axios.get(`/posts/post-with-recruiter/${id}`);
		console.log("DATA FETCH POST WITH RECRUITER BY ID: ", data);
		return data;
	}
);

export const fetchPostsWithRecruiter = createAsyncThunk(
	"posts/fetchPostsWithRecruiter",
	async () => {
		const { data } = await axios.get("/posts/posts-with-recruiter");
		console.log("DATA FETCH POST WITH RECRUITER", data);
		return data;
	}
);

export const createPost = createAsyncThunk(
	"posts/createPost",
	async (params: IPost) => {
		const { data } = await axios.post("/posts/create", params);
		console.log("DATA CREATED POST", data);
		return data;
	}
);

const initialState: InitialStatePosts = {
	posts: {
		items: [],
		status: "loading",
	},
	fullPost: null,
};

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchPosts.pending, state => {
				state.posts.items = [];
				state.posts.status = "loading";
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.posts.items = action.payload;
				state.posts.status = "loaded";
			})
			.addCase(fetchPosts.rejected, state => {
				state.posts.items = [];
				state.posts.status = "error";
			})

			.addCase(fetchPostWithRecruiterById.pending, state => {
				state.fullPost = null;
			})
			.addCase(fetchPostWithRecruiterById.fulfilled, (state, action) => {
				state.fullPost = action.payload;
			})
			.addCase(fetchPostWithRecruiterById.rejected, state => {
				state.fullPost = null;
			})

			.addCase(fetchPostsWithRecruiter.pending, state => {
				state.posts.items = [];
				state.posts.status = "loading";
			})
			.addCase(fetchPostsWithRecruiter.fulfilled, (state, action) => {
				state.posts.items = action.payload;
				state.posts.status = "loaded";
			})
			.addCase(fetchPostsWithRecruiter.rejected, state => {
				state.posts.items = [];
				state.posts.status = "error";
			});
	},
});

export const postsReducer = postsSlice.reducer;
