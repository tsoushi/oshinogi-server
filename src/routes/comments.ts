import { Router } from "express";
import { postComment , getComment, plusComment } from "../controllers/comments"
import { authenticateUser } from "../middlewares/auth";

const router = Router();

router.get("/", getComment);

router.post("/board/:id", authenticateUser , postComment);

router.put("/puls", authenticateUser, plusComment);

export default router;