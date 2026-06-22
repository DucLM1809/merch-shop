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
  gameId: string
  teamId?: string
  characterId?: string
  skus?: SKU[]
}

export interface ProductFilters {
  game?: string
  team?: string
  character?: string
}
