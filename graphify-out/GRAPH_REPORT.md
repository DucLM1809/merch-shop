# Graph Report - merch-shop  (2026-08-25)

## Corpus Check
- 237 files · ~54,407 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 842 nodes · 2096 edges · 57 communities (36 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `79c0aa27`
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
- AdminTeamsView.tsx
- useFormatPrice
- AdminGamesView.tsx
- AdminProductsView.tsx
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- useAuth
- AdminPublishersView.tsx
- ResetPasswordForm.tsx
- Route
- Community 33
- Community 34
- Community 35
- verify-email.tsx
- FormField.tsx
- Route
- Route
- account.orders.lazy.tsx
- Route
- Route
- Route
- Route
- Route
- AdminOrdersView.tsx
- ResetPasswordForm.tsx
- i18next.d.ts
- ProductDetailView.stories.tsx
- $locale/index.tsx
- ProductDetailView.tsx
- admin.orders.test.tsx
- SignInForm.tsx
- renderWithProviders
- Route
- Route

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 41 edges
2. `renderRoute()` - 31 edges
3. `FileRoutesByPath` - 30 edges
4. `server` - 21 edges
5. `renderWithProviders()` - 20 edges
6. `useFormatPrice()` - 18 edges
7. `envelope()` - 18 edges
8. `useAuth()` - 17 edges
9. `mockSignedIn()` - 16 edges
10. `FormField()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts
- `CartRow()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/cart/components/CartView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `renderView()` --calls--> `renderWithProviders()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutFormView.test.tsx → src/test-utils.tsx
- `ProductDetailViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductDetailView.tsx → src/api/types.ts

## Import Cycles
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.products.$productSlug.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`

## Communities (57 total, 21 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.11
Nodes (22): ORDER_STATUSES, OrderStatus, OrderDetailPage(), Props, adminOrdersQueryOptions(), orderKeys, useAdminOrders(), useOrder() (+14 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.06
Nodes (35): Character, SKU, Team, buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps, FacetFilterView(), FacetFilterViewProps (+27 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.17
Nodes (6): testOrder, JERSEY, expectNoA11yViolations(), flattenSpaces(), priceText(), renderRoute()

### Community 4 - "Publisher Nav UI"
Cohesion: 0.11
Nodes (28): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+20 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.14
Nodes (16): SyncCartItem, env, CartPage(), cartKeys, useAddCartItem(), useCart(), useCartSync(), useMergeCart() (+8 more)

### Community 6 - "Product Detail View"
Cohesion: 0.13
Nodes (19): getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree(), LocaleResources, ParityGap (+11 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.15
Nodes (21): BulkAvailabilityDto, CreateCharacterDto, CreateGameDto, CreateSkuDto, AdminCharactersView(), DEFAULTS, FormValues, schema (+13 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.05
Nodes (43): FileRoutesByFullPath, FileRoutesByTo, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren, LocaleaccountAccountOrdersRouteWithChildren (+35 more)

### Community 9 - "Orders Module"
Cohesion: 0.08
Nodes (28): Product, ProductFilters, GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props (+20 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.17
Nodes (22): Game, adminAccount, buyerAccount, mockSignedIn(), envelope(), server, order, serveOrder() (+14 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.15
Nodes (18): client, CheckoutFormView(), Props, DEFAULTS, FormValues, schema, VALIDATION_KEYS, ValidationKey (+10 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.09
Nodes (21): META, MOCK_PRODUCTS, AccountRole, AdminOrdersFilters, ApiResponse, AuthTokenResponse, OrderLine, PaginationMeta (+13 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (13): JERSEY, mockConfirmCardPayment, addToCart(), CartState, cartStore, clearCart(), formatVariant(), getSubtotal() (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (12): Route, Route, Route, Route, Route, Route, Route, Route (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (15): AuthPageView(), Props, SignIn, SignUp, Story, ResetPasswordForm(), SignInForm(), Props (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (11): LocaleSwitcher(), LocaleSwitcherProps, formatters, priceLocaleOf(), ADR-0017, hrefUnderLocale(), isSupportedLocale(), SUPPORTED_LOCALES (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (6): RawPublisher, buildSitemapResponse(), Route, MOCK_GAMES, MOCK_PRODUCTS, MOCK_PUBLISHERS

### Community 18 - "Community 18"
Cohesion: 0.23
Nodes (13): SkuFacet, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability(), useCreateSku() (+5 more)

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (7): Default, Empty, Loading, meta, NoImages, sampleProducts, Story

### Community 20 - "AdminTeamsView.tsx"
Cohesion: 0.23
Nodes (10): CreateTeamDto, AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam(), useDeleteTeam() (+2 more)

### Community 21 - "useFormatPrice"
Cohesion: 0.21
Nodes (9): useFormatPrice(), ProductCard(), ProductCatalogView(), ProductCatalogViewProps, products, OrderConfirmationPage(), Props, multiItems (+1 more)

### Community 22 - "AdminGamesView.tsx"
Cohesion: 0.25
Nodes (12): readLocaleHints, redirectToResolvedLocale(), isLocaleSegment(), languageOf(), LocaleHints, matchLocale(), normalizeTag(), parseAcceptLanguage() (+4 more)

### Community 23 - "AdminProductsView.tsx"
Cohesion: 0.29
Nodes (9): CreateProductDto, AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct(), useDeleteProduct() (+1 more)

### Community 24 - "Community 24"
Cohesion: 0.09
Nodes (20): Account, PaymentIntentResponse, SyncCartResponse, worker, characters, games, handlers, mockAccount (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.26
Nodes (6): readLocaleCookie(), writeLocaleCookie(), load(), LocaleState, localeStore, loadStore()

### Community 27 - "Community 27"
Cohesion: 0.06
Nodes (32): Publisher, Props, QueryError(), mockPublishers, GamePageView(), GamePageViewProps, Loaded, Loading (+24 more)

### Community 29 - "useAuth"
Cohesion: 0.18
Nodes (17): GlobalNav(), NavDrawerContent(), NavDrawerContentProps, useLocale(), SignUpForm(), useAccount(), useAuth(), useLogout() (+9 more)

### Community 30 - "AdminPublishersView.tsx"
Cohesion: 0.31
Nodes (9): CreatePublisherDto, AdminPublishersView(), DEFAULTS, FormValues, schema, useCreatePublisher(), useDeletePublisher(), useUpdatePublisher() (+1 more)

### Community 31 - "ResetPasswordForm.tsx"
Cohesion: 0.33
Nodes (5): formatPrice(), formatterFor(), mockConfirmCardPayment, mockStripe, payLabel()

### Community 32 - "Route"
Cohesion: 0.16
Nodes (11): CartRow(), CartRowProps, CartView(), Props, Empty, items, MultipleItems, SingleItem (+3 more)

### Community 36 - "verify-email.tsx"
Cohesion: 0.50
Nodes (5): dateLocaleOf(), formatDate(), formatterFor(), formatters, useFormatDate()

### Community 46 - "AdminOrdersView.tsx"
Cohesion: 0.10
Nodes (16): AdminLayout(), NAV_ITEMS, NavItem, Props, AdminOrdersView(), COL_FLEX, COLS, fmtDate() (+8 more)

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.09
Nodes (26): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+18 more)

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 52 - "admin.orders.test.tsx"
Cohesion: 0.29
Nodes (5): Order, toRawOrder(), twoOrders, adminOrdersEnvelope(), testOrders

## Knowledge Gaps
- **246 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+241 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `useAuth` to `Route`, `HTTP Client & API Types`, `Catalog View Tests`, `Orders Module`, `App Shell & Theme`, `AdminOrdersView.tsx`, `Community 15`, `Community 16`, `ResetPasswordForm.tsx`, `useFormatPrice`, `Community 24`, `Community 27`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `FormField()` connect `ResetPasswordForm.tsx` to `Cart View & Stories`, `Account & Auth UI`, `App Shell & Theme`, `Community 18`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`, `AdminPublishersView.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `renderRoute()` connect `Cart View & Stories` to `Orders Module`, `Facet Filter Stories`, `Community 13`, `Community 16`, `admin.orders.test.tsx`, `Community 25`, `ResetPasswordForm.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _246 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._
- **Should `Catalog Browse Components` be split into smaller, more focused modules?**
  _Cohesion score 0.056429232192414434 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11261261261261261 - nodes in this community are weakly interconnected._