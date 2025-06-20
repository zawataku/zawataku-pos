import prisma from '@/lib/prisma';
import PosSystem from '@/components/PosSystem';

// ルートページ (POSレジ画面)
export default async function HomePage() {
  // サーバーサイドでデータベースから全ての商品を取得
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc', // 新しい順に並べる
    },
  });

  // クライアントコンポーネントに商品リストを渡して描画
  return <PosSystem products={products} />;
}