import { useQuery } from '@tanstack/react-query'
import { client } from '../api/client'
import { ProductDetailView } from './ui/ProductDetailView'

interface Props {
  productSlug: string
}

export function ProductDetail({ productSlug }: Props) {
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productSlug],
    queryFn: () => client.getProduct(productSlug),
  })

  return (
    <ProductDetailView
      product={product}
      isLoading={isLoading}
      isError={isError}
    />
  )
}
