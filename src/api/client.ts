import axios from 'axios'
import type { Product, ProductFilters } from './types'

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

const http = axios.create({ baseURL: BASE_URL })

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function wrap<T>(promise: Promise<T>): Promise<T> {
  return promise.catch((err) => {
    if (axios.isAxiosError(err) && err.response) {
      throw new ApiError(err.response.status, err.message)
    }
    throw err
  })
}

export const client = {
  getProducts: (filters?: ProductFilters): Promise<Product[]> =>
    wrap(http.get<Product[]>('/products', { params: filters }).then((r) => r.data)),

  getProduct: (slug: string): Promise<Product> =>
    wrap(http.get<Product>(`/products/${slug}`).then((r) => r.data)),
}
