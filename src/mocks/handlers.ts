import { http, HttpResponse } from 'msw'
import type { Product } from '../api/types'
import { BASE_URL } from '../api/client'

const products: Product[] = [
  {
    id: '1',
    slug: 'faker-jersey',
    name: "Faker Jersey",
    price: 59.99,
    publisherId: 'riot',
    gameId: 'lol',
    teamId: 't1',
    characterId: 'azir',
  },
  {
    id: '2',
    slug: 'lol-hoodie',
    name: 'League of Legends Hoodie',
    price: 79.99,
    publisherId: 'riot',
    gameId: 'lol',
  },
]

export const handlers = [
  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url)
    const game = url.searchParams.get('game')
    const team = url.searchParams.get('team')
    const character = url.searchParams.get('character')

    const filtered = products.filter(
      (p) =>
        (!game || p.gameId === game) &&
        (!team || p.teamId === team) &&
        (!character || p.characterId === character),
    )
    return HttpResponse.json(filtered)
  }),

  http.get(`${BASE_URL}/products/:slug`, ({ params }) => {
    const product = products.find((p) => p.slug === params.slug)
    if (!product) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(product)
  }),
]
