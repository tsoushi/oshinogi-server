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

//getComment
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

//postComment
type RegisterArgs = {
    content: string;
}

const isRegisterArgs = (value: unknown): value is RegisterArgs => {
    const v = value as RegisterArgs;
    return typeof v?.content === "string" 
};

export const postComment: RequestHandler = async (req, res, next) => {
    const ureq = req as UserAuthenticatedRequest;

    if (typeof ureq.user === "undefined") {
        throw Error("not authenticated");
    }

    if (!isRegisterArgs(req.body)) {
        res.json({
            error: "invalid argment",
        });
        return;
    }

    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({
            error: "params error",
        });
        return;
    }
    else{
        try {
            const comment = await prisma.comment.create({
                data: {
                    userId: ureq.user.id,
                    boardId: id,
                    content: req.body.content,
                    plusMinus: 0
                }
            });
            res.status(201).json({comment: makeCommentResponse(comment)});
        } catch (error) {
            console.log("Cannot create comment")
            res.status(500).json({error: "コメントの作成ができませんでした"})
        }
    }
}

//plusComment
export const plusComment: RequestHandler = async (req, res, next) => {
    const ureq = req as UserAuthenticatedRequest;

    if (typeof ureq.user === "undefined") {
        throw Error("not authenticated");
    }

    const id: number = parseInt(req.body.commentId);

    if (isNaN(id)) {
        res.status(400).json({
            error: "parse error",
        });
        return;
    }

    try {
        const updateComment = await prisma.comment.update({
            where: {
                id: id,
            },
            data: {
                plusMinus: {
                    increment: 1, // plusMinusフィールドを+1する
                },
            },
        });

        res.status(200).json({
            comment: makeCommentResponse(updateComment),
        });
    } catch (error) {
        console.log("Cannot plus");
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
};

//minusComment
export const minusComment: RequestHandler = async (req, res, next) => {
    const ureq = req as UserAuthenticatedRequest;

    if (typeof ureq.user === "undefined") {
        throw Error("not authenticated");
    }

    const id: number = parseInt(req.body.commentId);

    if (isNaN(id)) {
        res.status(400).json({
            error: "parse error",
        });
        return;
    }

    try {
        const updateComment = await prisma.comment.update({
            where: {
                id: id,
            },
            data: {
                plusMinus: {
                    decrement: 1, // plusMinusフィールドを-1する
                },
            },
        });

        res.status(200).json({
            comment: makeCommentResponse(updateComment),
        });
    } catch (error) {
        console.log("Cannot minus");
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
};



