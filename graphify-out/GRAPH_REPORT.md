# Graph Report - merch-shop  (2026-08-31)

## Corpus Check
- 273 files · ~70,915 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1007 nodes · 2553 edges · 64 communities (44 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b986b534`
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
- Route
- cart/hooks/index.ts
- AdminGamesView.tsx
- AdminGamesView.tsx
- Route
- Route
- Route
- EmptyState.tsx
- client
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
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `renderFilter()` --calls--> `renderWithProviders()`  [EXTRACTED]
  src/modules/catalog/components/FacetFilterView.test.tsx → src/test-utils.tsx
- `renderView()` --calls--> `renderWithProviders()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutFormView.test.tsx → src/test-utils.tsx

## Import Cycles
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.products.$productSlug.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/shop.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`

## Communities (64 total, 20 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.32
Nodes (5): getContext(), getRouter(), Register, @tanstack/react-router, Register

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.07
Nodes (41): OrderStatus, Badge(), BadgeProps, BadgeTone, Count, Status, StatusDanger, StatusWarning (+33 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.05
Nodes (48): GlobalNav(), LocaleSwitcher(), LocaleSwitcherProps, NavDrawerContent(), NavDrawerContentProps, UtilityShelf(), isSupportedLocale(), useLocale() (+40 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.29
Nodes (10): AdminSkusView(), COLUMNS, EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability(), useCreateSku() (+2 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.08
Nodes (36): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+28 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.10
Nodes (15): FacetDrawerProps, FacetFilterView(), FacetGroupProps, characters, games, GameSelected, MultipleActive, NoSelection (+7 more)

### Community 6 - "Product Detail View"
Cohesion: 0.13
Nodes (19): readLocaleCookie(), writeLocaleCookie(), readLocaleHints, hrefUnderLocale(), redirectToResolvedLocale(), isLocaleSegment(), languageOf(), LocaleHints (+11 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.18
Nodes (14): BADGE_SIZE, EmptyState(), EmptyStateProps, EmptyStateSize, REDUCED_MOTION_OVERRIDE, AdminCharactersView(), COLUMNS, DEFAULTS (+6 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren, LocaleaccountAccountOrdersRouteWithChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.12
Nodes (19): GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props, PublisherNav(), Props (+11 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.13
Nodes (27): Order, Publisher, adminAccount, buyerAccount, mockSignedIn(), envelope(), toRawOrder(), server (+19 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.11
Nodes (31): refreshAccessToken(), ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto, mockAccount, resetAuthMockState() (+23 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.15
Nodes (14): priceLocaleOf(), useFormatPrice(), CartRow(), CartRowProps, CartView(), Props, Empty, items (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (19): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, VALIDATION_KEYS, ValidationKey, Empty (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (13): Route, Route, Route, Route, Route, searchSchema, Route, Route (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (7): Default, NoLabel, Required, Story, WithError, WithFlex, WithStringError

### Community 16 - "Community 16"
Cohesion: 0.27
Nodes (6): BreadcrumbItem, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, RenderBreadcrumbLink, uniqueValues()

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (7): products, multiItems, singleItem, expectNoA11yViolations(), flattenSpaces(), priceText(), renderWithProviders()

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (10): CatalogSectionProps, FeaturedGame, GAME_ORDER, GameRailSectionProps, HeroSectionProps, REDUCED_MOTION_OVERRIDE, Reveal(), Route (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (13): Product, ProductCard(), ProductCardProps, ADR-0008, ProductCatalogView(), ProductCatalogViewProps, Default, Empty (+5 more)

### Community 20 - "AdminTeamsView.tsx"
Cohesion: 0.15
Nodes (12): AdminTeamsView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateTeam(), useDeleteTeam(), useUpdateTeam() (+4 more)

### Community 21 - "useFormatPrice"
Cohesion: 0.29
Nodes (5): Breadcrumb(), BreadcrumbProps, ProductPage, Story, TwoLevels

### Community 22 - "AdminGamesView.tsx"
Cohesion: 0.19
Nodes (8): buildTree(), seededItem, getI18n(), instances, SUPPORTED_LOCALES, SupportedLocale, EMPTY_CART_TITLE, routeTree

### Community 23 - "AdminProductsView.tsx"
Cohesion: 0.18
Nodes (17): AdminProductsView(), COLUMNS, DEFAULTS, FormValues, schema, SECTION_LABEL_PROPS, shortId(), useCreateProduct() (+9 more)

### Community 24 - "Community 24"
Cohesion: 0.07
Nodes (37): ColorModeOption, ColorModeToggle(), ColorModeToggleProps, isColorModeOption(), MODE_ICON, env, worker, CartPage() (+29 more)

### Community 25 - "AuthPageView"
Cohesion: 0.32
Nodes (3): Toaster, breadcrumbItems, product

### Community 27 - "Community 27"
Cohesion: 0.27
Nodes (7): formatPrice(), formatterFor(), formatters, ADR-0017, mockConfirmCardPayment, mockStripe, payLabel()

### Community 29 - "useAuth"
Cohesion: 0.29
Nodes (6): Small, Story, TitleOnly, WithAction, WithDescription, WithIcon

### Community 30 - "AdminPublishersView.tsx"
Cohesion: 0.05
Nodes (36): Props, QueryError(), mockPublishers, GamePageView(), GamePageViewProps, Loaded, Loading, meta (+28 more)

### Community 31 - "AdminOrdersView.tsx"
Cohesion: 0.33
Nodes (6): Character, Game, Team, FacetFilterViewProps, mockGames, twoTeams

### Community 32 - "Route"
Cohesion: 0.18
Nodes (12): FormField(), Label, Props, AdminPublishersView(), COLUMNS, DEFAULTS, FormValues, schema (+4 more)

### Community 33 - "Community 33"
Cohesion: 0.43
Nodes (6): BreadcrumbItem, breadcrumbJsonLd(), buildGameHeadMeta(), buildProductHeadMeta(), GameHeadParams, slugToTitle()

### Community 36 - "__root.tsx"
Cohesion: 0.16
Nodes (17): findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree(), LocaleResources, ParityGap, partitionKeys(), PLURAL_CATEGORIES (+9 more)

### Community 37 - "FormField.tsx"
Cohesion: 0.40
Nodes (4): Default, Interactive, NoClipCorner, Story

### Community 40 - "account.orders.lazy.tsx"
Cohesion: 0.19
Nodes (13): JERSEY, JERSEY, mockConfirmCardPayment, addToCart(), CartState, cartStore, clearCart(), formatVariant() (+5 more)

### Community 41 - "localeLinkGuard.test.tsx"
Cohesion: 0.67
Nodes (4): buildOptimizedImageUrl(), buildVercelImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 42 - "Route"
Cohesion: 0.09
Nodes (20): PaymentIntentResponse, RawOrder, RawProductMutationResponse, RawSku, ServerCart, SyncCartItem, SyncCartResponse, characters (+12 more)

### Community 43 - "Route"
Cohesion: 0.25
Nodes (7): MAX_WIDTH, PageContainer(), PageContainerProps, Large, Medium, Small, Story

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.50
Nodes (3): ORDER_STATUSES, adminOrdersSearch, Route

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 56 - "AdminGamesView.tsx"
Cohesion: 0.20
Nodes (11): AdminFormSheet(), AdminFormSheetProps, AdminGamesView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateGame() (+3 more)

### Community 57 - "AdminGamesView.tsx"
Cohesion: 0.12
Nodes (19): Card(), CardProps, AdminConfirmButton(), AdminConfirmButtonProps, AdminOrdersView(), COLUMNS, fmtDate(), Props (+11 more)

### Community 62 - "EmptyState.tsx"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

### Community 75 - "client"
Cohesion: 0.14
Nodes (11): client, META, MOCK_PRODUCTS, PaginationMeta, RawProduct, RawPublisher, buildSitemapResponse(), Route (+3 more)

## Knowledge Gaps
- **320 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `ADR-0015` (+315 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Catalog Browse Components` to `HTTP Client & API Types`, `Orders Module`, `App Shell & Theme`, `Checkout Form Stories`, `Community 13`, `Community 18`, `AdminProductsView.tsx`, `Community 24`, `AdminPublishersView.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `renderRoute()` connect `Facet Filter Stories` to `Product Detail View`, `account.orders.lazy.tsx`, `Route`, `Community 17`, `AdminGamesView.tsx`, `Community 24`, `Community 27`, `AdminOrdersView.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `FormField()` connect `Route` to `Catalog Browse Components`, `Cart View & Stories`, `Account & Auth UI`, `Community 13`, `Community 15`, `Community 17`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`, `AdminGamesView.tsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _320 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.06502816180235535 - nodes in this community are weakly interconnected._
- **Should `Catalog Browse Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05030834144758196 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07549361207897794 - nodes in this community are weakly interconnected._