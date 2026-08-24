# Graph Report - merch-shop  (2026-08-24)

## Corpus Check
- 230 files · ~51,562 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 827 nodes · 2028 edges · 58 communities (38 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5a1b52ed`
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
- admin.orders.test.tsx
- Route

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 39 edges
2. `FileRoutesByPath` - 30 edges
3. `renderRoute()` - 29 edges
4. `server` - 19 edges
5. `renderWithProviders()` - 19 edges
6. `useFormatPrice()` - 18 edges
7. `envelope()` - 17 edges
8. `useAuth()` - 17 edges
9. `mockSignedIn()` - 15 edges
10. `FormField()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `ProductCard()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `HomePage()` --calls--> `useLocale()`  [EXTRACTED]
  src/routes/$locale/index.lazy.tsx → src/i18n/useLocale.ts
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductDetailView.tsx → src/api/types.ts

## Import Cycles
- None detected.

## Communities (58 total, 20 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.07
Nodes (35): ORDER_STATUSES, OrderStatus, AdminOrdersView(), COL_FLEX, COLS, fmtDate(), Props, RETRYABLE_STATUSES (+27 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.17
Nodes (10): FacetFilterView(), FacetGroupProps, characters, games, GameSelected, MultipleActive, NoSelection, Story (+2 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.16
Nodes (10): SyncCartResponse, JERSEY, JERSEY, mockConfirmCardPayment, addToCart(), clearCart(), expectNoA11yViolations(), flattenSpaces() (+2 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.06
Nodes (42): ApiError, client, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku() (+34 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.11
Nodes (22): getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree(), LocaleResources, ParityGap (+14 more)

### Community 6 - "Product Detail View"
Cohesion: 0.17
Nodes (15): readLocaleHints(), hrefUnderLocale(), redirectToResolvedLocale(), SUPPORTED_LOCALES, SupportedLocale, isLocaleSegment(), languageOf(), LocaleHints (+7 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.15
Nodes (14): CreatePublisherDto, AdminLayout(), NAV_ITEMS, NavItem, Props, AdminPublishersView(), DEFAULTS, FormValues (+6 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.14
Nodes (17): ProductFilters, FacetFilter(), ProductCatalog(), Props, ProductDetail(), Props, catalogKeys, productQueryOptions() (+9 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.19
Nodes (19): adminAccount, buyerAccount, mockSignedIn(), envelope(), server, testOrder, order, serveOrder() (+11 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.14
Nodes (18): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, VALIDATION_KEYS, ValidationKey, Empty (+10 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.14
Nodes (11): GamePage(), Props, NavLink, Props, PublisherNav(), Props, PublisherPage(), usePublisher() (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.10
Nodes (23): SyncCartItem, env, CartPage(), cartKeys, useAddCartItem(), useCart(), useCartSync(), useMergeCart() (+15 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (12): Route, Route, Route, Route, Route, Route, Route, Route (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (11): BulkAvailabilityDto, CreateProductDto, CreateSkuDto, AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (18): GlobalNav(), LocaleSwitcher(), LocaleSwitcherProps, NavDrawerContent(), NavDrawerContentProps, useLocale(), useAccount(), useAuth() (+10 more)

### Community 17 - "Community 17"
Cohesion: 0.21
Nodes (12): SkuFacet, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability(), useCreateSku() (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.24
Nodes (6): readLocaleCookie(), writeLocaleCookie(), load(), LocaleState, localeStore, loadStore()

### Community 19 - "Community 19"
Cohesion: 0.18
Nodes (12): Product, ProductCard(), ProductCatalogView(), ProductCatalogViewProps, Default, Empty, Loading, meta (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.23
Nodes (10): CreateTeamDto, AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam(), useDeleteTeam() (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.21
Nodes (8): Props, QueryError(), GamePageView(), GamePageViewProps, Loaded, Loading, meta, Story

### Community 22 - "Community 22"
Cohesion: 0.23
Nodes (10): CreateGameDto, AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame() (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.23
Nodes (10): CreateCharacterDto, AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter(), useDeleteCharacter() (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.12
Nodes (15): Account, PaymentIntentResponse, ServerCart, characters, games, mockOrders, ProductRecord, products (+7 more)

### Community 25 - "Community 25"
Cohesion: 0.11
Nodes (16): AuthPageView(), Props, SignIn, SignUp, Story, ResetPasswordForm(), SignInForm(), SignUpForm() (+8 more)

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (16): Publisher, mockPublishers, PublisherNavView(), PublisherNavViewProps, Default, GameActive, Loading, meta (+8 more)

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (6): SKU, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, product, uniqueValues()

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

### Community 31 - "Community 31"
Cohesion: 0.10
Nodes (26): refreshAccessToken(), ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto, mockAccount, resetAuthMockState() (+18 more)

### Community 32 - "Route"
Cohesion: 0.13
Nodes (18): formatPrice(), formatterFor(), formatters, priceLocaleOf(), ADR-0017, isSupportedLocale(), useFormatPrice(), CartRow() (+10 more)

### Community 36 - "verify-email.tsx"
Cohesion: 0.50
Nodes (5): dateLocaleOf(), formatDate(), formatterFor(), formatters, useFormatDate()

### Community 37 - "order-confirmation.tsx"
Cohesion: 0.43
Nodes (6): BreadcrumbItem, breadcrumbJsonLd(), buildGameHeadMeta(), buildProductHeadMeta(), GameHeadParams, slugToTitle()

### Community 46 - "Route"
Cohesion: 0.22
Nodes (7): items, characters, games, renderFilter(), teams, renderView(), renderWithProviders()

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.11
Nodes (19): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+11 more)

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 55 - "OptimizedImage.tsx"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 57 - "admin.orders.test.tsx"
Cohesion: 0.29
Nodes (5): Order, toRawOrder(), twoOrders, adminOrdersEnvelope(), testOrders

## Knowledge Gaps
- **244 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+239 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Community 16` to `Route`, `HTTP Client & API Types`, `Catalog View Tests`, `Product Detail View`, `Account & Auth UI`, `Orders Module`, `App Shell & Theme`, `Checkout Form Stories`, `Community 13`, `ResetPasswordForm.tsx`, `Community 25`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `FormField()` connect `ResetPasswordForm.tsx` to `Cart View & Stories`, `Account & Auth UI`, `App Shell & Theme`, `Community 15`, `Community 17`, `Community 20`, `Community 22`, `Community 23`, `Community 31`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `SupportedLocale` connect `Product Detail View` to `Route`, `Cart View & Stories`, `verify-email.tsx`, `Catalog View Tests`, `Community 18`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _244 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.07215686274509804 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06386066763425254 - nodes in this community are weakly interconnected._
- **Should `Catalog View Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.10591133004926108 - nodes in this community are weakly interconnected._