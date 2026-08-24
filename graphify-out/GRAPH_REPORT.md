# Graph Report - merch-shop  (2026-08-24)

## Corpus Check
- 222 files · ~49,991 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 812 nodes · 1970 edges · 61 communities (42 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1cd519ee`
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
- Route
- Route
- Route

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 39 edges
2. `FileRoutesByPath` - 30 edges
3. `renderRoute()` - 28 edges
4. `renderWithProviders()` - 19 edges
5. `server` - 18 edges
6. `useAuth()` - 17 edges
7. `envelope()` - 15 edges
8. `FormField()` - 14 edges
9. `useFormatPrice()` - 14 edges
10. `mockSignedIn()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `CartRow()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/cart/components/CartView.tsx → src/i18n/useFormatPrice.ts
- `ProductCard()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts

## Import Cycles
- None detected.

## Communities (61 total, 19 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.08
Nodes (31): ORDER_STATUSES, OrderStatus, AdminOrdersView(), COL_FLEX, COLS, fmtDate(), Props, RETRYABLE_STATUSES (+23 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.22
Nodes (8): characters, games, GameSelected, MultipleActive, NoSelection, Story, teams, TeamSelected

### Community 3 - "Cart View & Stories"
Cohesion: 0.15
Nodes (7): items, JERSEY, expectNoA11yViolations(), flattenSpaces(), priceText(), renderRoute(), renderWithProviders()

### Community 4 - "Publisher Nav UI"
Cohesion: 0.09
Nodes (28): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+20 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.13
Nodes (19): getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree(), LocaleResources, ParityGap (+11 more)

### Community 6 - "Product Detail View"
Cohesion: 0.17
Nodes (8): META, MOCK_PRODUCTS, PaginationMeta, RawProduct, RawPublisher, MOCK_GAMES, MOCK_PRODUCTS, MOCK_PUBLISHERS

### Community 7 - "Account & Auth UI"
Cohesion: 0.32
Nodes (9): BulkAvailabilityDto, CreatePublisherDto, AdminPublishersView(), DEFAULTS, FormValues, schema, useCreatePublisher(), useDeletePublisher() (+1 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.08
Nodes (34): ProductFilters, FacetFilter(), GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props (+26 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.21
Nodes (17): Publisher, adminAccount, buyerAccount, mockSignedIn(), envelope(), server, twoOrders, testOrder (+9 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.13
Nodes (19): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, VALIDATION_KEYS, ValidationKey, Empty (+11 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.48
Nodes (5): DEFAULTS, FormValues, schema, SignInForm(), useLogin()

### Community 13 - "Community 13"
Cohesion: 0.23
Nodes (11): SyncCartItem, CartPage(), cartKeys, useAddCartItem(), useCart(), useCartSync(), useMergeCart(), useRemoveCartItem() (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (11): Route, Route, Route, Route, Route, Route, Route, Route (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.23
Nodes (10): CreateProductDto, AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct(), useDeleteProduct() (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.07
Nodes (43): GlobalNav(), LocaleSwitcher(), LocaleSwitcherProps, NavDrawerContent(), NavDrawerContentProps, readLocaleCookie(), writeLocaleCookie(), readLocaleHints() (+35 more)

### Community 17 - "Community 17"
Cohesion: 0.24
Nodes (11): CreateSkuDto, SkuFacet, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability() (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (8): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route

### Community 19 - "Community 19"
Cohesion: 0.18
Nodes (12): Product, ProductCard(), ProductCatalogView(), ProductCatalogViewProps, Default, Empty, Loading, meta (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (9): CreateTeamDto, AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam(), useDeleteTeam() (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (18): CartRow(), CartRowProps, CartView(), Props, JERSEY, mockConfirmCardPayment, addToCart(), CartItem (+10 more)

### Community 22 - "Community 22"
Cohesion: 0.23
Nodes (10): CreateGameDto, AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame() (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.27
Nodes (10): CreateCharacterDto, AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter(), useDeleteCharacter() (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (18): PaymentIntentResponse, RawOrder, ServerCart, worker, characters, games, handlers, mockOrders (+10 more)

### Community 25 - "Community 25"
Cohesion: 0.23
Nodes (7): ResetPasswordForm(), Props, VerifyEmailView(), useResetPassword(), useVerifyEmail(), Route, Route

### Community 27 - "Community 27"
Cohesion: 0.08
Nodes (23): Props, QueryError(), mockPublishers, GamePageView(), GamePageViewProps, Loaded, Loading, meta (+15 more)

### Community 29 - "Community 29"
Cohesion: 0.13
Nodes (14): SKU, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, Default, EditionVariants, Error, Loading (+6 more)

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (6): AuthPageView(), Props, SignIn, SignUp, Story, Route

### Community 31 - "Community 31"
Cohesion: 0.16
Nodes (18): refreshAccessToken(), ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto, mockAccount, resetAuthMockState() (+10 more)

### Community 32 - "Route"
Cohesion: 0.24
Nodes (9): formatPrice(), formatterFor(), formatters, priceLocaleOf(), ADR-0017, useFormatPrice(), mockConfirmCardPayment, mockStripe (+1 more)

### Community 36 - "verify-email.tsx"
Cohesion: 0.31
Nodes (5): env, AuthBootstrapEffect(), MyRouterContext, registerHardSignOutHandler(), system

### Community 37 - "order-confirmation.tsx"
Cohesion: 0.48
Nodes (5): ForgotPasswordForm(), DEFAULTS, FormValues, schema, useForgotPassword()

### Community 39 - "Route"
Cohesion: 0.48
Nodes (5): DEFAULTS, FormValues, schema, SignUpForm(), useRegister()

### Community 40 - "account.orders.lazy.tsx"
Cohesion: 0.33
Nodes (5): Empty, items, MultipleItems, SingleItem, Story

### Community 46 - "Route"
Cohesion: 0.33
Nodes (5): FacetFilterView(), characters, games, renderFilter(), teams

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.15
Nodes (13): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+5 more)

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 49 - "admin.orders.tsx"
Cohesion: 0.29
Nodes (7): Character, Game, Team, FacetFilterViewProps, FacetGroupProps, mockGames, twoTeams

### Community 55 - "OptimizedImage.tsx"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 56 - "client"
Cohesion: 0.50
Nodes (3): client, buildSitemapResponse(), Route

### Community 57 - "admin.orders.test.tsx"
Cohesion: 0.50
Nodes (4): Order, toRawOrder(), adminOrdersEnvelope(), testOrders

## Knowledge Gaps
- **240 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+235 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Community 16` to `HTTP Client & API Types`, `verify-email.tsx`, `Orders Module`, `App Shell & Theme`, `Checkout Form Stories`, `ResetPasswordForm.tsx`, `Community 18`, `Community 21`, `Community 24`, `Community 25`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `FormField()` connect `ResetPasswordForm.tsx` to `Cart View & Stories`, `order-confirmation.tsx`, `Route`, `Account & Auth UI`, `App Shell & Theme`, `Checkout Form Stories`, `Community 15`, `Community 17`, `Community 20`, `Community 22`, `Community 23`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `SupportedLocale` connect `Community 16` to `Route`, `Cart View & Stories`, `Catalog View Tests`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _240 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.08115942028985507 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Catalog View Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._