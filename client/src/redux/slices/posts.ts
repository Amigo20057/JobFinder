import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import { IPostResponse } from "../../types/post.interface.ts";
import { InitialStatePosts } from "../../types/redux.interface.ts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	const { data } = await axios.get("/posts/");
	return data;
});

export const fetchPostWithRecruiterById = createAsyncThunk(
	"posts/fetchPostsWithRecruiterById",
	async (id: number) => {
		const { data } = await axios.get(`/posts/post-with-recruiter/${id}`);
		return data;
	}
);

export const fetchPostsWithRecruiter = createAsyncThunk(
	"posts/fetchPostsWithRecruiter",
	async () => {
		const { data } = await axios.get("/posts/posts-with-recruiter");
		return data;
	}
);

export const fetchSavedPosts = createAsyncThunk(
	"posts/fetchSavedPosts",
	async () => {
		const { data } = await axios.get("/posts/saved-posts", {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem("token")}`,
			},
		});
		return data;
	}
);

export const createPost = createAsyncThunk(
	"posts/createPost",
	async (params: IPostResponse) => {
		const { data } = await axios.post("/posts/create", params, {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem("token")}`,
			},
		});
		return data;
	}
);

export const fetchSavePost = createAsyncThunk(
	"posts/savePost",
	async (postId: number) => {
		await axios.post(`/posts/save-post/${postId}`, {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem("token")}`,
			},
		});
	}
);

export const fetchRemoveSavedPost = createAsyncThunk(
	"posts/removeSavedPost",
	async (postId: number) => {
		await axios.delete(`posts/remove/saved-post/${postId}`, {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem("token")}`,
			},
		});
	}
);

export const fetchCreatedPosts = createAsyncThunk(
	"posts/fetchCreatedPosts",
	async () => {
		const { data } = await axios.get("posts/created-posts", {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem("token")}`,
			},
		});
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
			})

			.addCase(fetchSavePost.fulfilled, (state, action) => {
				state.posts.status = "loaded";
			})

			.addCase(fetchRemoveSavedPost.fulfilled, (state, action) => {
				state.posts.status = "loaded";
			})

			.addCase(fetchSavedPosts.pending, state => {
				state.posts.items = [];
				state.posts.status = "loading";
			})
			.addCase(fetchSavedPosts.fulfilled, (state, action) => {
				state.posts.items = action.payload;
				state.posts.status = "loaded";
			})
			.addCase(fetchSavedPosts.rejected, state => {
				state.posts.items = [];
				state.posts.status = "error";
			})

			.addCase(fetchCreatedPosts.pending, state => {
				state.posts.items = [];
				state.posts.status = "loading";
			})
			.addCase(fetchCreatedPosts.fulfilled, (state, action) => {
				state.posts.items = action.payload;
				state.posts.status = "loaded";
			})
			.addCase(fetchCreatedPosts.rejected, state => {
				state.posts.items = [];
				state.posts.status = "error";
			});
	},
});

export const postsReducer = postsSlice.reducer;
