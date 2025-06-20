import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// APIルートのキャッシュを無効化
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session');

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    try {
        const sessionCart = await prisma.sessionCart.findUnique({
            where: { id: sessionId },
        });

        if (!sessionCart) {
            return NextResponse.json({ cart: [], total: 0 });
        }

        return NextResponse.json({
            cart: sessionCart.items,
            total: sessionCart.total,
        });
    } catch (error) {
        console.error('Failed to fetch cart data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
