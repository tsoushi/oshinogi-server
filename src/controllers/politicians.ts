import express, { RequestHandler} from 'express';
import { PrismaClient, Politician } from "@prisma/client";


const prisma = new PrismaClient();


const makePoliticianResponse = (politician: Politician) => {
    return {
        id: politician.id,
        name: politician.name,
        description: politician.description,
        imageURL: politician.imageURL,
        level: politician.level,
        createdAt: politician.createdAt,
        updatedAt: politician.updatedAt
    }
}

//getAllPoliticians
export const getAllPoliticians: RequestHandler = async (req, res, next) => {
    const politicians = await prisma.politician.findMany()
    const politicianResponses = politicians.map(makePoliticianResponse)
    res.status(200).json({ politicians: politicianResponses })
}
