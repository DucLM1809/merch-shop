# Graph Report - merch-shop  (2026-08-26)

## Corpus Check
- 258 files · ~61,250 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 930 nodes · 2370 edges · 63 communities (42 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `531fcb9c`
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
- AuthPageView
- Community 26
- Community 27
- Community 28
- useAuth
- AdminPublishersView.tsx
- AdminOrdersView.tsx
- Route
- Community 33
- Community 34
- Community 35
- __root.tsx
- FormField.tsx
- Route
- Route
- account.orders.lazy.tsx
- localeLinkGuard.test.tsx
- Route
- Route
- Route
- Route
- $locale.tsx
- ResetPasswordForm.tsx
- i18next.d.ts
- ProductDetailView.stories.tsx
- $locale/index.tsx
- Route
- admin.orders.test.tsx
- SignInForm.tsx
- renderWithProviders
- AdminGamesView.tsx
- expectNoA11yViolations
- useAuth
- EmptyState.tsx
- ResetPasswordForm.tsx
- Route
- Route
- ProductDetailView.stories.tsx

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 43 edges
2. `renderRoute()` - 31 edges
3. `FileRoutesByPath` - 30 edges
4. `renderWithProviders()` - 27 edges
5. `server` - 21 edges
6. `useFormatPrice()` - 18 edges
7. `envelope()` - 18 edges
8. `useAuth()` - 17 edges
9. `mockSignedIn()` - 16 edges
10. `Card()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `HomePage()` --calls--> `useLocale()`  [EXTRACTED]
  src/routes/$locale/index.lazy.tsx → src/i18n/useLocale.ts
- `serveOrder()` --calls--> `envelope()`  [EXTRACTED]
  src/routes/$locale/(account)/orders.i18n.test.tsx → src/mocks/handlers.ts

## Import Cycles
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.products.$productSlug.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`

## Communities (63 total, 21 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.05
Nodes (45): ORDER_STATUSES, OrderStatus, Badge(), BadgeProps, BadgeTone, Count, Status, StatusDanger (+37 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.18
Nodes (19): GlobalNav(), LocaleSwitcher(), LocaleSwitcherProps, NavDrawerContent(), NavDrawerContentProps, isSupportedLocale(), useLocale(), SignUpForm() (+11 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.17
Nodes (9): Toaster, characters, games, renderFilter(), teams, breadcrumbItems, product, renderView() (+1 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.06
Nodes (44): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+36 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.19
Nodes (5): order, serveOrder(), flattenSpaces(), priceText(), renderRoute()

### Community 6 - "Product Detail View"
Cohesion: 0.09
Nodes (26): buildTree(), seededItem, getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree() (+18 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.33
Nodes (8): AdminCharactersView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateCharacter(), useDeleteCharacter(), useUpdateCharacter()

### Community 8 - "Product Catalog View"
Cohesion: 0.05
Nodes (43): FileRoutesByFullPath, FileRoutesByTo, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren, LocaleaccountAccountOrdersRouteWithChildren (+35 more)

### Community 9 - "Orders Module"
Cohesion: 0.05
Nodes (51): ProductFilters, mockPublishers, AdminProductsView(), FacetFilter(), GamePage(), Props, ProductCatalog(), Props (+43 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.17
Nodes (22): Game, Publisher, adminAccount, buyerAccount, mockSignedIn(), envelope(), toRawOrder(), server (+14 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.13
Nodes (18): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, VALIDATION_KEYS, ValidationKey, Empty (+10 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (32): CartPage(), CartRowProps, CartView(), Props, Empty, items, MultipleItems, SingleItem (+24 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (11): Route, Route, Route, Route, Route, Route, Route, Route (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (9): SKU, BreadcrumbItem, Props, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, RenderBreadcrumbLink, uniqueValues() (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (8): RawProduct, RawPublisher, RawSku, productWithSkus, buildSitemapResponse(), MOCK_GAMES, MOCK_PRODUCTS, MOCK_PUBLISHERS

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (12): CreateSkuDto, SkuFacet, AdminSkusView(), COLUMNS, EnrichedSku, DEFAULTS, FormValues, schema (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (18): ADR-0008, Product, priceLocaleOf(), useFormatPrice(), CartRow(), ProductCard(), ProductCardProps, ProductCatalogView() (+10 more)

### Community 20 - "AdminTeamsView.tsx"
Cohesion: 0.33
Nodes (8): AdminTeamsView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateTeam(), useDeleteTeam(), useUpdateTeam()

### Community 21 - "useFormatPrice"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 22 - "AdminGamesView.tsx"
Cohesion: 0.07
Nodes (34): dateLocaleOf(), formatDate(), formatterFor(), formatters, formatPrice(), formatterFor(), formatters, ADR-0017 (+26 more)

### Community 23 - "AdminProductsView.tsx"
Cohesion: 0.31
Nodes (7): COLUMNS, DEFAULTS, FormValues, schema, useCreateProduct(), useDeleteProduct(), useUpdateProduct()

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (19): Account, LoginDto, RegisterDto, ResetPasswordDto, ServerCart, worker, characters, games (+11 more)

### Community 25 - "AuthPageView"
Cohesion: 0.12
Nodes (9): AuthPageView(), SignIn, SignUp, Story, ForgotPasswordForm(), ResetPasswordForm(), Route, Route (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.21
Nodes (8): Props, QueryError(), GamePageView(), GamePageViewProps, Loaded, Loading, meta, Story

### Community 29 - "useAuth"
Cohesion: 0.24
Nodes (9): Props, DEFAULTS, FormValues, schema, DEFAULTS, FormValues, schema, ACCOUNT_VALIDATION_KEYS (+1 more)

### Community 30 - "AdminPublishersView.tsx"
Cohesion: 0.15
Nodes (8): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route

### Community 31 - "AdminOrdersView.tsx"
Cohesion: 0.20
Nodes (12): AdminOrdersView(), COLUMNS, fmtDate(), Props, RETRYABLE_STATUSES, AdminColumn, AdminTable(), AdminTableCell() (+4 more)

### Community 32 - "Route"
Cohesion: 0.29
Nodes (9): AdminPublishersView(), COLUMNS, DEFAULTS, FormValues, schema, AdminTableRow(), useCreatePublisher(), useDeletePublisher() (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.24
Nodes (6): PublisherPageView(), PublisherPageViewProps, Loaded, Loading, meta, Story

### Community 36 - "__root.tsx"
Cohesion: 0.28
Nodes (6): env, AuthBootstrapEffect(), CartSyncEffect(), MyRouterContext, RootDocument(), registerHardSignOutHandler()

### Community 37 - "FormField.tsx"
Cohesion: 0.24
Nodes (7): Card(), CardProps, Default, Interactive, NoClipCorner, Story, Props

### Community 39 - "Route"
Cohesion: 0.13
Nodes (11): FacetDrawerProps, FacetFilterView(), FacetGroupProps, characters, games, GameSelected, MultipleActive, NoSelection (+3 more)

### Community 40 - "account.orders.lazy.tsx"
Cohesion: 0.53
Nodes (4): DEFAULTS, FormValues, schema, SignInForm()

### Community 41 - "localeLinkGuard.test.tsx"
Cohesion: 0.50
Nodes (4): mockOrders, assertRenderedInternalLinksAreLocalePrefixed(), EXEMPT_HREFS, LOCALE_PREFIX_PATTERN

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.16
Nodes (12): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+4 more)

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 57 - "AdminGamesView.tsx"
Cohesion: 0.26
Nodes (9): AdminGamesView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateGame(), useDeleteGame(), useUpdateGame() (+1 more)

### Community 58 - "expectNoA11yViolations"
Cohesion: 0.24
Nodes (5): Breadcrumb(), BreadcrumbProps, ProductPage, Story, TwoLevels

### Community 60 - "useAuth"
Cohesion: 0.18
Nodes (22): refreshAccessToken(), mockAccount, Props, VerifyEmailView(), VerifyStatus, accountKeys, bootstrapAuth(), useDeleteAccount() (+14 more)

### Community 62 - "EmptyState.tsx"
Cohesion: 0.28
Nodes (6): EmptyState(), EmptyStateProps, Story, TitleOnly, WithDescription, WithIcon

### Community 66 - "ProductDetailView.stories.tsx"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

## Knowledge Gaps
- **290 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+285 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Catalog Browse Components` to `HTTP Client & API Types`, `__root.tsx`, `account.orders.lazy.tsx`, `Orders Module`, `App Shell & Theme`, `Community 13`, `Community 16`, `AuthPageView`, `useAuth`, `useAuth`, `AdminPublishersView.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `FormField()` connect `ResetPasswordForm.tsx` to `Route`, `Account & Auth UI`, `account.orders.lazy.tsx`, `App Shell & Theme`, `Community 18`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`, `AdminGamesView.tsx`, `useAuth`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Card()` connect `FormField.tsx` to `Route`, `HTTP Client & API Types`, `Account & Auth UI`, `Community 13`, `Community 16`, `Community 18`, `Community 19`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`, `AdminGamesView.tsx`, `AdminOrdersView.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _290 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.05370843989769821 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06485671191553545 - nodes in this community are weakly interconnected._
- **Should `Product Detail View` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._