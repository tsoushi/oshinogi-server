import { PrismaClient, Politician, Comment, Board } from "@prisma/client";

const prisma = new PrismaClient();

export const setPlusMinus = async(boardId: number, plusMinus: number) => {
    const board = await prisma.board.findUnique({
        where: {
            id: boardId,
        },
    });
    
    if(board){
        const politicianId: number | null = board.politicianId;
        if (politicianId !== null) {
            const politician = await prisma.politician.findUnique({
                where: {
                    id: politicianId,
                },
            });

            if (politician) {
                if(plusMinus == 0){
                    return politician;
                }
                else{
                    const baseChange = (1/politician.level); // レベルの変化基準値

                    const levelChange = baseChange * plusMinus;

                    const newLevel = politician.level + levelChange; // 新しいレベルを計算

                    const finalLevel = Math.max(newLevel, 1); // レベルが1未満にならないように調整

                    // レベルを更新
                    const updatedPolitician = await prisma.politician.update({
                        where: {
                            id: politicianId,
                        },
                        data: {
                            level: finalLevel,
                        },
                    });
                    return updatedPolitician;
                }
            }
        }
    }
}