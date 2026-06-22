import { useQuery } from '@tanstack/react-query'
import { client } from '../api/client'
import type { ProductFilters } from '../api/types'
import { ProductCatalogView } from './ui/ProductCatalogView'

interface Props {
  filters?: ProductFilters
}

export function ProductCatalog({ filters }: Props = {}) {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => client.getProducts(filters),
  })

  return (
    <ProductCatalogView
      products={products}
      isLoading={isLoading}
      isError={isError}
    />
  )
}
