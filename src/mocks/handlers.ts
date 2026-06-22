import { http, HttpResponse } from 'msw'
import type { Product, Publisher, Game } from '../api/types'
import { BASE_URL } from '../api/client'

const games: Game[] = [
  { id: 'lol', slug: 'league-of-legends', name: 'League of Legends', publisherId: 'riot' },
  { id: 'val', slug: 'valorant', name: 'Valorant', publisherId: 'riot' },
  { id: 'cs2', slug: 'cs2', name: 'CS2', publisherId: 'valve' },
]

export const publishers: Publisher[] = [
  {
    id: 'riot',
    slug: 'riot',
    name: 'Riot Games',
    accentColor: '#d13639',
    games: games.filter((g) => g.publisherId === 'riot'),
  },
  {
    id: 'valve',
    slug: 'valve',
    name: 'Valve',
    accentColor: '#1a9fff',
    games: games.filter((g) => g.publisherId === 'valve'),
  },
]

const products: Product[] = [
  {
    id: '1',
    slug: 'faker-jersey',
    name: 'Faker Jersey',
    price: 59.99,
    publisherId: 'riot',
    gameId: 'lol',
    teamId: 't1',
    characterId: 'azir',
    imageUrl: 'https://picsum.photos/seed/faker-jersey/400/400',
  },
  {
    id: '2',
    slug: 'lol-hoodie',
    name: 'League of Legends Hoodie',
    price: 79.99,
    publisherId: 'riot',
    gameId: 'lol',
    imageUrl: 'https://picsum.photos/seed/lol-hoodie/400/400',
  },
  {
    id: '3',
    slug: 'valorant-team-jersey',
    name: 'Valorant Team Jersey',
    price: 54.99,
    publisherId: 'riot',
    gameId: 'val',
    imageUrl: 'https://picsum.photos/seed/valorant-jersey/400/400',
  },
  {
    id: '4',
    slug: 'cs2-team-jersey',
    name: 'CS2 Team Jersey',
    price: 49.99,
    publisherId: 'valve',
    gameId: 'cs2',
    imageUrl: 'https://picsum.photos/seed/cs2-jersey/400/400',
  },
]

export const handlers = [
  http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(publishers)),

  http.get(`${BASE_URL}/publishers/:slug`, ({ params }) => {
    const pub = publishers.find((p) => p.slug === params.slug)
    if (!pub) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(pub)
  }),

  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url)
    const publisher = url.searchParams.get('publisher')
    const game = url.searchParams.get('game')
    const gameSlug = url.searchParams.get('gameSlug')
    const team = url.searchParams.get('team')
    const character = url.searchParams.get('character')

    const gameBySlug = gameSlug ? games.find((g) => g.slug === gameSlug) : null

    const filtered = products.filter(
      (p) =>
        (!publisher || p.publisherId === publisher) &&
        (!game || p.gameId === game) &&
        (!gameBySlug || p.gameId === gameBySlug.id) &&
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
