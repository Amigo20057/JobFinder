import { Pool } from "pg";
import pool from "../db/pool";

export class ReviewService {
	private pool: Pool = pool;

	public async createReview(
		aboutFinder: string,
		finderId: number,
		postId: number
	) {
		return await this.pool.query(
			"INSERT INTO public.reviews(about_finder, finder_id, post_id) VALUES($1, $2, $3) RETURNING *",
			[aboutFinder, finderId, postId]
		);
	}

	public async getAllReviewsWithUserInfoByPostId(postId: number) {
		return await this.pool.query(
			"SELECT u.email, u.user_name, user_surname, r.about_finder FROM reviews r JOIN finders u ON r.finder_id = u.id WHERE r.post_id = $1",
			[postId]
		);
	}
}
