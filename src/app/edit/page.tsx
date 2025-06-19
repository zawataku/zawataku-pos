import prisma from '@/lib/prisma';
import ProductEditor from '@/components/ProductEditor';

// 商品管理ページ
export default async function EditPage() {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return <ProductEditor products={products} />;
}
