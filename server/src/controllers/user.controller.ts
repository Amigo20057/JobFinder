import { Request, Response, Router } from "express";
import { UserService } from "../services/user.service";
import { logger } from "../utils/log";
import { AuthCheck } from "../utils/middlewares/auth.middleware";

const router = Router();
const userService = new UserService();

router.get(
	"/finder/profile",
	AuthCheck,
	async (req: Request, res: Response) => {
		try {
			const userId = req.id;
			if (!userId) {
				res.status(400).json({ error: "User ID is missing" });
				return;
			}
			const user = await userService.findFindersById(userId);
			res.status(200).json(user.rows[0]);
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
	"/recruiter/profile",
	AuthCheck,
	async (req: Request, res: Response) => {
		try {
			const userId = req.id;
			if (!userId) {
				res.status(400).json({ error: "User ID is missing" });
				return;
			}
			const user = await userService.findRecruiterById(userId);
			res.status(200).json(user.rows[0]);
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

// router.get("/profile/:id", AuthCheck, async (req: Request, res: Response) => {
// 	try {
// 		const userId = parseInt(req.params.id);
// 		const user = await userService.findUserById(userId);
// 		res.status(200).json(user);
// 	} catch (error: any) {
// 		logger.error(error.message);
// 		res.status(500).json({ error: error.message });
// 	}
// });

export const UserRouter = router;
