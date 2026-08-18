# Graph Report - merch-shop  (2026-08-18)

## Corpus Check
- 183 files · ~38,836 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 695 nodes · 1621 edges · 52 communities (31 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6210a12f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Routes & Page Containers
- HTTP Client & API Types
- Catalog Browse Components
- Cart View & Stories
- Publisher Nav UI
- Catalog View Tests
- Product Detail View
- Account & Auth UI
- Product Catalog View
- Orders Module
- Facet Filter Stories
- App Shell & Theme
- Checkout Form Stories
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- verify-email.tsx
- order-confirmation.tsx
- Route
- Route
- account.orders.lazy.tsx
- Route
- Route
- Route
- Route
- Route
- Route
- Route
- Route
- $publisherSlug.$gameSlug.lazy.tsx
- $publisherSlug.lazy.tsx
- Route

## God Nodes (most connected - your core abstractions)
1. `FileRoutesByPath` - 28 edges
2. `renderRoute()` - 23 edges
3. `server` - 18 edges
4. `useAuth()` - 17 edges
5. `renderWithProviders()` - 16 edges
6. `FormField()` - 14 edges
7. `mockSignedIn()` - 14 edges
8. `envelope()` - 13 edges
9. `Product` - 12 edges
10. `buyerAccount` - 12 edges

## Surprising Connections (you probably didn't know these)
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductDetailView.tsx → src/api/types.ts
- `OrderDetailPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/modules/orders/components/OrderDetailPage.tsx → src/modules/account/hooks/index.ts

## Import Cycles
- None detected.

## Communities (52 total, 21 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.07
Nodes (34): ORDER_STATUSES, OrderStatus, mockOrders, AdminOrdersView(), COL_FLEX, COLS, fmtDate(), Props (+26 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.10
Nodes (17): NavDrawerContent(), NavDrawerContentProps, FacetFilterView(), FacetGroupProps, characters, games, GameSelected, MultipleActive (+9 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.08
Nodes (31): CartPage(), CartView(), Props, Empty, items, MultipleItems, SingleItem, Story (+23 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.09
Nodes (33): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeSku(), parseDecimal(), RetryableConfig (+25 more)

### Community 6 - "Product Detail View"
Cohesion: 0.05
Nodes (52): refreshAccessToken(), GlobalNav(), env, mockAccount, AuthPageView(), Props, SignIn, SignUp (+44 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.09
Nodes (24): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+16 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.05
Nodes (40): accountAccountOrdersIndexRoute, accountAccountOrdersOrderIdRoute, accountAccountOrdersRoute, accountAccountOrdersRouteChildren, accountAccountOrdersRouteWithChildren, adminAdminCharactersRoute, adminAdminGamesRoute, adminAdminOrdersRoute (+32 more)

### Community 9 - "Orders Module"
Cohesion: 0.14
Nodes (17): ProductFilters, FacetFilter(), ProductCatalog(), Props, ProductDetail(), Props, catalogKeys, productQueryOptions() (+9 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.25
Nodes (14): adminAccount, buyerAccount, mockSignedIn(), envelope(), server, twoOrders, testOrder, mockGames (+6 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.14
Nodes (15): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, Empty, mockRegister, PaymentDeclined (+7 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.10
Nodes (19): Account, ResetPasswordDto, ServerCart, VerifyEmailDto, worker, characters, games, handlers (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (10): GamePage(), Props, NavLink, Props, PublisherNav(), Props, PublisherPage(), usePublisher() (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (13): Route, Route, Route, Route, Route, Route, Route, Route (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (11): mockPublishers, Loaded, Loading, meta, Story, PublisherPageView(), PublisherPageViewProps, Loaded (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (10): META, MOCK_PRODUCTS, Order, PaginationMeta, RawProduct, RawPublisher, buildSitemapResponse(), MOCK_GAMES (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.27
Nodes (11): CreateSkuDto, SkuFacet, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability() (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (8): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route

### Community 19 - "Community 19"
Cohesion: 0.27
Nodes (7): Product, buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps, ProductCatalogView(), ProductCatalogViewProps, products

### Community 20 - "Community 20"
Cohesion: 0.26
Nodes (9): AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam(), useDeleteTeam(), useUpdateTeam() (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.20
Nodes (8): PublisherNavView(), PublisherNavViewProps, Default, GameActive, Loading, meta, PublisherActive, Story

### Community 22 - "Community 22"
Cohesion: 0.31
Nodes (9): AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame(), useUpdateGame() (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (8): AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter(), useDeleteCharacter(), useUpdateCharacter()

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (8): AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct(), useDeleteProduct(), useUpdateProduct()

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (6): SKU, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, product, uniqueValues()

### Community 26 - "Community 26"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (7): Default, Empty, Loading, meta, NoImages, sampleProducts, Story

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (6): Character, Game, Team, FacetFilterViewProps, mockGames, twoTeams

### Community 29 - "Community 29"
Cohesion: 0.38
Nodes (4): Props, QueryError(), GamePageView(), GamePageViewProps

### Community 30 - "Community 30"
Cohesion: 0.43
Nodes (6): BreadcrumbItem, breadcrumbJsonLd(), buildGameHeadMeta(), buildProductHeadMeta(), GameHeadParams, slugToTitle()

### Community 31 - "Community 31"
Cohesion: 0.40
Nodes (4): Publisher, mockGames, mockPublishers, twoProducts

## Knowledge Gaps
- **219 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `FormField()` connect `Account & Auth UI` to `Product Detail View`, `App Shell & Theme`, `Community 17`, `Community 20`, `Community 22`, `Community 23`, `Community 24`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Product Detail View` to `HTTP Client & API Types`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `client` connect `Community 32` to `HTTP Client & API Types`, `Cart View & Stories`, `Publisher Nav UI`, `Product Detail View`, `Orders Module`, `App Shell & Theme`, `Community 16`, `Community 17`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.07215686274509804 - nodes in this community are weakly interconnected._
- **Should `Catalog Browse Components` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.08181818181818182 - nodes in this community are weakly interconnected._