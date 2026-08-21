# Graph Report - merch-shop  (2026-08-21)

## Corpus Check
- 202 files · ~44,650 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 769 nodes · 1832 edges · 59 communities (40 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `430050fa`
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
- GamePageView.tsx
- SignInForm.tsx
- SignUpForm.tsx
- OptimizedImage.tsx
- client
- admin.orders.test.tsx
- order-confirmation.tsx

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
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `OrderCard()` --calls--> `useLocale()`  [EXTRACTED]
  src/routes/$locale/(account)/account.orders.index.lazy.tsx → src/i18n/useLocale.ts
- `HomePage()` --calls--> `useLocale()`  [EXTRACTED]
  src/routes/$locale/index.lazy.tsx → src/i18n/useLocale.ts
- `renderFilter()` --calls--> `renderWithProviders()`  [EXTRACTED]
  src/modules/catalog/components/FacetFilterView.test.tsx → src/test-utils.tsx

## Import Cycles
- None detected.

## Communities (59 total, 19 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.07
Nodes (34): ORDER_STATUSES, OrderStatus, AdminOrdersView(), COL_FLEX, COLS, fmtDate(), Props, RETRYABLE_STATUSES (+26 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.12
Nodes (14): FacetFilterView(), FacetGroupProps, characters, games, GameSelected, MultipleActive, NoSelection, Story (+6 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.08
Nodes (31): SyncCartItem, CartPage(), CartView(), Props, Empty, items, MultipleItems, SingleItem (+23 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.07
Nodes (38): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+30 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.08
Nodes (36): ADR-0017, getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree(), LocaleResources (+28 more)

### Community 6 - "Product Detail View"
Cohesion: 0.14
Nodes (12): Character, Game, RawProduct, RawPublisher, Team, FacetFilterViewProps, mockGames, mockPublishers (+4 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.26
Nodes (9): CreatePublisherDto, AdminPublishersView(), DEFAULTS, FormValues, schema, useCreatePublisher(), useDeletePublisher(), useUpdatePublisher() (+1 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.08
Nodes (34): ProductFilters, FacetFilter(), GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props (+26 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.23
Nodes (16): adminAccount, buyerAccount, mockSignedIn(), envelope(), server, twoOrders, testOrder, mockGames (+8 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.14
Nodes (16): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, Empty, mockRegister, PaymentDeclined (+8 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.17
Nodes (16): GlobalNav(), NavDrawerContent(), NavDrawerContentProps, env, useLocale(), useAccount(), useAuth(), AdminGuard() (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (9): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (13): Route, Route, Route, Route, Route, Route, Route, Route (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (4): items, product, expectNoA11yViolations(), renderWithProviders()

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (6): ForgotPasswordForm(), DEFAULTS, FormValues, schema, useForgotPassword(), Route

### Community 17 - "Community 17"
Cohesion: 0.23
Nodes (12): CreateSkuDto, SkuFacet, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability() (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (8): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route

### Community 19 - "Community 19"
Cohesion: 0.18
Nodes (11): Product, ProductCatalogView(), ProductCatalogViewProps, Default, Empty, Loading, meta, NoImages (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.28
Nodes (10): BulkAvailabilityDto, CreateTeamDto, AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam() (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.19
Nodes (9): Publisher, PublisherNavView(), PublisherNavViewProps, Default, GameActive, Loading, meta, PublisherActive (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (9): CreateGameDto, AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame() (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.23
Nodes (10): CreateCharacterDto, AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter(), useDeleteCharacter() (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.09
Nodes (18): RawSku, ServerCart, worker, characters, games, handlers, mockAccount, mockOrders (+10 more)

### Community 25 - "Community 25"
Cohesion: 0.39
Nodes (4): Props, VerifyEmailView(), useVerifyEmail(), Route

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (9): CreateProductDto, AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct(), useDeleteProduct() (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (6): AuthPageView(), Props, SignIn, SignUp, Story, Route

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (14): refreshAccessToken(), accountKeys, bootstrapAuth(), useDeleteAccount(), useLogout(), AuthBootstrapEffect(), AuthState, authStore (+6 more)

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.39
Nodes (6): Props, ResetPasswordForm(), DEFAULTS, FormValues, schema, useResetPassword()

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 49 - "admin.orders.tsx"
Cohesion: 0.16
Nodes (11): mockPublishers, Loaded, Loading, meta, Story, PublisherPageView(), PublisherPageViewProps, Loaded (+3 more)

### Community 50 - "$locale/index.tsx"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

### Community 51 - "ProductDetailView.tsx"
Cohesion: 0.43
Nodes (5): SKU, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, uniqueValues()

### Community 52 - "GamePageView.tsx"
Cohesion: 0.38
Nodes (4): Props, QueryError(), GamePageView(), GamePageViewProps

### Community 53 - "SignInForm.tsx"
Cohesion: 0.48
Nodes (5): DEFAULTS, FormValues, schema, SignInForm(), useLogin()

### Community 54 - "SignUpForm.tsx"
Cohesion: 0.48
Nodes (5): DEFAULTS, FormValues, schema, SignUpForm(), useRegister()

### Community 55 - "OptimizedImage.tsx"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 56 - "client"
Cohesion: 0.50
Nodes (3): client, buildSitemapResponse(), Route

### Community 57 - "admin.orders.test.tsx"
Cohesion: 0.67
Nodes (3): toRawOrder(), adminOrdersEnvelope(), testOrders

## Knowledge Gaps
- **231 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+226 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Checkout Form Stories` to `HTTP Client & API Types`, `Cart View & Stories`, `Catalog View Tests`, `Orders Module`, `App Shell & Theme`, `ResetPasswordForm.tsx`, `Community 18`, `SignInForm.tsx`, `Community 25`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `FormField()` connect `Community 13` to `Account & Auth UI`, `App Shell & Theme`, `ResetPasswordForm.tsx`, `Community 16`, `Community 15`, `Community 17`, `Community 20`, `SignInForm.tsx`, `SignUpForm.tsx`, `Community 23`, `Community 22`, `Community 29`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `AuthPageView()` connect `Community 30` to `Community 16`, `Community 25`, `Checkout Form Stories`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _231 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.07428571428571429 - nodes in this community are weakly interconnected._
- **Should `Catalog Browse Components` be split into smaller, more focused modules?**
  _Cohesion score 0.12418300653594772 - nodes in this community are weakly interconnected._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.08350951374207188 - nodes in this community are weakly interconnected._