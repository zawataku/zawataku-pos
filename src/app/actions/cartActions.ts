'use server';

import prisma from '@/lib/prisma';
import type { Product } from '@prisma/client';

// カートアイテムの型定義
interface CartItem extends Product {
    quantity: number;
}

/**
 * 指定されたセッションIDのカート情報を更新/作成するServer Action
 * @param sessionId 一意のセッションID
 * @param items カート内の商品配列
 * @param total 合計金額
 */
export async function updateSessionCart(
    sessionId: string,
    items: CartItem[],
    total: number
) {
    if (!sessionId) return;

    await prisma.sessionCart.upsert({
        where: { id: sessionId },
        update: {
            items: items as never,
            total,
        },
        create: {
            id: sessionId,
            items: items as never,
            total,
        },
    });
}
