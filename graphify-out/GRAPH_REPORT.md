# Graph Report - merch-shop  (2026-08-24)

## Corpus Check
- 218 files · ~48,552 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 806 nodes · 1941 edges · 62 communities (43 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cdc497f3`
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
- ProductDetailView.tsx
- admin.products.test.tsx
- SignInForm.tsx
- SignUpForm.tsx
- OptimizedImage.tsx
- client
- admin.orders.test.tsx
- admin.orders.tsx
- Route
- Route
- Route

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 39 edges
2. `FileRoutesByPath` - 30 edges
3. `renderRoute()` - 27 edges
4. `server` - 18 edges
5. `useAuth()` - 17 edges
6. `renderWithProviders()` - 17 edges
7. `envelope()` - 15 edges
8. `FormField()` - 14 edges
9. `mockSignedIn()` - 14 edges
10. `Product` - 12 edges

## Surprising Connections (you probably didn't know these)
- `CartRow()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/cart/components/CartView.tsx → src/i18n/useFormatPrice.ts
- `ProductCard()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductDetailView.tsx → src/api/types.ts

## Import Cycles
- None detected.

## Communities (62 total, 19 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.19
Nodes (13): OrderDetailPage(), Props, adminOrdersQueryOptions(), orderKeys, useAdminOrders(), useOrder(), useOrderByPaymentIntent(), useOrders() (+5 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.22
Nodes (8): characters, games, GameSelected, MultipleActive, NoSelection, Story, teams, TeamSelected

### Community 3 - "Cart View & Stories"
Cohesion: 0.06
Nodes (36): CartRow(), CartRowProps, CartView(), Props, Empty, items, MultipleItems, SingleItem (+28 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.09
Nodes (28): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+20 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.11
Nodes (22): getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree(), LocaleResources, ParityGap (+14 more)

### Community 6 - "Product Detail View"
Cohesion: 0.17
Nodes (8): META, MOCK_PRODUCTS, PaginationMeta, RawProduct, RawPublisher, MOCK_GAMES, MOCK_PRODUCTS, MOCK_PUBLISHERS

### Community 7 - "Account & Auth UI"
Cohesion: 0.26
Nodes (9): CreatePublisherDto, AdminPublishersView(), DEFAULTS, FormValues, schema, useCreatePublisher(), useDeletePublisher(), useUpdatePublisher() (+1 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.11
Nodes (23): ProductFilters, GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props, NavLink (+15 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.23
Nodes (15): adminAccount, buyerAccount, mockSignedIn(), envelope(), server, twoOrders, testOrder, mockGames (+7 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.14
Nodes (16): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, Empty, mockRegister, PaymentDeclined (+8 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.16
Nodes (19): GlobalNav(), NavDrawerContent(), NavDrawerContentProps, useLocale(), SignInForm(), useAccount(), useAuth(), useLogout() (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.23
Nodes (11): SyncCartItem, CartPage(), cartKeys, useAddCartItem(), useCart(), useCartSync(), useMergeCart(), useRemoveCartItem() (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (12): Route, Route, Route, Route, searchSchema, Route, Route, Route (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.24
Nodes (12): CreateProductDto, AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct(), useDeleteProduct() (+4 more)

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (27): LocaleSwitcher(), LocaleSwitcherProps, readLocaleCookie(), writeLocaleCookie(), readLocaleHints(), hrefUnderLocale(), redirectToResolvedLocale(), isSupportedLocale() (+19 more)

### Community 17 - "Community 17"
Cohesion: 0.23
Nodes (12): CreateSkuDto, SkuFacet, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability() (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (8): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route

### Community 19 - "Community 19"
Cohesion: 0.19
Nodes (11): Product, ProductCard(), ProductCatalogView(), ProductCatalogViewProps, Default, Empty, Loading, meta (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (9): CreateTeamDto, AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam(), useDeleteTeam() (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.20
Nodes (8): mockPublishers, PublisherNavView(), Default, GameActive, Loading, meta, PublisherActive, Story

### Community 22 - "Community 22"
Cohesion: 0.23
Nodes (10): CreateGameDto, AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame() (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.28
Nodes (10): BulkAvailabilityDto, CreateCharacterDto, AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter() (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.12
Nodes (15): PaymentIntentResponse, RawSku, ServerCart, characters, games, mockOrders, ProductRecord, products (+7 more)

### Community 25 - "Community 25"
Cohesion: 0.19
Nodes (11): OrderStatus, AdminOrdersView(), COL_FLEX, COLS, fmtDate(), Props, RETRYABLE_STATUSES, STATUS_COLOR (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.21
Nodes (8): Props, QueryError(), GamePageView(), GamePageViewProps, Loaded, Loading, meta, Story

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (6): SKU, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, product, uniqueValues()

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (10): AuthPageView(), Props, SignIn, SignUp, Story, Props, VerifyEmailView(), useVerifyEmail() (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.06
Nodes (46): refreshAccessToken(), ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto, FormField(), Label (+38 more)

### Community 32 - "Route"
Cohesion: 0.42
Nodes (6): formatPrice(), formatterFor(), formatters, priceLocaleOf(), ADR-0017, useFormatPrice()

### Community 40 - "account.orders.lazy.tsx"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.25
Nodes (7): Props, ResetPasswordForm(), DEFAULTS, FormValues, schema, useResetPassword(), Route

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 49 - "admin.orders.tsx"
Cohesion: 0.43
Nodes (5): Character, Game, Team, FacetFilterViewProps, FacetGroupProps

### Community 50 - "$locale/index.tsx"
Cohesion: 0.28
Nodes (5): PublisherPageView(), Loaded, Loading, meta, Story

### Community 52 - "admin.products.test.tsx"
Cohesion: 0.29
Nodes (6): Publisher, PublisherNavViewProps, PublisherPageViewProps, mockGames, mockPublishers, twoProducts

### Community 53 - "SignInForm.tsx"
Cohesion: 0.43
Nodes (6): BreadcrumbItem, breadcrumbJsonLd(), buildGameHeadMeta(), buildProductHeadMeta(), GameHeadParams, slugToTitle()

### Community 54 - "SignUpForm.tsx"
Cohesion: 0.40
Nodes (4): OrderConfirmationPage(), Props, multiItems, singleItem

### Community 55 - "OptimizedImage.tsx"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 56 - "client"
Cohesion: 0.50
Nodes (3): client, buildSitemapResponse(), Route

### Community 57 - "admin.orders.test.tsx"
Cohesion: 0.50
Nodes (4): Order, toRawOrder(), adminOrdersEnvelope(), testOrders

### Community 58 - "admin.orders.tsx"
Cohesion: 0.50
Nodes (3): ORDER_STATUSES, adminOrdersSearch, Route

## Knowledge Gaps
- **238 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+233 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Checkout Form Stories` to `HTTP Client & API Types`, `Cart View & Stories`, `Catalog View Tests`, `Orders Module`, `App Shell & Theme`, `ResetPasswordForm.tsx`, `Community 16`, `Community 18`, `SignUpForm.tsx`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `FormField()` connect `Community 31` to `Cart View & Stories`, `Account & Auth UI`, `App Shell & Theme`, `Community 15`, `ResetPasswordForm.tsx`, `Community 17`, `Community 20`, `Community 22`, `Community 23`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `SupportedLocale` connect `Community 16` to `Route`, `Cart View & Stories`, `Checkout Form Stories`, `Catalog View Tests`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _238 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.05673076923076923 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Catalog View Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.10591133004926108 - nodes in this community are weakly interconnected._