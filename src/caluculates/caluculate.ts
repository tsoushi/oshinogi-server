import { PrismaClient, Politician, Comment, Board } from "@prisma/client";

const prisma = new PrismaClient();

export const plusLevel = async(boardId: number) => {
    const board = await prisma.board.findUnique({
        where: {
            id: boardId
        }
    });
    
    if(board){
        const politicianId: number | null = board?.politicianId;
        if (politicianId !== null) {
            const politician = await prisma.politician.findUnique({
              where: {
                id: politicianId,
              },
            });

            if (politician) {
                // レベルアップの基本値
                const baseLevelUp = 1;

                // レベルに対する上昇率の調整
                const maxLevel = 100; // レベルが100に達すると上昇がほぼ停止
                const levelDifference = maxLevel - politician.level;
                const levelUpRate = Math.max(0.1, levelDifference / maxLevel); // 最低でも0.1の上昇率

                // レベルアップを適用
                const newLevel = politician.level + baseLevelUp * levelUpRate;

                 // 更新後のレベルを適用
                const updatePolitician: Politician = await prisma.politician.update({
                    where: {
                        id: politicianId,
                    },
                    data: {
                        level: newLevel,
                    },
                })

                return updatePolitician;
            }
        }
    }
}

export const minusLevel = async (boardId: number) => {
    const board = await prisma.board.findUnique({
        where: {
            id: boardId,
        },
    });
  
    if (board) {
        const politicianId: number | null = board.politicianId;
        if (politicianId !== null) {
            const politician = await prisma.politician.findUnique({
                where: {
                    id: politicianId,
                },
            });
  
            if (politician) {
                // レベルダウンの基本値
                const baseLevelDown = 1;
    
                // レベルに対する下降率の調整
                const minLevel = 1; // レベルが1に近づくと下降がほぼ停止
                const levelDifference = politician.level - minLevel;
                const levelDownRate = Math.max(0.1, levelDifference / politician.level); // 最低でも0.1の下降率
    
                // レベルダウンを適用
                const newLevel = politician.level - baseLevelDown * levelDownRate;
    
                // レベルが1未満にならないように調整
                const finalLevel = Math.max(newLevel, minLevel);
    
                // 更新後のレベルを適用
                const updatePolitician: Politician = await prisma.politician.update({
                    where: {
                        id: politicianId,
                    },
                    data: {
                        level: finalLevel,
                    },
                });
                return updatePolitician;
            }
        }
    }
};