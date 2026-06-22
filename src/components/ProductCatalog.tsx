import { useQuery } from '@tanstack/react-query'
import { client } from '../api/client'

export function ProductCatalog() {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => client.getProducts(),
  })

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-800" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8">
        <p className="text-red-400">Failed to load products. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <a
            key={product.id}
            href={`/products/${product.slug}`}
            className="group rounded-lg border border-gray-700 bg-gray-900 p-4 transition hover:border-gray-500"
          >
            <div className="mb-4 h-48 rounded bg-gray-800">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full rounded object-cover"
                />
              )}
            </div>
            <h2 className="font-semibold text-white group-hover:text-gray-200">
              {product.name}
            </h2>
            <p className="mt-1 text-gray-400">${product.price.toFixed(2)}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
