import express, { RequestHandler } from "express";
import { PrismaClient, Politician, Board } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserAuthenticatedRequest } from "types/request";

const prisma = new PrismaClient();

type LoginArgs = {
    name: string;
    password: string;
};

const isLoginArgs = (value: unknown): value is LoginArgs => {
    const v = value as LoginArgs;

    return typeof v?.name === "string" && typeof v?.password === "string";
};

export const login: RequestHandler = async (req, res, next) => {
    if (!isLoginArgs(req.body)) {
        res.json({ error: "invalid args" });
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            name: req.body.name,
        },
    });

    if (user === null) {
        res.json({ error: "user is not exists" });
        return;
    }

    if (!bcrypt.compareSync(req.body.password, user.hashedPassword)) {
        res.json({ error: "password is incorrect" });
    }

    // JWT生成
    const jwtSecret: string =
        typeof process.env.JWT_SECRET === "string"
            ? process.env.JWT_SECRET
            : "VeryStrongPassword";

    const token = jwt.sign({ user: { id: user.id } }, jwtSecret, {
        algorithm: "HS256",
        expiresIn: "1h",
    });

    res.json({ token });
};
