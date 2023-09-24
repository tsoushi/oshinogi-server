import express, { RequestHandler } from "express";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { UserAuthenticatedRequest } from "types/request";

const prisma = new PrismaClient();

const makeUserResponse = (user: User) => {
    return {
        id: user.id,
        name: user.name,
        favoritePoliticianId: user.favoritePoliticianId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

// getAllUser

export const getAllUsers: RequestHandler = async (req, res, next) => {
    const users = await prisma.user.findMany();
    const userResponses = users.map(makeUserResponse);
    res.status(200).json({ users: userResponses });
};

// registerUser
type RegisterArgs = {
    name: string;
    password: string;
};
const isRegisterArgs = (value: unknown): value is RegisterArgs => {
    const v = value as RegisterArgs;
    return typeof v?.name === "string" && typeof v?.password === "string";
};

export const registerUser: RequestHandler = async (req, res, next) => {
    if (!isRegisterArgs(req.body)) {
        res.json({
            error: "invalid argment",
        });
        return;
    }

    const user = await prisma.user.create({
        data: {
            name: req.body.name,
            hashedPassword: bcrypt.hashSync(req.body.password, 10),
        },
    });

    res.json({ user: makeUserResponse(user) });
};

export const getUser: RequestHandler = async (req, res, next) => {
    const ureq = req as UserAuthenticatedRequest;

    if (typeof ureq.user === "undefined") {
        throw Error("not authenticated");
    }

    res.json({ user: makeUserResponse(ureq.user) });
};


//推しの選択
export const selectPolitician: RequestHandler = async (req, res, next) => {
    const ureq = req as UserAuthenticatedRequest;

    if (typeof ureq.user === "undefined") {
        throw Error("not authenticated");
    }
    const favoritePoliticianId: number = parseInt(req.params.id, 10);
    if (isNaN(favoritePoliticianId)) {
        res.json({
            error: "paramserror",
        });
        return;
    }
    else{
        try {
            const updateUser = await prisma.user.update({//ログイン中のユーザーを見つけ出して、推しを登録している
                where: {
                    id: ureq.user.id,
                },
                data: {
                    favoritePoliticianId: favoritePoliticianId
                }
            })
            res.status(200).json({updateUser: makeUserResponse(updateUser)});
        } catch (error) {
            res.status(500).json({ error: "ユーザーの更新中にエラーが発生しました" });
        }
    }
}