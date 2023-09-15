import express, { RequestHandler} from 'express';

export const getAllUser: RequestHandler = (req, res, next) => {
    res.status(200).json("取得成功しました");
}