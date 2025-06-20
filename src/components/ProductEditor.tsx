'use client';

import { useRef, useTransition } from 'react';
import { createProduct, deleteProduct } from '@/app/actions/productActions';
import type { Product } from '@prisma/client';

interface ProductEditorProps {
    products: Product[];
}

// 商品管理ページのUIコンポーネント
export default function ProductEditor({ products }: ProductEditorProps) {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const handleFormSubmit = async (formData: FormData) => {
        startTransition(async () => {
            await createProduct(formData);
            formRef.current?.reset();
        });
    };

    const handleDelete = async (id: number) => {
        if (confirm('この商品を本当に削除しますか？')) {
            startTransition(async () => {
                await deleteProduct(id);
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">商品管理</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">新規商品登録</h2>
                <form ref={formRef} action={handleFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            商品名 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            価格 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                            商品画像URL (任意)
                        </label>
                        <input
                            type="text"
                            id="imageUrl"
                            name="imageUrl"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                    >
                        {isPending ? '登録中...' : '商品を登録する'}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">商品一覧</h2>
                <div className="space-y-4">
                    {products.length === 0 ? (
                        <p className="text-gray-500">商品はまだ登録されていません。</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <li key={product.id} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={product.imageUrl || 'https://placehold.co/64x64/e2e8f0/adb5bd?text=NoImage'}
                                            alt={product.name}
                                            className="w-16 h-16 rounded-md object-cover bg-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://placehold.co/64x64/e2e8f0/adb5bd?text=NoImage';
                                            }}
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">{product.name}</p>
                                            <p className="text-gray-600">¥{product.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={isPending}
                                        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:text-gray-400"
                                    >
                                        削除
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
