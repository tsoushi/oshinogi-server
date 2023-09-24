import { RequestHandler } from "express";
import { PrismaClient, Comment, Board } from "@prisma/client";
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
    const id: number = parseInt(req.query.politicianId as string, 10);
    if(isNaN(id)){
        res.json({
            error: "query error",
        });
        return;
    }
    else{
        const board = await prisma.board.findUnique({
            where: {
                politicianId: id
            }
        })
        if(!board){
            res.status(404).json({
                error: "Board not found",
            });
        }
        else{
            try {
                const comments = await prisma.comment.findMany({
                    where: {
                        boardId: board.id
                    }
                })
                const commentResponses = comments.map(makeCommentResponse);
                res.status(200).json({comments: commentResponses});
            } catch (error) {
                console.error("An error occurred:", error);
                res.status(500).json({error: "Internal server error"});
            }
        }
        
    }
}
