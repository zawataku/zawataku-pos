import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
    var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // 開発環境では、グローバルオブジェクトにインスタンスがなければ作成
    // これにより、ホットリロードでインスタンスが増え続けるのを防ぐ
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;