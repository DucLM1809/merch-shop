import { useQuery } from '@tanstack/react-query'
import { client } from '../api/client'
import type { Product, ProductFilters } from '../api/types'
import { ProductCatalogView } from './ui/ProductCatalogView'

interface Props {
  filters?: ProductFilters
  getProductHref?: (product: Product) => string
}

export function ProductCatalog({ filters, getProductHref }: Props = {}) {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => client.getProducts(filters),
  })

  return (
    <ProductCatalogView
      products={products}
      isLoading={isLoading}
      isError={isError}
      getProductHref={getProductHref}
    />
  )
}
