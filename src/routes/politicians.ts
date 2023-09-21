import { Router } from "express";
import { getAllPoliticians, registerPolitician } from "../controllers/politicians"


const router = Router();

router.get("/", getAllPoliticians);

router.post("/register", registerPolitician);

export default router