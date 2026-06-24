import axios from 'axios'
import type { Character, CreateOrderRequest, CreateOrderResponse, Order, Product, ProductFilters, Publisher, Team } from './types'

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

const http = axios.create({ baseURL: BASE_URL })

// Attach Clerk session token when available (no-op in tests / unauthenticated)
http.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined' && (window as any).Clerk?.session) {
    try {
      const token = await (window as any).Clerk.session.getToken()
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      // session expired or unavailable — proceed without token
    }
  }
  return config
})

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

  getPublishers: (): Promise<Publisher[]> =>
    wrap(http.get<Publisher[]>('/publishers').then((r) => r.data)),

  getPublisher: (slug: string): Promise<Publisher> =>
    wrap(http.get<Publisher>(`/publishers/${slug}`).then((r) => r.data)),

  getTeams: (): Promise<Team[]> =>
    wrap(http.get<Team[]>('/teams').then((r) => r.data)),

  getCharacters: (): Promise<Character[]> =>
    wrap(http.get<Character[]>('/characters').then((r) => r.data)),

  createOrder: (body: CreateOrderRequest): Promise<CreateOrderResponse> =>
    wrap(http.post<CreateOrderResponse>('/orders', body).then((r) => r.data)),

  getOrders: (): Promise<Order[]> =>
    wrap(http.get<Order[]>('/orders').then((r) => r.data)),
}
