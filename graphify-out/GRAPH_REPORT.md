# Graph Report - merch-shop  (2026-08-21)

## Corpus Check
- 207 files · ~45,825 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 785 nodes · 1880 edges · 55 communities (34 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a41f7282`
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
- SignInForm.tsx
- SignUpForm.tsx
- admin.orders.test.tsx

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 39 edges
2. `FileRoutesByPath` - 30 edges
3. `renderRoute()` - 25 edges
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
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `LocaleSwitcher()` --calls--> `hrefUnderLocale()`  [EXTRACTED]
  src/components/LocaleSwitcher.tsx → src/i18n/localeRedirect.ts

## Import Cycles
- None detected.

## Communities (55 total, 21 thin omitted)

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
Cohesion: 0.08
Nodes (33): SyncCartItem, CartPage(), CartView(), Props, Empty, items, MultipleItems, SingleItem (+25 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.09
Nodes (28): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+20 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.12
Nodes (20): ADR-0017, getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree(), LocaleResources (+12 more)

### Community 6 - "Product Detail View"
Cohesion: 0.14
Nodes (11): client, META, MOCK_PRODUCTS, PaginationMeta, RawProduct, RawPublisher, buildSitemapResponse(), Route (+3 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.28
Nodes (10): BulkAvailabilityDto, CreateProductDto, CreatePublisherDto, AdminPublishersView(), DEFAULTS, FormValues, schema, useCreatePublisher() (+2 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.06
Nodes (48): ProductFilters, AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct(), useDeleteProduct() (+40 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.20
Nodes (18): adminAccount, buyerAccount, mockSignedIn(), envelope(), server, twoOrders, testOrder, mockGames (+10 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.14
Nodes (16): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, Empty, mockRegister, PaymentDeclined (+8 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.20
Nodes (16): GlobalNav(), useLocale(), SignUpForm(), useAccount(), useAuth(), useLogout(), AccountOrdersPage(), OrderCard() (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (12): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (12): Route, Route, Route, Route, Route, Route, Route, Route (+4 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (16): readLocaleCookie(), writeLocaleCookie(), readLocaleHints(), hrefUnderLocale(), redirectToResolvedLocale(), isLocaleSegment(), languageOf(), LocaleHints (+8 more)

### Community 17 - "Community 17"
Cohesion: 0.24
Nodes (11): CreateSkuDto, SkuFacet, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability() (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (8): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route

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
Cohesion: 0.23
Nodes (10): CreateGameDto, AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame() (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.23
Nodes (10): CreateCharacterDto, AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter(), useDeleteCharacter() (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (17): PaymentIntentResponse, RawOrder, RawProductMutationResponse, worker, characters, games, handlers, mockOrders (+9 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (11): LocaleSwitcher(), LocaleSwitcherProps, NavDrawerContent(), NavDrawerContentProps, isSupportedLocale(), SUPPORTED_LOCALES, SupportedLocale, load() (+3 more)

### Community 29 - "Community 29"
Cohesion: 0.31
Nodes (5): env, AuthBootstrapEffect(), MyRouterContext, registerHardSignOutHandler(), system

### Community 30 - "Community 30"
Cohesion: 0.11
Nodes (13): AuthPageView(), Props, SignIn, SignUp, Story, ForgotPasswordForm(), Props, VerifyEmailView() (+5 more)

### Community 31 - "Community 31"
Cohesion: 0.16
Nodes (19): refreshAccessToken(), ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto, mockAccount, resetAuthMockState() (+11 more)

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.39
Nodes (6): Props, ResetPasswordForm(), DEFAULTS, FormValues, schema, useResetPassword()

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 49 - "admin.orders.tsx"
Cohesion: 0.43
Nodes (5): Character, Game, Team, FacetFilterViewProps, FacetGroupProps

### Community 53 - "SignInForm.tsx"
Cohesion: 0.48
Nodes (5): DEFAULTS, FormValues, schema, SignInForm(), useLogin()

### Community 54 - "SignUpForm.tsx"
Cohesion: 0.70
Nodes (3): DEFAULTS, FormValues, schema

### Community 57 - "admin.orders.test.tsx"
Cohesion: 0.50
Nodes (4): Order, toRawOrder(), adminOrdersEnvelope(), testOrders

## Knowledge Gaps
- **233 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+228 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Checkout Form Stories` to `HTTP Client & API Types`, `Cart View & Stories`, `Catalog View Tests`, `Orders Module`, `App Shell & Theme`, `ResetPasswordForm.tsx`, `Community 18`, `SignInForm.tsx`, `Community 25`, `Community 29`, `Community 30`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `FormField()` connect `Community 13` to `Account & Auth UI`, `Orders Module`, `App Shell & Theme`, `ResetPasswordForm.tsx`, `Community 15`, `Community 17`, `Community 20`, `SignInForm.tsx`, `SignUpForm.tsx`, `Community 23`, `Community 22`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `isSupportedLocale()` connect `Community 25` to `Community 16`, `$locale/index.tsx`, `Checkout Form Stories`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _233 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.08115942028985507 - nodes in this community are weakly interconnected._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.07678075855689177 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._