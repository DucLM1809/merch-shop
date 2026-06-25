import type { JSX, ReactNode } from 'react'

import type { Product, ProductFilters } from '@/api/types'
import { ProductCatalogView } from './ProductCatalogView'

import { useProducts } from '../hooks'

type Props = {
  filters?: ProductFilters
  renderLink?: (product: Product, children: ReactNode) => ReactNode
}

export function ProductCatalog({ filters, renderLink }: Props = {}): JSX.Element {
  const { data: products, isLoading, isError } = useProducts(filters)

  return (
    <ProductCatalogView
      products={products}
      isLoading={isLoading}
      isError={isError}
      renderLink={renderLink}
    />
  )
}
