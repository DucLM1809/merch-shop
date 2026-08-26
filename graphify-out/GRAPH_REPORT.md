# Graph Report - merch-shop  (2026-08-26)

## Corpus Check
- 260 files · ~62,265 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 940 nodes · 2393 edges · 67 communities (46 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fc86dc4a`
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
- Route
- admin.orders.test.tsx
- SignInForm.tsx
- renderWithProviders
- Route
- Route
- AdminGamesView.tsx
- expectNoA11yViolations
- Route
- Route
- Route
- EmptyState.tsx
- Route
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
10. `FormField()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts
- `HomePage()` --calls--> `useLocale()`  [EXTRACTED]
  src/routes/$locale/index.lazy.tsx → src/i18n/useLocale.ts
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts

## Import Cycles
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.products.$productSlug.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`

## Communities (67 total, 21 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.06
Nodes (38): ORDER_STATUSES, OrderStatus, Badge(), BadgeProps, BadgeTone, Count, Status, StatusDanger (+30 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.22
Nodes (16): refreshAccessToken(), mockAccount, accountKeys, bootstrapAuth(), useDeleteAccount(), useLogin(), useLogout(), useResetPassword() (+8 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.33
Nodes (6): characters, games, renderFilter(), teams, renderView(), renderWithProviders()

### Community 4 - "Publisher Nav UI"
Cohesion: 0.06
Nodes (50): http, RetryableConfig, Account, AccountRole, AdminOrdersFilters, ApiResponse, AuthTokenResponse, BulkAvailabilityDto (+42 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.19
Nodes (5): JERSEY, mockConfirmCardPayment, flattenSpaces(), priceText(), renderRoute()

### Community 6 - "Product Detail View"
Cohesion: 0.09
Nodes (26): buildTree(), seededItem, getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree() (+18 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.24
Nodes (10): AdminCharactersView(), COLUMNS, DEFAULTS, FormValues, schema, AdminFormSheet(), AdminFormSheetProps, useCreateCharacter() (+2 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.05
Nodes (43): FileRoutesByFullPath, FileRoutesByTo, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren, LocaleaccountAccountOrdersRouteWithChildren (+35 more)

### Community 9 - "Orders Module"
Cohesion: 0.08
Nodes (32): ProductFilters, FacetFilter(), GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props (+24 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.18
Nodes (21): Game, Publisher, adminAccount, buyerAccount, mockSignedIn(), envelope(), server, testOrder (+13 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.16
Nodes (11): AuthPageView(), ForgotPasswordForm(), ResetPasswordForm(), Props, VerifyEmailView(), VerifyStatus, useForgotPassword(), useVerifyEmail() (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.05
Nodes (51): formatPrice(), formatterFor(), formatters, priceLocaleOf(), ADR-0017, useFormatPrice(), CartRow(), CartRowProps (+43 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (13): Route, Route, Route, Route, Route, Route, Route, Route (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.20
Nodes (9): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+1 more)

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (7): SKU, BreadcrumbItem, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, RenderBreadcrumbLink, uniqueValues()

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (3): client, buildSitemapResponse(), Route

### Community 18 - "Community 18"
Cohesion: 0.26
Nodes (11): SkuFacet, AdminSkusView(), COLUMNS, EnrichedSku, DEFAULTS, FormValues, schema, useBulkSetSkuAvailability() (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (13): ADR-0008, Product, ProductCardProps, ProductCatalogView(), ProductCatalogViewProps, Default, Empty, Loading (+5 more)

### Community 20 - "AdminTeamsView.tsx"
Cohesion: 0.33
Nodes (8): AdminTeamsView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateTeam(), useDeleteTeam(), useUpdateTeam()

### Community 21 - "useFormatPrice"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 22 - "AdminGamesView.tsx"
Cohesion: 0.08
Nodes (32): LocaleSwitcher(), LocaleSwitcherProps, dateLocaleOf(), formatDate(), formatterFor(), formatters, readLocaleCookie(), writeLocaleCookie() (+24 more)

### Community 23 - "AdminProductsView.tsx"
Cohesion: 0.27
Nodes (10): AdminProductsView(), COLUMNS, DEFAULTS, FormValues, schema, SECTION_LABEL_PROPS, shortId(), useCreateProduct() (+2 more)

### Community 25 - "AuthPageView"
Cohesion: 0.15
Nodes (16): AdminConfirmButton(), AdminConfirmButtonProps, AdminOrdersView(), COLUMNS, fmtDate(), Props, RETRYABLE_STATUSES, AdminColumn (+8 more)

### Community 27 - "Community 27"
Cohesion: 0.06
Nodes (31): Props, QueryError(), mockPublishers, GamePageView(), GamePageViewProps, Loaded, Loading, meta (+23 more)

### Community 29 - "useAuth"
Cohesion: 0.23
Nodes (9): DEFAULTS, FormValues, schema, DEFAULTS, FormValues, schema, SignInForm(), ACCOUNT_VALIDATION_KEYS (+1 more)

### Community 30 - "AdminPublishersView.tsx"
Cohesion: 0.15
Nodes (6): Route, Route, Route, Route, Route, Route

### Community 31 - "AdminOrdersView.tsx"
Cohesion: 0.32
Nodes (3): Toaster, breadcrumbItems, product

### Community 32 - "Route"
Cohesion: 0.29
Nodes (9): AdminPublishersView(), COLUMNS, DEFAULTS, FormValues, schema, AdminRowActions(), useCreatePublisher(), useDeletePublisher() (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.24
Nodes (9): Props, DEFAULTS, FormValues, schema, DEFAULTS, FormValues, schema, SignUpForm() (+1 more)

### Community 36 - "__root.tsx"
Cohesion: 0.29
Nodes (5): Order, toRawOrder(), twoOrders, adminOrdersEnvelope(), testOrders

### Community 37 - "FormField.tsx"
Cohesion: 0.21
Nodes (8): Card(), CardProps, Default, Interactive, NoClipCorner, Story, Props, expectNoA11yViolations()

### Community 39 - "Route"
Cohesion: 0.13
Nodes (11): FacetDrawerProps, FacetFilterView(), FacetGroupProps, characters, games, GameSelected, MultipleActive, NoSelection (+3 more)

### Community 40 - "account.orders.lazy.tsx"
Cohesion: 0.40
Nodes (3): SignIn, SignUp, Story

### Community 41 - "localeLinkGuard.test.tsx"
Cohesion: 0.29
Nodes (9): CartPage(), cartKeys, useAddCartItem(), useCart(), useCartSync(), useMergeCart(), useRemoveCartItem(), Route (+1 more)

### Community 42 - "Route"
Cohesion: 0.17
Nodes (8): META, MOCK_PRODUCTS, PaginationMeta, RawProduct, RawPublisher, MOCK_GAMES, MOCK_PRODUCTS, MOCK_PUBLISHERS

### Community 43 - "Route"
Cohesion: 0.24
Nodes (7): MAX_WIDTH, PageContainer(), PageContainerProps, Large, Medium, Small, Story

### Community 46 - "$locale.tsx"
Cohesion: 0.28
Nodes (6): env, AuthBootstrapEffect(), CartSyncEffect(), MyRouterContext, RootDocument(), registerHardSignOutHandler()

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.17
Nodes (18): GlobalNav(), NavDrawerContent(), NavDrawerContentProps, useLocale(), useAccount(), useAuth(), AdminLayout(), NAV_ITEMS (+10 more)

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 49 - "$locale/index.tsx"
Cohesion: 0.29
Nodes (8): loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal(), wrap(), wrapEnvelope()

### Community 53 - "SignInForm.tsx"
Cohesion: 0.50
Nodes (4): mockOrders, assertRenderedInternalLinksAreLocalePrefixed(), EXEMPT_HREFS, LOCALE_PREFIX_PATTERN

### Community 57 - "AdminGamesView.tsx"
Cohesion: 0.31
Nodes (9): AdminGamesView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateGame(), useDeleteGame(), useUpdateGame() (+1 more)

### Community 58 - "expectNoA11yViolations"
Cohesion: 0.24
Nodes (5): Breadcrumb(), BreadcrumbProps, ProductPage, Story, TwoLevels

### Community 62 - "EmptyState.tsx"
Cohesion: 0.28
Nodes (6): EmptyState(), EmptyStateProps, Story, TitleOnly, WithDescription, WithIcon

### Community 66 - "ProductDetailView.stories.tsx"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

## Knowledge Gaps
- **294 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+289 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `ResetPasswordForm.tsx` to `Community 33`, `HTTP Client & API Types`, `Orders Module`, `App Shell & Theme`, `Community 13`, `$locale.tsx`, `AdminGamesView.tsx`, `Community 27`, `useAuth`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `FormField()` connect `Community 15` to `Route`, `Community 33`, `Account & Auth UI`, `Community 13`, `Community 18`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`, `AdminGamesView.tsx`, `useAuth`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `renderWithProviders()` connect `Cart View & Stories` to `HTTP Client & API Types`, `FormField.tsx`, `Catalog View Tests`, `Product Detail View`, `Orders Module`, `Route`, `Community 13`, `Community 15`, `ResetPasswordForm.tsx`, `Community 19`, `useFormatPrice`, `AdminGamesView.tsx`, `SignInForm.tsx`, `expectNoA11yViolations`, `Community 27`, `EmptyState.tsx`, `AdminOrdersView.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _294 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.06370543541788427 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.062310949788263764 - nodes in this community are weakly interconnected._
- **Should `Product Detail View` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._