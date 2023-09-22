import express, { RequestHandler} from 'express';
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

const makeUserResponse = (user: User) => {
    return {
        id: user.id,
        name: user.name,
        favoritePoliticianId: user.favoritePoliticianId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

// getAllUser

export const getAllUsers: RequestHandler = async (req, res, next) => {
    const users = await prisma.user.findMany()
    const userResponses = users.map(makeUserResponse)
    res.status(200).json({ users: userResponses })
}


// registerUser
type RegisterArgs = {
    name: string,
    password: string,
}
const isRegisterArgs = (value: unknown): value is RegisterArgs => {
    const v = value as RegisterArgs;
    return (
        typeof v?.name === 'string' &&
        typeof v?.password === 'string'
    );
};

export const registerUser: RequestHandler = async (req, res, next) => {
    if (!isRegisterArgs(req.body)) {
        res.json({
            error: 'invalid argment'
        })
        return
    }

    const user = await prisma.user.create({
        data: {
            name: req.body.name,
            hashedPassword: bcrypt.hashSync(req.body.password, 10)
        }
    })

    res.json({ user: makeUserResponse(user) })
}