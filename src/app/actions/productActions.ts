'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * 新しい商品をデータベースに作成するServer Action
 * @param formData - フォームから送信されたデータ
 */
export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const imageUrl = formData.get('imageUrl') as string;

    // バリデーション
    if (!name || !price) {
        throw new Error('商品名と価格は必須です。');
    }

    // 新しい商品を作成
    await prisma.product.create({
        data: {
            name: name,
            price: parseInt(price, 10), // 文字列を数値に変換
            imageUrl: imageUrl || null, // 空文字の場合はnullを保存
        },
    });
    revalidatePath('/edit');
}

/**
 * 指定されたIDの商品を削除するServer Action
 * @param id - 削除する商品のID
 */
export async function deleteProduct(id: number) {
    await prisma.product.delete({
        where: {
            id: id,
        },
    });
    revalidatePath('/edit');
}
