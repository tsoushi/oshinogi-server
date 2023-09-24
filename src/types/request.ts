import { User } from "@prisma/client";
import { Request } from "express";

export type UserAuthenticatedRequest = Request & {
    user?: User;
};
