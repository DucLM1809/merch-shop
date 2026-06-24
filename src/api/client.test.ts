import { describe, it, expect, vi, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { client, BASE_URL } from './client'

describe('API client', () => {
  it('fetches product list', async () => {
    const products = await client.getProducts()
    expect(products).toHaveLength(6)
    expect(products[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
    })
  })

  it('filters products by facets', async () => {
    const products = await client.getProducts({ team: 't1' })
    expect(products).toHaveLength(1)
    expect(products[0]?.teamId).toBe('t1')
  })

  it('fetches a single product by slug', async () => {
    const product = await client.getProduct('faker-jersey')
    expect(product).toMatchObject({ id: '1', slug: 'faker-jersey', name: "Faker Jersey" })
  })

  it('throws ApiError on server error', async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () =>
        new HttpResponse(null, { status: 500 }),
      ),
    )
    await expect(client.getProducts()).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
    })
  })
})

describe('API client - Bearer token', () => {
  afterEach(() => {
    delete (window as any).Clerk
  })

  it('attaches Bearer token when window.Clerk session is active', async () => {
    const mockToken = 'test-clerk-token-xyz'
    let capturedAuth: string | null = null

    ;(window as any).Clerk = {
      session: { getToken: vi.fn().mockResolvedValue(mockToken) },
    }

    server.use(
      http.get(`${BASE_URL}/products`, ({ request }) => {
        capturedAuth = request.headers.get('Authorization')
        return HttpResponse.json([])
      }),
    )

    await client.getProducts()

    expect(capturedAuth).toBe(`Bearer ${mockToken}`)
  })

  it('sends request without Authorization header when not signed in', async () => {
    let capturedAuth: string | null = 'not-set'

    server.use(
      http.get(`${BASE_URL}/products`, ({ request }) => {
        capturedAuth = request.headers.get('Authorization')
        return HttpResponse.json([])
      }),
    )

    await client.getProducts()

    expect(capturedAuth).toBeNull()
  })
})
