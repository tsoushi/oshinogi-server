import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import jwt from 'jsonwebtoken'
import { UserAuthenticatedRequest } from "types/request";

const prisma = new PrismaClient()

type UserClaim = {
    user: {
        id: number
    }
}

const isUserClaim = (value: unknown): value is UserClaim => {
    const v = value as UserClaim

    return (
        typeof v?.user?.id === 'number'
    )
}

export const authenticateUser: RequestHandler = async (req, res, next) => {
    if (typeof req.headers.authorization === "undefined") {
        res.send('authentication error')
        return
    }

    // `Bearer `を除外
    const token = req.headers.authorization.substring(7)

    const jwtSecret: string = typeof process.env.JWT_SECRET === 'string' ? process.env.JWT_SECRET : "VeryStrongPassword"

    let claim: string | jwt.JwtPayload
    try {
        claim = jwt.verify(token, jwtSecret)
    } catch (error) {
        res.send(error)
        return
    }

    if (!isUserClaim(claim)) {
        res.send('authentication error')
        return
    }

    const user = await prisma.user.findUnique({
        where: {
            id: claim.user.id
        }
    })
    if (user === null) {
        res.send('authentication error')
        return
    }

    const ureq = req as UserAuthenticatedRequest

    ureq.user = user

    next()
}