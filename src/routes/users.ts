import { Router } from "express";
import { getAllUsers, registerUser, getUser } from "../controllers/users";
import { authenticateUser } from "../middlewares/auth";



const router = Router();


router.get("/", authenticateUser, getUser)

router.get("/all", getAllUsers);

router.post("/register", registerUser);

export default router