import express, { Request, Response, NextFunction} from 'express';
import userRoutes  from "./routes/users";


const app = express();


app.use("/users", userRoutes);
app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {//エラーハンドリングミドルウェア
    res.status(500).json({message: err.message});
});


app.listen(8000, () => {
    console.log('Server is running on port 8000');
});