import { Router } from "express";
import { getAllUsers, registerUser } from "../controllers/users";



const router = Router();



router.get("/", getAllUsers);

router.post("/register", registerUser);

//router.post("/login", loginUser);

export default router