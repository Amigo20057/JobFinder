import { Request, Response, Router } from "express";
import { ReviewService } from "../services/review.service";
import { logger } from "../utils/log";
import { AuthCheck } from "../utils/middlewares/auth.middleware";

const router = Router();
const reviewService = new ReviewService();

router.post("/:postId", AuthCheck, async (req: Request, res: Response) => {
	try {
		const userId = req.id;
		const postId = +req.params.postId;
		const { aboutFinder } = req.body;
		const review = await reviewService.createReview(
			aboutFinder,
			userId!,
			postId!
		);
		res.status(201).json(review.rows);
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

router.get("/:postId", AuthCheck, async (req: Request, res: Response) => {
	try {
		const postId = +req.params.postId;
		const reviews = await reviewService.getAllReviewsWithUserInfoByPostId(
			postId
		);
		res.status(200).json(reviews.rows);
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

export const ReviewRouter = router;
