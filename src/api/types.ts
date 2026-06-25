export type SKU = {
  id: string
  price: number
  available: boolean
  size?: string
  color?: string
  edition?: string
}

export type Product = {
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

export type Game = {
  id: string
  slug: string
  name: string
  publisherId: string
}

export type Publisher = {
  id: string
  slug: string
  name: string
  logoUrl?: string
  accentColor: string
  games: Game[]
}

export type Team = {
  id: string
  slug: string
  name: string
  gameId: string
}

export type Character = {
  id: string
  slug: string
  name: string
  gameId: string
}

export type ProductFilters = {
  publisher?: string
  game?: string
  gameSlug?: string
  team?: string
  character?: string
}

export type ShippingAddress = {
  fullName: string
  email: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type OrderLine = {
  skuId: string
  productName: string
  variant: string
  price: number
  quantity: number
}

export type CreateOrderRequest = {
  shipping: ShippingAddress
  lines: OrderLine[]
}

export type CreateOrderResponse = {
  orderId: string
  clientSecret: string
}

export type Order = {
  id: string
  lines: OrderLine[]
  shipping: ShippingAddress
  total: number
  createdAt: string
}

export type ServerCartItem = {
  skuId: string
  quantity: number
}

export type ServerCart = {
  id: string
  items: ServerCartItem[]
}

export type PaymentIntentResponse = {
  clientSecret: string
}
