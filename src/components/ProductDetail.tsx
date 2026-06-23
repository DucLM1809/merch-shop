import { useQuery } from '@tanstack/react-query'
import { client } from '../api/client'
import { addToCart, formatVariant } from '../store/cart'
import { ProductDetailView } from './ui/ProductDetailView'
import type { SKU } from '../api/types'

interface Props {
  productSlug: string
}

export function ProductDetail({ productSlug }: Props) {
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productSlug],
    queryFn: () => client.getProduct(productSlug),
  })

  function handleAddToCart(sku: SKU) {
    if (!product) return
    addToCart({
      skuId: sku.id,
      productId: product.id,
      productName: product.name,
      variant: formatVariant(sku.size, sku.color, sku.edition),
      price: sku.price,
    })
  }

  return (
    <ProductDetailView
      product={product}
      isLoading={isLoading}
      isError={isError}
      onAddToCart={handleAddToCart}
    />
  )
}
