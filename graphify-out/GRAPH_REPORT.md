# Graph Report - merch-shop  (2026-08-31)

## Corpus Check
- 273 files · ~70,627 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1007 nodes · 2551 edges · 70 communities (49 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbbbf497`
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
- ColorModeToggle.tsx
- CartView.tsx
- SignInForm.tsx
- GamePage.tsx
- cart/hooks/index.ts
- AdminGamesView.tsx
- AdminGamesView.tsx
- PublisherPageView.tsx
- Route
- admin.orders.test.tsx
- EmptyState.tsx
- ProductCatalogView.stories.tsx
- SignInForm.tsx
- seo.ts
- client
- Route
- Route
- Route
- Route

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 49 edges
2. `renderRoute()` - 33 edges
3. `FileRoutesByPath` - 31 edges
4. `renderWithProviders()` - 28 edges
5. `server` - 22 edges
6. `useFormatPrice()` - 20 edges
7. `envelope()` - 19 edges
8. `useAuth()` - 17 edges
9. `mockSignedIn()` - 16 edges
10. `EmptyState()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `CartRow()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/cart/components/CartView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `ShopPage()` --calls--> `useLocale()`  [EXTRACTED]
  src/routes/$locale/(catalog)/shop.lazy.tsx → src/i18n/useLocale.ts

## Import Cycles
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.products.$productSlug.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/shop.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`

## Communities (70 total, 21 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.11
Nodes (28): OrderStatus, Badge(), BadgeProps, BadgeTone, TONE_PALETTE, useFormatDate(), useFormatPrice(), OrderConfirmationPage() (+20 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.18
Nodes (12): DEFAULTS, FormValues, schema, Props, DEFAULTS, FormValues, schema, DEFAULTS (+4 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.18
Nodes (14): SkuFacet, AdminConfirmButton(), AdminConfirmButtonProps, AdminSkusView(), COLUMNS, EnrichedSku, DEFAULTS, FormValues (+6 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.07
Nodes (42): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+34 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.05
Nodes (26): Toaster, items, FacetDrawerProps, FacetFilterView(), FacetGroupProps, characters, games, GameSelected (+18 more)

### Community 6 - "Product Detail View"
Cohesion: 0.09
Nodes (31): LocaleSwitcher(), LocaleSwitcherProps, dateLocaleOf(), formatDate(), formatterFor(), formatters, readLocaleCookie(), writeLocaleCookie() (+23 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.26
Nodes (9): AdminCharactersView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateCharacter(), useDeleteCharacter(), useUpdateCharacter() (+1 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren, LocaleaccountAccountOrdersRouteWithChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.16
Nodes (10): GamePage(), ProductDetail(), PublisherPage(), productQueryOptions(), publisherQueryOptions(), useProduct(), usePublisher(), Route (+2 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.17
Nodes (19): adminAccount, buyerAccount, mockSignedIn(), envelope(), handlers, resetAuthMockState(), server, testOrder (+11 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.12
Nodes (26): refreshAccessToken(), mockAccount, ForgotPasswordForm(), Props, VerifyEmailView(), VerifyStatus, accountKeys, bootstrapAuth() (+18 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (19): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, VALIDATION_KEYS, ValidationKey, Empty (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (13): Route, Route, Route, Route, Route, Route, Route, Route (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (10): FormField(), Label, Props, Default, NoLabel, Required, Story, WithError (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (14): SKU, Breadcrumb(), BreadcrumbItem, BreadcrumbProps, ProductPage, Story, TwoLevels, Props (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (9): Character, Game, RawPublisher, Team, FacetFilterViewProps, buildSitemapResponse(), MOCK_GAMES, MOCK_PRODUCTS (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (11): CatalogSectionProps, FeaturedGame, GAME_ORDER, GAME_TILE_SEED, GameRailSectionProps, HeroSectionProps, REDUCED_MOTION_OVERRIDE, Reveal() (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.23
Nodes (10): FacetFilter(), FacetFilterProps, FacetFilterSearch, catalogKeys, productsQueryOptions(), useCharacters(), useProducts(), usePublishers() (+2 more)

### Community 20 - "AdminTeamsView.tsx"
Cohesion: 0.33
Nodes (8): AdminTeamsView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateTeam(), useDeleteTeam(), useUpdateTeam()

### Community 21 - "useFormatPrice"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 22 - "AdminGamesView.tsx"
Cohesion: 0.22
Nodes (7): ProductFilters, Props, ProductCatalog(), Props, PublisherNav(), Route, ShopPage()

### Community 23 - "AdminProductsView.tsx"
Cohesion: 0.24
Nodes (11): CreateProductDto, AdminProductsView(), COLUMNS, DEFAULTS, FormValues, schema, SECTION_LABEL_PROPS, shortId() (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (27): ColorModeOption, ColorModeToggle(), ColorModeToggleProps, isColorModeOption(), MODE_ICON, env, worker, AuthBootstrapEffect() (+19 more)

### Community 25 - "AuthPageView"
Cohesion: 0.17
Nodes (14): AdminOrdersView(), COLUMNS, fmtDate(), Props, RETRYABLE_STATUSES, AdminColumn, AdminRowActions(), AdminRowActionsProps (+6 more)

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (9): NavLink, Props, CatalogGameLinkParams, CatalogGameTo, CatalogNavLinkRenderer, CatalogPublisherLinkParams, CatalogPublisherTo, PublisherNavViewProps (+1 more)

### Community 29 - "useAuth"
Cohesion: 0.17
Nodes (10): BADGE_SIZE, EmptyStateProps, EmptyStateSize, REDUCED_MOTION_OVERRIDE, Small, Story, TitleOnly, WithAction (+2 more)

### Community 30 - "AdminPublishersView.tsx"
Cohesion: 0.13
Nodes (13): mockPublishers, PublisherNavView(), Default, GameActive, Loading, meta, PublisherActive, Story (+5 more)

### Community 31 - "AdminOrdersView.tsx"
Cohesion: 0.40
Nodes (4): Publisher, mockGames, mockPublishers, twoProducts

### Community 32 - "Route"
Cohesion: 0.30
Nodes (9): AdminPublishersView(), COLUMNS, DEFAULTS, FormValues, schema, AdminTableRow(), useCreatePublisher(), useDeletePublisher() (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.14
Nodes (21): GlobalNav(), NavDrawerContent(), NavDrawerContentProps, UtilityShelf(), useLocale(), AuthPageView(), PANEL_INLINE_PADDING, Props (+13 more)

### Community 36 - "__root.tsx"
Cohesion: 0.12
Nodes (21): buildTree(), seededItem, getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree() (+13 more)

### Community 37 - "FormField.tsx"
Cohesion: 0.29
Nodes (6): Card(), CardProps, Default, Interactive, NoClipCorner, Story

### Community 40 - "account.orders.lazy.tsx"
Cohesion: 0.06
Nodes (41): formatPrice(), formatterFor(), formatters, priceLocaleOf(), ADR-0017, CartPage(), CartRow(), CartRowProps (+33 more)

### Community 41 - "localeLinkGuard.test.tsx"
Cohesion: 0.50
Nodes (4): mockOrders, assertRenderedInternalLinksAreLocalePrefixed(), EXEMPT_HREFS, LOCALE_PREFIX_PATTERN

### Community 42 - "Route"
Cohesion: 0.10
Nodes (17): LoginDto, PaymentIntentResponse, RawOrder, ResetPasswordDto, ServerCart, VerifyEmailDto, characters, games (+9 more)

### Community 43 - "Route"
Cohesion: 0.15
Nodes (11): MAX_WIDTH, PageContainer(), PageContainerProps, Large, Medium, Small, Story, OrdersLayoutProps (+3 more)

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.33
Nodes (5): Count, Status, StatusDanger, StatusWarning, Story

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 51 - "ColorModeToggle.tsx"
Cohesion: 0.50
Nodes (3): ORDER_STATUSES, adminOrdersSearch, Route

### Community 54 - "GamePage.tsx"
Cohesion: 0.21
Nodes (8): Props, QueryError(), GamePageView(), GamePageViewProps, Loaded, Loading, meta, Story

### Community 56 - "AdminGamesView.tsx"
Cohesion: 0.24
Nodes (10): AdminFormSheet(), AdminFormSheetProps, AdminGamesView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateGame() (+2 more)

### Community 57 - "AdminGamesView.tsx"
Cohesion: 0.13
Nodes (9): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route (+1 more)

### Community 59 - "PublisherPageView.tsx"
Cohesion: 0.21
Nodes (7): Props, PublisherPageView(), PublisherPageViewProps, Loaded, Loading, meta, Story

### Community 61 - "admin.orders.test.tsx"
Cohesion: 0.29
Nodes (5): Order, toRawOrder(), twoOrders, adminOrdersEnvelope(), testOrders

### Community 62 - "EmptyState.tsx"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

### Community 66 - "ProductCatalogView.stories.tsx"
Cohesion: 0.16
Nodes (14): Product, EmptyState(), ProductCard(), ProductCardProps, ADR-0008, ProductCatalogView(), ProductCatalogViewProps, Default (+6 more)

### Community 69 - "SignInForm.tsx"
Cohesion: 0.70
Nodes (3): DEFAULTS, FormValues, schema

### Community 71 - "seo.ts"
Cohesion: 0.43
Nodes (6): BreadcrumbItem, breadcrumbJsonLd(), buildGameHeadMeta(), buildProductHeadMeta(), GameHeadParams, slugToTitle()

## Knowledge Gaps
- **321 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `ADR-0015` (+316 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Community 33` to `HTTP Client & API Types`, `Catalog Browse Components`, `SignInForm.tsx`, `Product Detail View`, `account.orders.lazy.tsx`, `Orders Module`, `App Shell & Theme`, `Checkout Form Stories`, `Community 13`, `Community 16`, `Community 18`, `Community 19`, `AdminGamesView.tsx`, `Community 24`, `AdminGamesView.tsx`, `Community 27`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `renderRoute()` connect `Facet Filter Stories` to `__root.tsx`, `Catalog View Tests`, `Product Detail View`, `account.orders.lazy.tsx`, `localeLinkGuard.test.tsx`, `Route`, `Community 24`, `admin.orders.test.tsx`, `AdminOrdersView.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `FormField()` connect `Community 15` to `Route`, `Catalog Browse Components`, `Cart View & Stories`, `SignInForm.tsx`, `Catalog View Tests`, `Account & Auth UI`, `Community 13`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`, `AdminGamesView.tsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _321 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.1091753774680604 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06612244897959184 - nodes in this community are weakly interconnected._
- **Should `Catalog View Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.05182443151771549 - nodes in this community are weakly interconnected._