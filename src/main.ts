import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/users";
import politicianRoutes from "./routes/politicians";
import auth from "./routes/auth";
import commentRoutes from "./routes/comments";

const app = express();

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )
    next()
})

app.use(express.json());

app.use("/auth", auth);
app.use("/users", userRoutes);
app.use("/politicians", politicianRoutes);
app.use("/comments", commentRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    //エラーハンドリングミドルウェア
    res.status(500).json({ message: err.message });
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
