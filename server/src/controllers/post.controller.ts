import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { PostService } from "../services/post.service";
import { UserService } from "../services/user.service";
import { logger } from "../utils/log";
import { AuthCheck } from "../utils/middlewares/auth.middleware";
import { postCreateValidation } from "../utils/validations";

const router = Router();
const userService = new UserService();
const postService = new PostService(userService);

router.get("/", AuthCheck, async (req: Request, res: Response) => {
	try {
		const userId = req.id;
		const posts = await postService.findAllPosts(userId);
		res.status(200).json(posts.rows);
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error(error.message);
			res.status(500).json({ error: error.message });
		} else {
			logger.error("An unknown error occurred");
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
});

router.get("/id/:id", async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id);
		const post = await postService.findPostById(id);
		res.status(200).json(post.rows[0]);
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error(error.message);
			res.status(500).json({ error: error.message });
		} else {
			logger.error("An unknown error occurred");
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
});

router.get("/email/:email", async (req: Request, res: Response) => {
	try {
		const email = req.params.email;
		const posts = await postService.findPostsByEmail(email);
		res.status(200).json(posts.rows);
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error(error.message);
			res.status(500).json({ error: error.message });
		} else {
			logger.error("An unknown error occurred");
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
});

router.post(
	"/create",
	postCreateValidation,
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}
			const post = await postService.create(req.body);
			res.status(200).json(post.rows[0]);
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error(error.message);
				res.status(500).json({ error: error.message });
			} else {
				logger.error("An unknown error occurred");
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}
);

router.patch("/:id", AuthCheck, async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id);
		const { title, description, tags } = req.body;
		const userId = req.userId;
		const user = await userService.findRecruiterById(userId!);
		if (user.rowCount === 0) {
			res.status(403).json({ message: "No access" });
			return;
		}
		const post = await postService.update(id, title, description, tags);
		res.status(200).json(post);
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error(error.message);
			res.status(500).json({ error: error.message });
		} else {
			logger.error("An unknown error occurred");
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
});

router.delete("/:id", AuthCheck, async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id);
		const userId = req.userId;
		const user = await userService.findRecruiterById(userId!);
		if (user.rowCount === 0) {
			res.status(403).json({ message: "No access" });
			return;
		}
		await postService.delete(id);
		res.status(200).json({ successfully: true });
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error(error.message);
			res.status(500).json({ error: error.message });
		} else {
			logger.error("An unknown error occurred");
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
});

router.get(
	"/posts-with-recruiter",
	AuthCheck,
	async (req: Request, res: Response) => {
		try {
			const posts = await postService.findPostsWithRecruiter(req.id);
			res.status(200).json(posts.rows);
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error(error.message);
				res.status(500).json({ error: error.message });
			} else {
				logger.error("An unknown error occurred");
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}
);

router.get(
	"/post-with-recruiter/:id",
	AuthCheck,
	async (req: Request, res: Response) => {
		try {
			const userId = req.id;
			const post = await postService.findPostWithRecruiterById(
				parseInt(req.params.id),
				userId
			);
			res.status(200).json(post.rows[0]);
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error(error.message);
				res.status(500).json({ error: error.message });
			} else {
				logger.error("An unknown error occurred");
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}
);

//SAVE POST
router.post(
	"/save-post/:postId",
	AuthCheck,
	async (req: Request, res: Response) => {
		try {
			const finderId = req.id;
			const postId = parseInt(req.params.postId);
			const post = await postService.savePost(finderId!, postId);
			res.status(200).json(post.rows[0]);
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error(error.message);
				res.status(500).json({ error: error.message });
			} else {
				logger.error("An unknown error occurred");
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	}
);

//GET SAVED POSTS
router.get("/saved-posts", AuthCheck, async (req: Request, res: Response) => {
	try {
		const userId = req.id;
		const posts = await postService.findSavedPosts(userId!);
		res.status(200).json(posts.rows);
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error(error.message);
			res.status(500).json({ error: error.message });
		} else {
			logger.error("An unknown error occurred");
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
});

router.delete(
	"/remove/saved-post/:postId",
	AuthCheck,
	async (req: Request, res: Response) => {
		try {
			const userId = req.id;
			const postId = parseInt(req.params.postId);
			await postService.removeSavedPost(userId!, postId);
			res.status(200).json({ successfully: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				logger.error("An unknown error occurred");
				res.status(500).json({ error: "Internal server Error" });
			}
		}
	}
);

export const PostRouter = router;
