'use client';

import { useState, useEffect, useTransition, useCallback, useMemo } from 'react';
import type { Product } from '@prisma/client';
import { QRCodeCanvas } from 'qrcode.react';
import { createSale } from '@/app/actions/saleActions';
import { updateSessionCart } from '@/app/actions/cartActions';

interface CartItem extends Product {
    quantity: number;
}

interface PosSystemProps {
    products: Product[];
}

export default function PosSystem({ products }: PosSystemProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isCheckoutPending, startCheckoutTransition] = useTransition();
    const [sessionId, setSessionId] = useState<string>('');

    // コンポーネントマウント時にセッションIDを生成
    useEffect(() => {
        setSessionId(crypto.randomUUID());
    }, []);

    useEffect(() => {
        if (sessionId) {
            updateSessionCart(sessionId, cart, total);
        }
    }, [cart, total, sessionId]);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prevCart) => {
            const targetItem = prevCart.find((item) => item.id === productId);
            if (targetItem && targetItem.quantity > 1) {
                return prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prevCart.filter((item) => item.id !== productId);
        });
    };

    const clearCart = useCallback(() => setCart([]), []);

    useEffect(() => {
        const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(newTotal);
    }, [cart]);

    const handleCheckout = () => {
        if (cart.length === 0) return alert('商品が選択されていません。');
        if (confirm(`合計 ${total.toLocaleString()}円で決済しますか？`)) {
            startCheckoutTransition(async () => {
                try {
                    await createSale(cart, total);
                    alert('決済が完了しました。');
                    clearCart();
                } catch (error) {
                    console.error(error);
                    alert('決済処理中にエラーが発生しました。');
                }
            });
        }
    };

    const customerDisplayUrl = useMemo(() => {
        if (typeof window !== 'undefined' && sessionId) {
            return `${window.location.origin}/customer_display?session=${sessionId}`;
        }
        return '';
    }, [sessionId]);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans">
            {/* 左側: 商品選択エリア */}
            <div className="md:w-3/5 p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">商品一覧</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center justify-between cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200"
                        >
                            <img
                                src={product.imageUrl || 'https://placehold.co/128x128/e2e8f0/adb5bd?text=NoImage'}
                                alt={product.name}
                                className="w-full h-24 object-cover rounded-md mb-2"
                                onError={(e) => { e.currentTarget.src = 'https://placehold.co/128x128/e2e8f0/adb5bd?text=NoImage'; }}
                            />
                            <p className="text-sm font-semibold text-center text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-600 mt-1">¥{product.price.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 右側: カートと決済エリア */}
            <div className="md:w-2/5 bg-white p-6 flex flex-col shadow-lg">
                {customerDisplayUrl && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">カスタマーディスプレイ接続用</h3>
                        <QRCodeCanvas value={customerDisplayUrl} size={128} />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            iPadなどの別端末でこのQRコードを読み取ってください
                        </p>
                    </div>
                )}
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">お会計</h2>
                <div className="flex-grow overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 mt-4 text-center">商品が選択されていません</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {cart.map((item) => (
                                <li key={item.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            ¥{item.price.toLocaleString()} x {item.quantity}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-bold mr-4">
                                            ¥{(item.price * item.quantity).toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-lg"
                                        >
                                            -
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mt-auto pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center text-2xl font-bold mb-4">
                        <span>合計</span>
                        <span>¥{total.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={isCheckoutPending || cart.length === 0}
                        className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                    >
                        {isCheckoutPending ? '処理中...' : '決済する'}
                    </button>
                    <button
                        onClick={clearCart}
                        disabled={isCheckoutPending || cart.length === 0}
                        className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors"
                    >
                        クリア
                    </button>
                </div>
            </div>
        </div>
    );
}
