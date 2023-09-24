import express, { RequestHandler } from "express";
import { PrismaClient, Politician, Board } from "@prisma/client";

const prisma = new PrismaClient();

const makePoliticianResponse = (politician: Politician) => {
    return {
        id: politician.id,
        name: politician.name,
        description: politician.description,
        imageURL: politician.imageURL,
        level: politician.level,
        createdAt: politician.createdAt,
        updatedAt: politician.updatedAt,
    };
};

//getAllPoliticians
export const getAllPoliticians: RequestHandler = async (req, res, next) => {
    const politicians = await prisma.politician.findMany();
    const politicianResponses = politicians.map(makePoliticianResponse);
    res.status(200).json({ politicians: politicianResponses });
};

//registerPolitician
type RegisterArgs = {
    name: string;
    description: string;
    imageURL: string;
};

const isRegisterArgs = (value: unknown): value is RegisterArgs => {
    const v = value as RegisterArgs;
    return (
        typeof v?.name === "string" &&
        typeof v?.description === "string" &&
        typeof v?.imageURL === "string"
    );
};

export const registerPolitician: RequestHandler = async (req, res, next) => {
    if (!isRegisterArgs(req.body)) {
        res.json({
            error: "invalid argment",
        });
        return;
    }

    // データをデータベースに追加
    try {
        const politician = await prisma.politician.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                imageURL: req.body.imageURL,
                level: 1,
            },
        });

        // PoliticianのIDを取得
        const politicianId = politician.id;

        const board = await prisma.board.create({
            data: {
                politicianId: politicianId,
            },
        });

        res.status(201).json({
            politician: makePoliticianResponse(politician),
        });
    } catch (error) {
        console.error("Error creating politician:", error);
        res.status(500).json({
            error: "An error occurred while creating the politician",
        });
    }
};

//特定の議員の取得
export const getPolitician: RequestHandler = async (req, res, next) => {
    const id: number = parseInt(req.params.id, 10); //paramsはstringらしいです。
    if (isNaN(id)) {
        res.json({
            error: "paramserror",
        });
        return;
    } else {
        try {
            const politician = await prisma.politician.findUnique({
                where: {
                    id: id,
                },
            });
            if (!politician) {
                res.status(404).json({
                    error: "Politician not found",
                });
            } else {
                res.status(200).json(politician);
            }
        } catch (error) {
            console.error("Error fetching politician:", error);
            res.status(500).json({
                error: "Internal server error",
            });
        }
    }
};
