import { createFileRoute } from '@tanstack/react-router'
import { ProductDetail } from '../components/ProductDetail'

export const Route = createFileRoute('/$publisherSlug/$gameSlug/products/$productSlug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { productSlug } = Route.useParams()
  return <ProductDetail productSlug={productSlug} />
}
