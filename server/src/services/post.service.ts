import { Pool } from "pg";
import pool from "../db/pool";
import { IPost } from "../types/post.interface";
import { UserService } from "./user.service";

export class PostService {
	private pool: Pool = pool;

	public constructor(private readonly userService: UserService) {}

	public async findAllPosts(userId: number | null | undefined) {
		return await this.pool.query(
			`SELECT p.*, 
					CASE WHEN sp.post_id IS NOT NULL THEN true ELSE false END AS "isSaved"
			 FROM public.posts p
			 LEFT JOIN saved_posts sp ON sp.post_id = p.id AND sp.user_id = $1`,
			[userId]
		);
	}

	public async findPostById(id: number) {
		return await this.pool.query("SELECT * FROM public.posts WHERE id = $1", [
			id,
		]);
	}

	public async findPostsByRecruiterId(id: number) {
		return await this.pool.query(
			"SELECT * FROM public.posts WHERE recruiter_id = $1",
			[id]
		);
	}

	public async findPostsByEmail(email: string) {
		const user = await this.userService.findRecruiterByEmail(email);
		if (user.rowCount === 0) {
			throw new Error("User not found");
		}
		const posts = await this.pool.query(
			"SELECT * FROM public.posts WHERE recruiter_id = $1",
			[user.rows[0].id]
		);
		if (posts.rowCount === 0) {
			throw new Error("posts not found");
		}
		return posts;
	}

	public async create(dto: IPost, recruiterId: number) {
		return await this.pool.query(
			"INSERT INTO public.posts(title, description, work_format, experience, language, tags, recruiter_id, about_company) VALUES($1, $2, $3, $4, $5 ,$6, $7, $8) RETURNING *",
			[
				dto.title,
				dto.description,
				dto.workFormat,
				dto.experience,
				dto.language,
				dto.tags,
				recruiterId,
				dto.aboutCompany,
			]
		);
	}

	public async update(
		id: number,
		title?: string,
		description?: string,
		tags?: string[]
	) {
		if (title) {
			await this.pool.query(
				"UPDATE public.posts SET title = $1 WHERE id = $2",
				[title, id]
			);
		}
		if (description) {
			await this.pool.query(
				"UPDATE public.posts SET description = $1 WHERE id = $2",
				[description, id]
			);
		}
		if (tags) {
			await this.pool.query("UPDATE public.posts SET tags = $1 WHERE id = $2", [
				tags,
				id,
			]);
		}
		const updatedPost = await this.pool.query(
			"SELECT * FROM public.posts WHERE id = $1",
			[id]
		);
		return updatedPost.rows[0];
	}

	public async delete(id: number) {
		return await this.pool.query("DELETE FROM public.posts WHERE id = $1", [
			id,
		]);
	}

	public async findPostsWithRecruiter(userId: number | null | undefined) {
		return await this.pool.query(
			`SELECT posts.*, 
					recruiters.address_company, 
					recruiters.name_company, 
					CASE WHEN sp.finder_id IS NOT NULL THEN true ELSE false END AS "isSaved"
			 FROM public.posts
			 JOIN public.recruiters ON recruiters.id = posts.recruiter_id
			 LEFT JOIN saved_posts sp ON sp.post_id = posts.id AND sp.finder_id = $1
			 ORDER BY posts.created_at DESC`,
			[userId]
		);
	}

	public async findPostWithRecruiterById(
		id: number,
		userId: number | null | undefined
	) {
		return await this.pool.query(
			`SELECT posts.*, 
					recruiters.address_company, 
					recruiters.name_company, 
					CASE WHEN sp.post_id IS NOT NULL THEN true ELSE false END AS "isSaved"
			 FROM public.posts
			 JOIN public.recruiters ON recruiters.id = posts.recruiter_id
			 LEFT JOIN saved_posts sp ON sp.post_id = posts.id AND sp.finder_id = $1
			 WHERE posts.id = $2`,
			[userId, id]
		);
	}

	public async savePost(finderId: number, postId: number) {
		return await this.pool.query(
			`INSERT INTO public.saved_posts(finder_id, post_id)
             VALUES ($1, $2) RETURNING *`,
			[finderId, postId]
		);
	}

	public async findSavedPosts(userId: number) {
		return await this.pool.query(
			`SELECT public.posts.*,
                    public.recruiters.name_company,
                    public.recruiters.address_company
             FROM public.posts
                      JOIN public.saved_posts
                           ON public.saved_posts.post_id = public.posts.id
                      JOIN public.recruiters
                           ON public.posts.recruiter_id = public.recruiters.id
             WHERE public.saved_posts.finder_id = $1`,
			[userId]
		);
	}

	public async removeSavedPost(userId: number, postId: number) {
		await this.pool.query(
			"DELETE FROM public.saved_posts WHERE public.saved_posts.finder_id = $1 AND public.saved_posts.post_id = $2",
			[userId, postId]
		);
	}
}
