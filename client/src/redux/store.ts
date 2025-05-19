import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth.ts";
import { postsReducer } from "./slices/posts.ts";
import { reviewsReducer } from "./slices/reviews.ts";

const store = configureStore({
	reducer: {
		auth: authReducer,
		posts: postsReducer,
		reviews: reviewsReducer,
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
