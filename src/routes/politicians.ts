import { Router } from "express";
import {
    getAllPoliticians,
    getPolitician,
    registerPolitician,
} from "../controllers/politicians";

const router = Router();

router.get("/", getAllPoliticians);

router.post("/register", registerPolitician);

router.get("/:id", getPolitician);

export default router;
