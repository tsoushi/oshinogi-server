import { Router } from "express";
import { getAllUsers, registerUser, getUser, selectPolitician } from "../controllers/users";
import { authenticateUser } from "../middlewares/auth";

const router = Router();

router.get("/", authenticateUser, getUser);

router.get("/all", getAllUsers);

router.post("/register", registerUser);

router.put("/", authenticateUser, selectPolitician);

export default router;
