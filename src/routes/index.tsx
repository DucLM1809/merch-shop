import { createFileRoute } from '@tanstack/react-router'
import { ProductCatalog } from '../components/ProductCatalog'

export const Route = createFileRoute('/')({ component: ProductCatalog })
