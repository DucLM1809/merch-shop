# Graph Report - merch-shop  (2026-08-26)

## Corpus Check
- 255 files · ~60,505 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 917 nodes · 2265 edges · 60 communities (39 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e927f10`
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
- Community 26
- Community 27
- Community 28
- useAuth
- AdminPublishersView.tsx
- Route
- Community 33
- Community 34
- Community 35
- FormField.tsx
- Route
- Route
- account.orders.lazy.tsx
- Route
- Route
- Route
- Route
- ResetPasswordForm.tsx
- i18next.d.ts
- ProductDetailView.stories.tsx
- $locale/index.tsx
- admin.orders.test.tsx
- SignInForm.tsx
- renderWithProviders
- AdminGamesView.tsx
- expectNoA11yViolations
- PageContainer.tsx
- useAuth
- EmptyState.tsx
- ResetPasswordForm.tsx
- Route
- Route
- ProductDetailView.stories.tsx
- SignUpForm.tsx
- seo.ts

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 43 edges
2. `renderRoute()` - 31 edges
3. `FileRoutesByPath` - 30 edges
4. `renderWithProviders()` - 26 edges
5. `server` - 21 edges
6. `useFormatPrice()` - 18 edges
7. `envelope()` - 18 edges
8. `useAuth()` - 17 edges
9. `mockSignedIn()` - 16 edges
10. `FormField()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `CartRow()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/cart/components/CartView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `HomePage()` --calls--> `useLocale()`  [EXTRACTED]
  src/routes/$locale/index.lazy.tsx → src/i18n/useLocale.ts

## Import Cycles
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.products.$productSlug.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`

## Communities (60 total, 21 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.32
Nodes (5): getContext(), getRouter(), Register, @tanstack/react-router, Register

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.06
Nodes (39): ORDER_STATUSES, OrderStatus, Badge(), BadgeProps, BadgeTone, Count, Status, StatusDanger (+31 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.27
Nodes (6): Character, Game, Team, FacetDrawerProps, FacetFilterViewProps, FacetGroupProps

### Community 3 - "Cart View & Stories"
Cohesion: 0.05
Nodes (40): buildTree(), seededItem, Toaster, formatPrice(), formatterFor(), formatters, ADR-0017, getI18n() (+32 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.08
Nodes (37): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+29 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.29
Nodes (9): CartPage(), cartKeys, useAddCartItem(), useCart(), useCartSync(), useMergeCart(), useRemoveCartItem(), Route (+1 more)

### Community 6 - "Product Detail View"
Cohesion: 0.16
Nodes (17): findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree(), LocaleResources, ParityGap, partitionKeys(), PLURAL_CATEGORIES (+9 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.26
Nodes (9): AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter(), useDeleteCharacter(), useUpdateCharacter() (+1 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.05
Nodes (43): FileRoutesByFullPath, FileRoutesByTo, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren, LocaleaccountAccountOrdersRouteWithChildren (+35 more)

### Community 9 - "Orders Module"
Cohesion: 0.11
Nodes (21): ProductFilters, GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props, PublisherNav() (+13 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.13
Nodes (24): Publisher, adminAccount, buyerAccount, mockSignedIn(), envelope(), server, twoOrders, testOrder (+16 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.13
Nodes (19): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, VALIDATION_KEYS, ValidationKey, Empty (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.19
Nodes (14): CartRow(), CartRowProps, CartView(), Props, CartItem, CartState, cartStore, formatVariant() (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (13): Route, Route, Route, Route, Route, Route, Route, Route (+5 more)

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (7): SKU, BreadcrumbItem, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, RenderBreadcrumbLink, uniqueValues()

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (10): client, META, MOCK_PRODUCTS, PaginationMeta, RawProduct, RawPublisher, buildSitemapResponse(), MOCK_GAMES (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.27
Nodes (11): CreateSkuDto, SkuFacet, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability() (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (15): ADR-0008, Product, priceLocaleOf(), useFormatPrice(), ProductCard(), ProductCardProps, ProductCatalogView(), ProductCatalogViewProps (+7 more)

### Community 20 - "AdminTeamsView.tsx"
Cohesion: 0.31
Nodes (9): AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam(), useDeleteTeam(), useUpdateTeam() (+1 more)

### Community 21 - "useFormatPrice"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 22 - "AdminGamesView.tsx"
Cohesion: 0.12
Nodes (18): readLocaleCookie(), writeLocaleCookie(), readLocaleHints, hrefUnderLocale(), redirectToResolvedLocale(), isLocaleSegment(), languageOf(), LocaleHints (+10 more)

### Community 23 - "AdminProductsView.tsx"
Cohesion: 0.20
Nodes (13): AdminProductsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateProduct(), useDeleteProduct(), useUpdateProduct() (+5 more)

### Community 24 - "Community 24"
Cohesion: 0.09
Nodes (21): PaymentIntentResponse, RawOrder, RawProductMutationResponse, ResetPasswordDto, SyncCartItem, VerifyEmailDto, worker, characters (+13 more)

### Community 27 - "Community 27"
Cohesion: 0.09
Nodes (21): Props, QueryError(), mockPublishers, GamePageView(), GamePageViewProps, Loaded, Loading, meta (+13 more)

### Community 29 - "useAuth"
Cohesion: 0.21
Nodes (10): NavLink, Props, CatalogGameLinkParams, CatalogGameTo, CatalogNavLinkRenderer, CatalogPublisherLinkParams, CatalogPublisherTo, PublisherNavView() (+2 more)

### Community 30 - "AdminPublishersView.tsx"
Cohesion: 0.11
Nodes (16): AdminLayout(), NAV_ITEMS, NavItem, Props, AdminPublishersView(), DEFAULTS, FormValues, schema (+8 more)

### Community 32 - "Route"
Cohesion: 0.33
Nodes (5): Empty, items, MultipleItems, SingleItem, Story

### Community 37 - "FormField.tsx"
Cohesion: 0.13
Nodes (10): Card(), CardProps, Default, Interactive, NoClipCorner, Story, Props, SignIn (+2 more)

### Community 39 - "Route"
Cohesion: 0.22
Nodes (8): characters, games, GameSelected, MultipleActive, NoSelection, Story, teams, TeamSelected

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.11
Nodes (21): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+13 more)

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 52 - "admin.orders.test.tsx"
Cohesion: 0.50
Nodes (4): Order, toRawOrder(), adminOrdersEnvelope(), testOrders

### Community 57 - "AdminGamesView.tsx"
Cohesion: 0.31
Nodes (9): AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame(), useUpdateGame() (+1 more)

### Community 58 - "expectNoA11yViolations"
Cohesion: 0.24
Nodes (5): Breadcrumb(), BreadcrumbProps, ProductPage, Story, TwoLevels

### Community 59 - "PageContainer.tsx"
Cohesion: 0.24
Nodes (7): MAX_WIDTH, PageContainer(), PageContainerProps, Large, Medium, Small, Story

### Community 60 - "useAuth"
Cohesion: 0.06
Nodes (65): refreshAccessToken(), GlobalNav(), LocaleSwitcher(), LocaleSwitcherProps, NavDrawerContent(), NavDrawerContentProps, env, dateLocaleOf() (+57 more)

### Community 62 - "EmptyState.tsx"
Cohesion: 0.29
Nodes (6): EmptyState(), EmptyStateProps, Story, TitleOnly, WithDescription, WithIcon

### Community 66 - "ProductDetailView.stories.tsx"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

### Community 71 - "seo.ts"
Cohesion: 0.43
Nodes (6): BreadcrumbItem, breadcrumbJsonLd(), buildGameHeadMeta(), buildProductHeadMeta(), GameHeadParams, slugToTitle()

## Knowledge Gaps
- **285 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+280 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `useAuth` to `HTTP Client & API Types`, `Orders Module`, `App Shell & Theme`, `Community 13`, `ResetPasswordForm.tsx`, `AdminProductsView.tsx`, `useAuth`, `AdminPublishersView.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `FormField()` connect `ResetPasswordForm.tsx` to `Cart View & Stories`, `Account & Auth UI`, `App Shell & Theme`, `Community 18`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`, `AdminGamesView.tsx`, `useAuth`, `AdminPublishersView.tsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `renderWithProviders()` connect `Cart View & Stories` to `HTTP Client & API Types`, `Orders Module`, `PageContainer.tsx`, `App Shell & Theme`, `Facet Filter Stories`, `useFormatPrice`, `expectNoA11yViolations`, `Community 27`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _285 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.06168831168831169 - nodes in this community are weakly interconnected._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07641196013289037 - nodes in this community are weakly interconnected._