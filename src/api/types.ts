export interface SKU {
  id: string
  price: number
  available: boolean
  size?: string
  color?: string
  edition?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description?: string
  imageUrl?: string
  price: number
  publisherId: string
  publisherSlug: string
  accentColor?: string
  gameId: string
  gameSlug: string
  teamId?: string
  characterId?: string
  skus?: SKU[]
}

export interface Game {
  id: string
  slug: string
  name: string
  publisherId: string
}

export interface Publisher {
  id: string
  slug: string
  name: string
  logoUrl?: string
  accentColor: string
  games: Game[]
}

export interface Team {
  id: string
  slug: string
  name: string
  gameId: string
}

export interface Character {
  id: string
  slug: string
  name: string
  gameId: string
}

export interface ProductFilters {
  publisher?: string
  game?: string
  gameSlug?: string
  team?: string
  character?: string
}

export interface ShippingAddress {
  fullName: string
  email: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderLine {
  skuId: string
  productName: string
  variant: string
  price: number
  quantity: number
}

export interface CreateOrderRequest {
  shipping: ShippingAddress
  lines: OrderLine[]
}

export interface CreateOrderResponse {
  orderId: string
  clientSecret: string
}

export interface Order {
  id: string
  lines: OrderLine[]
  shipping: ShippingAddress
  total: number
  createdAt: string
}
