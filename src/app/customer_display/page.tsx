'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

async function fetchCartData(sessionId: string) {
    const res = await fetch(`/api/cart?session=${sessionId}`, { cache: 'no-store' });
    if (!res.ok) {
        // console.error('Failed to fetch cart data');
        return null;
    }
    return res.json();
}

export default function CustomerDisplayPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session');

    useEffect(() => {
        if (!sessionId) return;

        const intervalId = setInterval(async () => {
            const data = await fetchCartData(sessionId);
            if (data) {
                setCart(data.cart || []);
                setTotal(data.total || 0);
            }
        }, 500);

        return () => clearInterval(intervalId);
    }, [sessionId]);

    if (!sessionId) {
        return (
            <div className="bg-gray-900 text-white min-h-screen p-8 flex items-center justify-center">
                <h1 className="text-2xl">無効なセッションです。レジ画面のQRコードを読み取ってください。</h1>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8 flex flex-col">
            <h1 className="text-4xl font-bold text-center mb-8">お会計</h1>
            <div className="flex-grow bg-gray-800 rounded-lg p-6 text-2xl">
                {cart.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400">商品をお待ちしております</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-600">
                        {cart.map((item) => (
                            <li key={item.id} className="py-4 flex justify-between">
                                <span>
                                    {item.name} <span className="text-gray-400 text-xl">x{item.quantity}</span>
                                </span>
                                <span>¥{(item.price * item.quantity).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="mt-8 pt-6 border-t-2 border-gray-600">
                <div className="flex justify-between items-baseline text-6xl font-bold">
                    <span className="text-4xl">合計</span>
                    <span>¥{total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
