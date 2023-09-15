import { Router } from "express";
import { getAllUser } from "../controllers/users";


const router = Router();

router.get("/", getAllUser);

//router.post("/register", registerUser);

//router.post("/login", loginUser);

export default router