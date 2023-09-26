import { RequestHandler } from "express";
import { PrismaClient, Comment, Politician } from "@prisma/client";
import { UserAuthenticatedRequest } from "types/request";
import { setPlusMinus } from "../caluculates/caluculate";

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
    plusMinus: -1 | 0 | 1;
}

const isRegisterArgs = (value: unknown): value is RegisterArgs => {
    const v = value as RegisterArgs;
    return (
        typeof v?.content === "string" &&
        typeof v?.plusMinus === "number" &&
        (
            v.plusMinus === -1 ||
            v.plusMinus === 0 ||
            v.plusMinus === 1
        )
    )
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

    const boardId: number = parseInt(req.params.id, 10);
    if (isNaN(boardId)) {
        res.status(400).json({
            error: "params error",
        });
        return;
    }

    if (req.body.plusMinus != 0) {
        // 評価付きコメントの投稿制限
        const oneDayAgoDate = new Date()
        oneDayAgoDate.setDate(oneDayAgoDate.getDate() - 1)

        const resentComments = await prisma.comment.findMany({
            take: 3,
            where: {
                boardId: boardId,
                userId: ureq.user.id,
                plusMinus: {
                    not: 0
                },
                createdAt: {
                    gte: oneDayAgoDate
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        if (resentComments.length == 3) {
            res.json({
                error: 'The daily limit for rated comments is 3'
            })
            return
        }
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                userId: ureq.user.id,
                boardId: boardId,
                content: req.body.content,
                plusMinus: req.body.plusMinus
            }
        });
        const updatePolitician: Politician | undefined = await setPlusMinus(comment.boardId,comment.plusMinus);
        res.status(201).json({
            comment: makeCommentResponse(comment),
            politician: updatePolitician
        });
    } catch (error) {
        console.log("Cannot create comment")
        res.status(500).json({error: "コメントの作成ができませんでした"})
    }
}



