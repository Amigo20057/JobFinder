import {Request, Response, Router} from "express";
import {validationResult} from "express-validator";
import {PostService} from "../services/post.service";
import {UserService} from "../services/user.service";
import {logger} from "../utils/log";
import {AuthCheck} from "../utils/middlewares/auth.middleware";
import {postCreateValidation} from "../utils/validations";

const router = Router();
const userService = new UserService();
const postService = new PostService(userService);

router.get("/", async (req: Request, res: Response) => {
    try {
        const posts = await postService.findAllPosts();
        res.status(200).json(posts.rows);
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({error: error.message});
    }
})

router.get("/id/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const post = await postService.findPostById(id);
        res.status(200).json(post.rows[0]);
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({error: error.message});
    }
});

router.get("/email/:email", async (req: Request, res: Response) => {
    try {
        const email = req.params.email;
        const posts = await postService.findPostsByEmail(email);
        res.status(200).json(posts.rows);
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({error: error.message});
    }
});

router.post(
    "/create",
    postCreateValidation,
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({errors: errors.array()});
                return;
            }
            const post = await postService.create(req.body);
            res.status(200).json(post.rows[0]);
        } catch (error: any) {
            logger.error(error.message);
            res.status(500).json({error: error.message});
        }
    }
);

router.patch("/:id", AuthCheck, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const {title, description, tags} = req.body;
        const userId = req.userId;
        const user = await userService.findRecruiterById(userId!);
        if (user.rowCount === 0) {
            res.status(403).json({message: "No access"});
            return;
        }
        const post = await postService.update(id, title, description, tags);
        res.status(200).json(post);
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({error: error.message});
    }
});

router.delete("/:id", AuthCheck, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.userId;
        const user = await userService.findRecruiterById(userId!);
        if (user.rowCount === 0) {
            res.status(403).json({message: "No access"});
            return;
        }
        await postService.delete(id);
        res.status(200).json({successfully: true});
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({error: error.message});
    }
});

router.get("/posts-with-recruiter", async (req: Request, res: Response) => {
    try {
        const posts = await postService.findPostsWithRecruiter();
        res.status(200).json(posts.rows);
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({error: error.message});
    }
})

router.get("/post-with-recruiter/:id", async (req: Request, res: Response) => {
    try {
        const post = await postService.findPostWithRecruiterById(parseInt(req.params.id));
        res.status(200).json(post.rows[0]);
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({error: error.message});
    }
})

router.post("/save-post/:id", AuthCheck, async (req: Request, res: Response) => {
    try {
        const finderId = req.userId;
        const postId = parseInt(req.params.id);
        const post = await postService.savePost(finderId!, postId);
        res.status(200).json(post.rows[0]);
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({error: error.message});
    }
})

router.get("/saved-posts", AuthCheck, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const posts = await postService.findSavedPosts(userId!);
        res.status(200).json(posts.rows);
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({error: error.message});
    }
})

export const PostRouter = router;
