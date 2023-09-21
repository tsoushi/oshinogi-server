import { Router } from "express";
import { getAllUser, registerUser } from "../controllers/users";
import express from 'express';


const router = Router();

router.use(express.json())

router.get("/", getAllUser);

router.post("/register", registerUser);

//router.post("/login", loginUser);

export default router