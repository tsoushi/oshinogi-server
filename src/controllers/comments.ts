import { RequestHandler } from "express";
import { PrismaClient, Comment } from "@prisma/client";
import { UserAuthenticatedRequest } from "types/request";

const prisma = new PrismaClient();

const makeCommentResponse = (comment: Comment) => {
    return {
        id: comment.id,
        userId: comment.userId,
        boardId: comment.boardId,
        content: comment.content,
        plusMinus: comment.plusMinus,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    }
}

export const getComment: RequestHandler = async(req, res, next) => {
    const id: number = parseInt(req.params.id, 10);
    if(isNaN(id)){
        res.json({
            error: "paramserror",
        });
        return;
    }
    else{
        const comments = await prisma.comment.findMany({
            where: {
                boardId: id
            }
        })
    }
    

}
