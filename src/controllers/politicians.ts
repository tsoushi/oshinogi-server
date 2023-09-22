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

//registerPolitician
export const registerPolitician: RequestHandler = async (req, res, next) => {
    // 必須フィールドである name を取得
    const { name } = req.body;
    // name フィールドの存在を確認
    if (!name) {
        res.status(400).json({ error: 'name is a required field' });
        return;
    }
    const { description = '', imageURL = '' } = req.body;
    
      // データをデータベースに追加
      try {
        const politician = await prisma.politician.create({
            data: {
                name: name,
                description: description,
                imageURL: imageURL,
            }
        });

        res.status(201).json({ politician: makePoliticianResponse(politician) });
    } catch (error) {
        console.error('Error creating politician:', error);
        res.status(500).json({ error: 'An error occurred while creating the politician' });
    }
};
