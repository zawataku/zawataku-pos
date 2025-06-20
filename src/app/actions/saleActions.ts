'use server';

import prisma from '@/lib/prisma';
import type { Product } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * 売上情報をデータベースに保存するServer Action
 * @param items - 売れた商品の配列
 * @param total - 売上合計金額
 */
export async function createSale(items: Product[], total: number) {
    if (items.length === 0 || total <= 0) {
        throw new Error('決済する商品がありません。');
    }

    // データベースに売上履歴を作成
    await prisma.sale.create({
        data: {
            items: items,
            total: total,
        },
    });
    revalidatePath('/history');
}
