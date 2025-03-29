import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { ConfigService } from "../config/config.service";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { logger } from "../utils/log";
import { loginValidator, registerValidator } from "../utils/validations";

const router = Router();
const authService = new AuthService(new UserService(), new ConfigService());

router.post(
	"/finder/login",
	loginValidator,
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}
			const user = await authService.loginFinder(req.body);
			res.status(200).json({ user });
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

router.post(
	"/recruiter/login",
	loginValidator,
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}
			const user = await authService.loginRecruiter(req.body);
			res.status(200).json({ user });
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

router.post(
	"/finder/register",
	registerValidator,
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}
			const user = await authService.registerFinder(req.body);
			res.status(200).json({ user });
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

router.post(
	"/recruiter/register",
	registerValidator,
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}
			const user = await authService.registerRecruiter(req.body);
			res.status(200).json({ user });
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

export const AuthRouter = router;
