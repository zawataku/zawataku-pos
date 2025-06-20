import prisma from '@/lib/prisma';
import type { Sale } from '@prisma/client';

// JSONとして保存されている商品情報の型定義
interface SoldItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

// 売上履歴ページ
export default async function HistoryPage() {
    // サーバーサイドでデータベースから全ての売上履歴を取得
    const sales = await prisma.sale.findMany({
        orderBy: {
            createdAt: 'desc', // 販売日時の新しい順に並べる
        },
    });

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">売上履歴</h1>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        販売日時
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        販売商品
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        合計金額
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sales.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                            売上履歴はまだありません。
                                        </td>
                                    </tr>
                                ) : (
                                    sales.map((sale: Sale) => {
                                        const items = sale.items as unknown as SoldItem[]; return (
                                            <tr key={sale.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(sale.createdAt).toLocaleString('ja-JP', { timeZone: "JST" })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <ul className="space-y-1">
                                                        {items.map((item) => (
                                                            <li key={item.id} className="text-sm text-gray-800">
                                                                {item.name} <span className="text-gray-500">x {item.quantity}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        ¥{sale.total.toLocaleString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
