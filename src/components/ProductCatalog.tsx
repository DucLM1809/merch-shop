import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { client } from '../api/client'
import type { Product, ProductFilters } from '../api/types'
import { ProductCatalogView } from './ui/ProductCatalogView'

interface Props {
  filters?: ProductFilters
  renderLink?: (product: Product, children: ReactNode) => ReactNode
}

export function ProductCatalog({ filters, renderLink }: Props = {}) {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => client.getProducts(filters),
  })

  return (
    <ProductCatalogView
      products={products}
      isLoading={isLoading}
      isError={isError}
      renderLink={renderLink}
    />
  )
}
