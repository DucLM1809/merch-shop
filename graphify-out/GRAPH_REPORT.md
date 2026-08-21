# Graph Report - merch-shop  (2026-08-21)

## Corpus Check
- 200 files · ~43,621 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 754 nodes · 1804 edges · 51 communities (32 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `957a7e52`
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
- Route
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
- ResetPasswordForm.tsx
- i18next.d.ts
- admin.orders.tsx
- $locale/index.tsx

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 37 edges
2. `FileRoutesByPath` - 30 edges
3. `renderRoute()` - 24 edges
4. `server` - 18 edges
5. `useAuth()` - 17 edges
6. `renderWithProviders()` - 17 edges
7. `envelope()` - 15 edges
8. `FormField()` - 14 edges
9. `mockSignedIn()` - 14 edges
10. `Product` - 12 edges

## Surprising Connections (you probably didn't know these)
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `HomePage()` --calls--> `useLocale()`  [EXTRACTED]
  src/routes/$locale/index.lazy.tsx → src/i18n/useLocale.ts
- `renderFilter()` --calls--> `renderWithProviders()`  [EXTRACTED]
  src/modules/catalog/components/FacetFilterView.test.tsx → src/test-utils.tsx
- `AdminOrdersPage()` --calls--> `useAdminOrders()`  [EXTRACTED]
  src/routes/$locale/(admin)/admin.orders.lazy.tsx → src/modules/orders/hooks/index.ts
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts

## Import Cycles
- None detected.

## Communities (51 total, 19 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.17
Nodes (15): AdminOrdersFilters, mockOrders, OrderDetailPage(), Props, adminOrdersQueryOptions(), orderKeys, useAdminOrders(), useOrder() (+7 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.11
Nodes (17): Character, Team, FacetFilterView(), FacetFilterViewProps, FacetGroupProps, characters, games, GameSelected (+9 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.06
Nodes (38): SyncCartItem, env, CartPage(), CartView(), Props, Empty, items, MultipleItems (+30 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.09
Nodes (28): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+20 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.11
Nodes (23): ADR-0017, getI18n(), instances, readCookie(), readLocaleHints(), redirectToResolvedLocale(), isSupportedLocale(), SUPPORTED_LOCALES (+15 more)

### Community 6 - "Product Detail View"
Cohesion: 0.14
Nodes (11): client, META, MOCK_PRODUCTS, PaginationMeta, RawProduct, RawPublisher, buildSitemapResponse(), Route (+3 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.33
Nodes (8): CreatePublisherDto, AdminPublishersView(), DEFAULTS, FormValues, schema, useCreatePublisher(), useDeletePublisher(), useUpdatePublisher()

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.08
Nodes (31): ProductFilters, GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props, NavLink (+23 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.15
Nodes (21): Game, adminAccount, buyerAccount, mockSignedIn(), envelope(), server, twoOrders, testOrder (+13 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.14
Nodes (16): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, Empty, mockRegister, PaymentDeclined (+8 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.14
Nodes (20): GlobalNav(), NavDrawerContent(), NavDrawerContentProps, useLocale(), useAccount(), useAuth(), useLogout(), AdminLayout() (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (12): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (12): Route, Route, Route, Route, Route, Route, Route, Route (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (15): OrderStatus, AdminOrdersView(), COL_FLEX, COLS, fmtDate(), Props, RETRYABLE_STATUSES, STATUS_COLOR (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (6): ForgotPasswordForm(), DEFAULTS, FormValues, schema, useForgotPassword(), Route

### Community 17 - "Community 17"
Cohesion: 0.24
Nodes (11): CreateSkuDto, SkuFacet, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability() (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (6): Route, Route, Route, Route, Route, Route

### Community 19 - "Community 19"
Cohesion: 0.06
Nodes (36): Product, SKU, buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps, Props, QueryError(), GamePageView() (+28 more)

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (9): CreateTeamDto, AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam(), useDeleteTeam() (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (16): Publisher, mockPublishers, PublisherNavView(), PublisherNavViewProps, Default, GameActive, Loading, meta (+8 more)

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (9): CreateGameDto, AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame() (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.32
Nodes (9): CreateCharacterDto, AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter(), useDeleteCharacter() (+1 more)

### Community 24 - "Community 24"
Cohesion: 0.09
Nodes (22): Order, PaymentIntentResponse, RawOrder, ServerCart, SyncCartResponse, worker, characters, games (+14 more)

### Community 25 - "Community 25"
Cohesion: 0.20
Nodes (11): SignInForm(), DEFAULTS, FormValues, schema, SignUpForm(), Props, VerifyEmailView(), useLogin() (+3 more)

### Community 29 - "Community 29"
Cohesion: 0.25
Nodes (13): AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct(), useDeleteProduct(), useUpdateProduct() (+5 more)

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (6): AuthPageView(), Props, SignIn, SignUp, Story, Route

### Community 31 - "Community 31"
Cohesion: 0.16
Nodes (18): refreshAccessToken(), ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto, mockAccount, resetAuthMockState() (+10 more)

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.39
Nodes (6): Props, ResetPasswordForm(), DEFAULTS, FormValues, schema, useResetPassword()

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 49 - "admin.orders.tsx"
Cohesion: 0.50
Nodes (3): ORDER_STATUSES, adminOrdersSearch, Route

## Knowledge Gaps
- **228 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+223 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Checkout Form Stories` to `HTTP Client & API Types`, `Cart View & Stories`, `Catalog View Tests`, `Orders Module`, `App Shell & Theme`, `Community 13`, `ResetPasswordForm.tsx`, `Community 15`, `Community 24`, `Community 25`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `FormField()` connect `Community 13` to `Account & Auth UI`, `Facet Filter Stories`, `App Shell & Theme`, `ResetPasswordForm.tsx`, `Community 16`, `Community 17`, `Community 20`, `Community 22`, `Community 23`, `Community 25`, `Community 29`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `AuthPageView()` connect `Community 30` to `Community 16`, `Community 25`, `Checkout Form Stories`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _228 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Catalog Browse Components` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.06428571428571428 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._