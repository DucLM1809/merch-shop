# Graph Report - merch-shop  (2026-08-19)

## Corpus Check
- 183 files · ~39,750 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 701 nodes · 1637 edges · 47 communities (28 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `440d9b5c`
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
8. `envelope()` - 14 edges
9. `Product` - 12 edges
10. `buyerAccount` - 12 edges

## Surprising Connections (you probably didn't know these)
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts
- `FacetFilterViewProps` --references--> `Game`  [EXTRACTED]
  src/modules/catalog/components/FacetFilterView.tsx → src/api/types.ts
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `OrderDetailPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/modules/orders/components/OrderDetailPage.tsx → src/modules/account/hooks/index.ts

## Import Cycles
- None detected.

## Communities (47 total, 19 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.07
Nodes (33): ORDER_STATUSES, OrderStatus, AdminOrdersView(), COL_FLEX, COLS, fmtDate(), Props, RETRYABLE_STATUSES (+25 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.22
Nodes (8): characters, games, GameSelected, MultipleActive, NoSelection, Story, teams, TeamSelected

### Community 3 - "Cart View & Stories"
Cohesion: 0.08
Nodes (32): SyncCartItem, CartPage(), CartView(), Props, Empty, items, MultipleItems, SingleItem (+24 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.05
Nodes (54): ApiError, client, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku() (+46 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.23
Nodes (7): mockAccount, Props, VerifyEmailView(), accountKeys, useDeleteAccount(), useVerifyEmail(), Route

### Community 6 - "Product Detail View"
Cohesion: 0.21
Nodes (11): GlobalNav(), NavDrawerContent(), NavDrawerContentProps, useAccount(), useAuth(), useLogout(), AdminGuard(), Route (+3 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.26
Nodes (9): CreatePublisherDto, AdminPublishersView(), DEFAULTS, FormValues, schema, useCreatePublisher(), useDeletePublisher(), useUpdatePublisher() (+1 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.05
Nodes (40): accountAccountOrdersIndexRoute, accountAccountOrdersOrderIdRoute, accountAccountOrdersRoute, accountAccountOrdersRouteChildren, accountAccountOrdersRouteWithChildren, adminAdminCharactersRoute, adminAdminGamesRoute, adminAdminOrdersRoute (+32 more)

### Community 9 - "Orders Module"
Cohesion: 0.07
Nodes (39): ProductFilters, FacetFilter(), FacetFilterView(), characters, games, renderFilter(), teams, GamePage() (+31 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.08
Nodes (45): Account, Game, Order, PaymentIntentResponse, RawProduct, RawProductMutationResponse, RawSku, ServerCart (+37 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.14
Nodes (15): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, Empty, mockRegister, PaymentDeclined (+7 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.18
Nodes (6): AuthPageView(), Props, SignIn, SignUp, Story, Route

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (9): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (12): Route, Route, Route, Route, Route, Route, Route, Route (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.27
Nodes (6): env, AuthBootstrapEffect(), CartSyncEffect(), MyRouterContext, registerHardSignOutHandler(), system

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (6): ForgotPasswordForm(), DEFAULTS, FormValues, schema, useForgotPassword(), Route

### Community 17 - "Community 17"
Cohesion: 0.31
Nodes (10): CreateSkuDto, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability(), useCreateSku() (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (8): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route

### Community 19 - "Community 19"
Cohesion: 0.06
Nodes (36): Product, SKU, buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps, Props, QueryError(), GamePageView() (+28 more)

### Community 20 - "Community 20"
Cohesion: 0.23
Nodes (10): CreateTeamDto, AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam(), useDeleteTeam() (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (16): Publisher, mockPublishers, PublisherNavView(), PublisherNavViewProps, Default, GameActive, Loading, meta (+8 more)

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (9): CreateGameDto, AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame() (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.27
Nodes (10): CreateCharacterDto, AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter(), useDeleteCharacter() (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (9): CreateProductDto, AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct(), useDeleteProduct() (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.39
Nodes (6): Props, ResetPasswordForm(), DEFAULTS, FormValues, schema, useResetPassword()

### Community 26 - "Community 26"
Cohesion: 0.48
Nodes (5): DEFAULTS, FormValues, schema, SignInForm(), useLogin()

### Community 27 - "Community 27"
Cohesion: 0.48
Nodes (5): DEFAULTS, FormValues, schema, SignUpForm(), useRegister()

## Knowledge Gaps
- **219 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `FormField()` connect `Community 13` to `Account & Auth UI`, `Facet Filter Stories`, `App Shell & Theme`, `Community 16`, `Community 17`, `Community 20`, `Community 22`, `Community 23`, `Community 24`, `Community 25`, `Community 26`, `Community 27`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Product Detail View` to `HTTP Client & API Types`, `Publisher Nav UI`, `Catalog View Tests`, `Community 15`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `client` connect `Publisher Nav UI` to `HTTP Client & API Types`, `Cart View & Stories`, `Orders Module`, `App Shell & Theme`, `Community 17`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.07428571428571429 - nodes in this community are weakly interconnected._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.07922705314009662 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.054987212276214836 - nodes in this community are weakly interconnected._