import { Router } from "express";
import { postComment , getComment, plusComment, minusComment } from "../controllers/comments"
import { authenticateUser } from "../middlewares/auth";

const router = Router();

router.get("/", getComment);

router.post("/board/:id", authenticateUser , postComment);

router.put("/plus", authenticateUser, plusComment);

router.put("/minus", authenticateUser, minusComment);

export default router;