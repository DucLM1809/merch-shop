# Graph Report - merch-shop  (2026-08-31)

## Corpus Check
- 271 files · ~68,579 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1006 nodes · 2531 edges · 57 communities (38 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d81f53a6`
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
- $locale/index.tsx
- $locale/index.tsx
- SignInForm.tsx
- AdminGamesView.tsx
- Route
- EmptyState.tsx
- Route
- Route

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 45 edges
2. `renderRoute()` - 33 edges
3. `FileRoutesByPath` - 31 edges
4. `renderWithProviders()` - 27 edges
5. `server` - 21 edges
6. `useFormatPrice()` - 20 edges
7. `envelope()` - 18 edges
8. `useAuth()` - 17 edges
9. `mockSignedIn()` - 16 edges
10. `EmptyState()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `ProductCard()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `ProductDetailViewProps` --references--> `SKU`  [EXTRACTED]
  src/modules/catalog/components/ProductDetailView.tsx → src/api/types.ts
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductDetailView.tsx → src/api/types.ts

## Import Cycles
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.products.$productSlug.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/shop.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`

## Communities (57 total, 19 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.05
Nodes (57): ORDER_STATUSES, OrderStatus, Badge(), BadgeProps, BadgeTone, Count, Status, StatusDanger (+49 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.14
Nodes (15): DEFAULTS, FormValues, schema, Props, DEFAULTS, FormValues, schema, DEFAULTS (+7 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.25
Nodes (12): CreateSkuDto, SkuFacet, AdminSkusView(), COLUMNS, EnrichedSku, DEFAULTS, FormValues, schema (+4 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.08
Nodes (35): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+27 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.13
Nodes (11): FacetDrawerProps, FacetFilterView(), FacetGroupProps, characters, games, GameSelected, MultipleActive, NoSelection (+3 more)

### Community 6 - "Product Detail View"
Cohesion: 0.06
Nodes (49): LocaleSwitcher(), LocaleSwitcherProps, dateLocaleOf(), formatDate(), formatterFor(), formatters, instances, findKeyParityGaps() (+41 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.31
Nodes (9): AdminCharactersView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateCharacter(), useDeleteCharacter(), useUpdateCharacter() (+1 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren, LocaleaccountAccountOrdersRouteWithChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.08
Nodes (33): ProductFilters, FacetFilter(), FacetFilterProps, FacetFilterSearch, GamePage(), Props, ProductCatalog(), Props (+25 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.09
Nodes (33): Game, Order, adminAccount, buyerAccount, mockSignedIn(), envelope(), toRawOrder(), server (+25 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.15
Nodes (20): refreshAccessToken(), ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto, mockAccount, resetAuthMockState() (+12 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.12
Nodes (15): ForgotPasswordForm(), ResetPasswordForm(), SignUpForm(), Props, VerifyEmailView(), VerifyStatus, accountKeys, useDeleteAccount() (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.05
Nodes (51): formatPrice(), formatterFor(), formatters, priceLocaleOf(), ADR-0017, useFormatPrice(), CartRow(), CartRowProps (+43 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (13): Route, Route, Route, Route, Route, Route, Route, Route (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (7): Default, NoLabel, Required, Story, WithError, WithFlex, WithStringError

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (14): BreadcrumbItem, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, RenderBreadcrumbLink, Default, EditionVariants, Error (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (11): client, META, MOCK_PRODUCTS, PaginationMeta, RawProduct, RawPublisher, buildSitemapResponse(), Route (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (13): BENTO_GRID_PROPS, FeaturedDropsSectionProps, FeaturedGame, GAME_ORDER, GAME_TILE_SEED, HeroSectionProps, REDUCED_MOTION_OVERRIDE, Reveal() (+5 more)

### Community 19 - "Community 19"
Cohesion: 0.14
Nodes (15): ADR-0008, Product, ProductCard(), ProductCardProps, ProductCatalogView(), ProductCatalogViewProps, Default, Empty (+7 more)

### Community 20 - "AdminTeamsView.tsx"
Cohesion: 0.33
Nodes (8): AdminTeamsView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateTeam(), useDeleteTeam(), useUpdateTeam()

### Community 21 - "useFormatPrice"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 22 - "AdminGamesView.tsx"
Cohesion: 0.24
Nodes (5): Breadcrumb(), BreadcrumbProps, ProductPage, Story, TwoLevels

### Community 23 - "AdminProductsView.tsx"
Cohesion: 0.27
Nodes (10): AdminProductsView(), COLUMNS, DEFAULTS, FormValues, schema, SECTION_LABEL_PROPS, shortId(), useCreateProduct() (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.06
Nodes (44): ColorModeOption, ColorModeToggle(), ColorModeToggleProps, isColorModeOption(), MODE_ICON, buildTree(), seededItem, env (+36 more)

### Community 25 - "AuthPageView"
Cohesion: 0.14
Nodes (17): AdminConfirmButton(), AdminConfirmButtonProps, AdminOrdersView(), COLUMNS, fmtDate(), Props, RETRYABLE_STATUSES, AdminColumn (+9 more)

### Community 27 - "Community 27"
Cohesion: 0.06
Nodes (32): Publisher, Props, QueryError(), mockPublishers, GamePageView(), GamePageViewProps, Loaded, Loading (+24 more)

### Community 29 - "useAuth"
Cohesion: 0.33
Nodes (5): BADGE_SIZE, EmptyState(), EmptyStateProps, EmptyStateSize, REDUCED_MOTION_OVERRIDE

### Community 30 - "AdminPublishersView.tsx"
Cohesion: 0.40
Nodes (3): SignIn, SignUp, Story

### Community 31 - "AdminOrdersView.tsx"
Cohesion: 0.16
Nodes (9): Toaster, characters, games, renderFilter(), teams, breadcrumbItems, product, renderView() (+1 more)

### Community 32 - "Route"
Cohesion: 0.24
Nodes (10): AdminFormSheet(), AdminFormSheetProps, AdminPublishersView(), COLUMNS, DEFAULTS, FormValues, schema, useCreatePublisher() (+2 more)

### Community 37 - "FormField.tsx"
Cohesion: 0.21
Nodes (8): Card(), CardProps, Default, Interactive, NoClipCorner, Story, GRID_PATTERN, Props

### Community 41 - "localeLinkGuard.test.tsx"
Cohesion: 0.12
Nodes (10): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route (+2 more)

### Community 43 - "Route"
Cohesion: 0.24
Nodes (7): MAX_WIDTH, PageContainer(), PageContainerProps, Large, Medium, Small, Story

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 53 - "SignInForm.tsx"
Cohesion: 0.09
Nodes (21): Account, PaymentIntentResponse, RawOrder, RawProductMutationResponse, RawSku, ServerCart, SyncCartItem, SyncCartResponse (+13 more)

### Community 57 - "AdminGamesView.tsx"
Cohesion: 0.21
Nodes (11): FormField(), Label, Props, AdminGamesView(), COLUMNS, DEFAULTS, FormValues, schema (+3 more)

### Community 62 - "EmptyState.tsx"
Cohesion: 0.29
Nodes (6): Small, Story, TitleOnly, WithAction, WithDescription, WithIcon

## Knowledge Gaps
- **321 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `ADR-0015` (+316 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `HTTP Client & API Types` to `Catalog Browse Components`, `Product Detail View`, `localeLinkGuard.test.tsx`, `Orders Module`, `Checkout Form Stories`, `Community 13`, `Community 18`, `Community 24`, `Community 27`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `Card()` connect `FormField.tsx` to `HTTP Client & API Types`, `Cart View & Stories`, `Community 13`, `Community 16`, `Community 18`, `Community 19`, `AdminProductsView.tsx`, `AuthPageView`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `FormField()` connect `AdminGamesView.tsx` to `Route`, `Catalog Browse Components`, `Cart View & Stories`, `Account & Auth UI`, `Community 13`, `Community 15`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _321 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.05052125100240577 - nodes in this community are weakly interconnected._
- **Should `Catalog Browse Components` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07804878048780488 - nodes in this community are weakly interconnected._