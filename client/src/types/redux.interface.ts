import { IPost, IPostWithRecruiter } from "./post.interface.ts";
import { IReview } from "./reviews.interface.ts";
import { IUsers } from "./user.interface.ts";

type Status = "loading" | "loaded" | "error";

export interface InitialState {
	data: IUsers | null;
	token: string | null;
	role: string | null;
	status: Status;
}

export interface Payload {
	token?: string;
}

export interface InitialStatePosts {
	posts: {
		items: IPostWithRecruiter[] | IPost[];
		status: Status;
	};
	fullPost: IPost | null;
}

export interface InitialStateReviews {
	reviews: {
		items: IReview[];
		status: Status;
	};
}
