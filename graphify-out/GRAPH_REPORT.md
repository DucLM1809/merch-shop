# Graph Report - merch-shop  (2026-08-24)

## Corpus Check
- 236 files · ~53,099 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 833 nodes · 2051 edges · 44 communities (25 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7193f65e`
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
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Route
- Community 33
- Community 34
- Community 35
- verify-email.tsx
- Route
- Route
- account.orders.lazy.tsx
- Route
- Route
- Route
- Route
- Route
- ResetPasswordForm.tsx
- i18next.d.ts
- $locale/index.tsx
- ProductDetailView.tsx
- SignInForm.tsx
- Route

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 39 edges
2. `FileRoutesByPath` - 30 edges
3. `renderRoute()` - 30 edges
4. `server` - 20 edges
5. `renderWithProviders()` - 19 edges
6. `useFormatPrice()` - 18 edges
7. `envelope()` - 17 edges
8. `useAuth()` - 17 edges
9. `mockSignedIn()` - 15 edges
10. `FormField()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `payLabel()` --calls--> `formatPrice()`  [EXTRACTED]
  src/routes/$locale/(checkout)/checkout.test.tsx → src/i18n/formatPrice.ts
- `ProductCard()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `HomePage()` --calls--> `useLocale()`  [EXTRACTED]
  src/routes/$locale/index.lazy.tsx → src/i18n/useLocale.ts
- `renderView()` --calls--> `renderWithProviders()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutFormView.test.tsx → src/test-utils.tsx

## Import Cycles
- None detected.

## Communities (44 total, 19 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.09
Nodes (29): ORDER_STATUSES, OrderStatus, AdminOrdersView(), COL_FLEX, COLS, fmtDate(), Props, RETRYABLE_STATUSES (+21 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.22
Nodes (8): characters, games, GameSelected, MultipleActive, NoSelection, Story, teams, TeamSelected

### Community 3 - "Cart View & Stories"
Cohesion: 0.17
Nodes (6): multiItems, singleItem, expectNoA11yViolations(), flattenSpaces(), priceText(), renderRoute()

### Community 4 - "Publisher Nav UI"
Cohesion: 0.06
Nodes (44): ApiError, client, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku() (+36 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.07
Nodes (35): refreshAccessToken(), env, getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree() (+27 more)

### Community 6 - "Product Detail View"
Cohesion: 0.12
Nodes (20): readLocaleCookie(), writeLocaleCookie(), readLocaleHints(), hrefUnderLocale(), redirectToResolvedLocale(), isLocaleSegment(), languageOf(), LocaleHints (+12 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.05
Nodes (58): BulkAvailabilityDto, CreateCharacterDto, CreateGameDto, CreatePublisherDto, CreateSkuDto, CreateTeamDto, SkuFacet, AdminCharactersView() (+50 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, FileRouteTypes, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.06
Nodes (49): CreateProductDto, ProductFilters, AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct() (+41 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.16
Nodes (22): Order, adminAccount, buyerAccount, mockSignedIn(), envelope(), toRawOrder(), server, twoOrders (+14 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.13
Nodes (19): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, VALIDATION_KEYS, ValidationKey, Empty (+11 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.29
Nodes (7): Character, Game, Team, FacetFilterViewProps, FacetGroupProps, mockGames, twoCharacters

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (28): SyncCartItem, CartPage(), cartKeys, useAddCartItem(), useCart(), useCartSync(), useMergeCart(), useRemoveCartItem() (+20 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (11): Route, Route, Route, Route, Route, Route, Route, Route (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.24
Nodes (5): AuthPageView(), Props, SignIn, SignUp, Story

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (17): GlobalNav(), LocaleSwitcher(), LocaleSwitcherProps, NavDrawerContent(), NavDrawerContentProps, useLocale(), SignInForm(), useAccount() (+9 more)

### Community 19 - "Community 19"
Cohesion: 0.07
Nodes (29): Product, SKU, buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps, ProductCard(), ProductCatalogView(), ProductCatalogViewProps (+21 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (17): Account, PaymentIntentResponse, ServerCart, characters, games, mockOrders, ProductRecord, products (+9 more)

### Community 25 - "Community 25"
Cohesion: 0.12
Nodes (16): mockAccount, ForgotPasswordForm(), ResetPasswordForm(), SignUpForm(), Props, VerifyEmailView(), accountKeys, useDeleteAccount() (+8 more)

### Community 27 - "Community 27"
Cohesion: 0.08
Nodes (24): Publisher, Props, QueryError(), mockPublishers, GamePageView(), GamePageViewProps, Loaded, Loading (+16 more)

### Community 32 - "Route"
Cohesion: 0.13
Nodes (16): formatPrice(), formatterFor(), useFormatPrice(), CartRow(), CartRowProps, CartView(), Props, Empty (+8 more)

### Community 36 - "verify-email.tsx"
Cohesion: 0.17
Nodes (14): dateLocaleOf(), formatDate(), formatterFor(), formatters, formatters, priceLocaleOf(), ADR-0017, isSupportedLocale() (+6 more)

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.10
Nodes (24): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+16 more)

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

## Knowledge Gaps
- **245 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+240 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Community 16` to `Route`, `HTTP Client & API Types`, `verify-email.tsx`, `Catalog View Tests`, `Account & Auth UI`, `Orders Module`, `App Shell & Theme`, `ResetPasswordForm.tsx`, `Community 25`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `FormField()` connect `ResetPasswordForm.tsx` to `App Shell & Theme`, `Orders Module`, `Cart View & Stories`, `Account & Auth UI`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `SupportedLocale` connect `verify-email.tsx` to `Community 16`, `Cart View & Stories`, `Catalog View Tests`, `Product Detail View`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _245 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.08748615725359911 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06363636363636363 - nodes in this community are weakly interconnected._
- **Should `Catalog View Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.06753006475485661 - nodes in this community are weakly interconnected._