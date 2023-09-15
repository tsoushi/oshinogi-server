import express, { Request, Response, NextFunction} from 'express';


const app = express();


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({message: err.message});
});

app.listen(8000, '0.0.0.0');