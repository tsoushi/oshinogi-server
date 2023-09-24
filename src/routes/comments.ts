import { Router } from "express";
import { postComment , getComment } from "../controllers/comments"
import { authenticateUser } from "../middlewares/auth";

const router = Router();

router.get("/", getComment);

router.post("/:id", authenticateUser , postComment);

export default router;