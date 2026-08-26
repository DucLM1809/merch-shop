# Graph Report - merch-shop  (2026-08-26)

## Corpus Check
- 268 files · ~64,750 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 978 nodes · 2475 edges · 67 communities (48 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3785b39d`
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
- ProductDetailView.stories.tsx

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 43 edges
2. `renderRoute()` - 32 edges
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
- `CartRow()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/cart/components/CartView.tsx → src/i18n/useFormatPrice.ts
- `ProductCard()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts

## Import Cycles
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.products.$productSlug.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`

## Communities (67 total, 19 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.14
Nodes (16): OrderConfirmationPage(), OrderDetailPage(), adminOrdersQueryOptions(), orderKeys, useAdminOrders(), useOrder(), useOrderByPaymentIntent(), useOrders() (+8 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.07
Nodes (47): refreshAccessToken(), AuthPageView(), ForgotPasswordForm(), DEFAULTS, FormValues, schema, Props, ResetPasswordForm() (+39 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.12
Nodes (16): OrderStatus, BadgeProps, BadgeTone, Count, Status, StatusDanger, StatusWarning, Story (+8 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.06
Nodes (41): ApiError, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku(), parseDecimal() (+33 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.16
Nodes (7): products, multiItems, singleItem, expectNoA11yViolations(), flattenSpaces(), priceText(), renderWithProviders()

### Community 6 - "Product Detail View"
Cohesion: 0.09
Nodes (26): buildTree(), seededItem, getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree() (+18 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.31
Nodes (9): AdminCharactersView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateCharacter(), useDeleteCharacter(), useUpdateCharacter() (+1 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.05
Nodes (43): FileRoutesByFullPath, FileRoutesByTo, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren, LocaleaccountAccountOrdersRouteWithChildren (+35 more)

### Community 9 - "Orders Module"
Cohesion: 0.06
Nodes (42): ProductFilters, FacetFilter(), GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props (+34 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.15
Nodes (22): Order, adminAccount, buyerAccount, mockSignedIn(), envelope(), resetAuthMockState(), toRawOrder(), server (+14 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.18
Nodes (14): JERSEY, JERSEY, mockConfirmCardPayment, addToCart(), CartState, cartStore, clearCart(), formatVariant() (+6 more)

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
Cohesion: 0.25
Nodes (7): SKU, BreadcrumbItem, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, RenderBreadcrumbLink, uniqueValues()

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (3): client, buildSitemapResponse(), Route

### Community 18 - "Community 18"
Cohesion: 0.21
Nodes (14): BulkAvailabilityDto, CreateCharacterDto, CreateSkuDto, SkuFacet, AdminSkusView(), COLUMNS, EnrichedSku, DEFAULTS (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.16
Nodes (13): ADR-0008, Product, ProductCard(), ProductCardProps, ProductCatalogView(), ProductCatalogViewProps, Default, Empty (+5 more)

### Community 20 - "AdminTeamsView.tsx"
Cohesion: 0.29
Nodes (9): CreateTeamDto, AdminTeamsView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateTeam(), useDeleteTeam() (+1 more)

### Community 21 - "useFormatPrice"
Cohesion: 0.70
Nodes (3): buildOptimizedImageUrl(), OptimizedImage(), OptimizedImageProps

### Community 22 - "AdminGamesView.tsx"
Cohesion: 0.19
Nodes (14): readLocaleHints, hrefUnderLocale(), redirectToResolvedLocale(), SUPPORTED_LOCALES, SupportedLocale, isLocaleSegment(), languageOf(), matchLocale() (+6 more)

### Community 23 - "AdminProductsView.tsx"
Cohesion: 0.24
Nodes (11): CreateProductDto, AdminProductsView(), COLUMNS, DEFAULTS, FormValues, schema, SECTION_LABEL_PROPS, shortId() (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.16
Nodes (11): CartRow(), CartRowProps, CartView(), Props, Empty, items, MultipleItems, SingleItem (+3 more)

### Community 25 - "AuthPageView"
Cohesion: 0.15
Nodes (16): AdminConfirmButton(), AdminConfirmButtonProps, AdminOrdersView(), COLUMNS, fmtDate(), Props, RETRYABLE_STATUSES, AdminColumn (+8 more)

### Community 27 - "Community 27"
Cohesion: 0.09
Nodes (21): Props, QueryError(), mockPublishers, GamePageView(), GamePageViewProps, Loaded, Loading, meta (+13 more)

### Community 29 - "useAuth"
Cohesion: 0.22
Nodes (7): readLocaleCookie(), writeLocaleCookie(), LocaleHints, load(), LocaleState, localeStore, loadStore()

### Community 30 - "AdminPublishersView.tsx"
Cohesion: 0.12
Nodes (10): AdminLayout(), NAV_ITEMS, NavItem, Props, Route, Route, Route, Route (+2 more)

### Community 31 - "AdminOrdersView.tsx"
Cohesion: 0.32
Nodes (3): Toaster, breadcrumbItems, product

### Community 32 - "Route"
Cohesion: 0.26
Nodes (10): CreatePublisherDto, AdminPublishersView(), COLUMNS, DEFAULTS, FormValues, schema, AdminRowActions(), useCreatePublisher() (+2 more)

### Community 33 - "Community 33"
Cohesion: 0.24
Nodes (8): formatPrice(), formatterFor(), formatters, priceLocaleOf(), ADR-0017, mockConfirmCardPayment, mockStripe, payLabel()

### Community 36 - "__root.tsx"
Cohesion: 0.32
Nodes (8): dateLocaleOf(), formatDate(), formatterFor(), formatters, useFormatDate(), useFormatPrice(), OrderCard(), Route

### Community 37 - "FormField.tsx"
Cohesion: 0.22
Nodes (8): Card(), CardProps, Default, Interactive, NoClipCorner, Story, GRID_PATTERN, Props

### Community 39 - "Route"
Cohesion: 0.10
Nodes (15): FacetDrawerProps, FacetFilterView(), FacetGroupProps, characters, games, GameSelected, MultipleActive, NoSelection (+7 more)

### Community 40 - "account.orders.lazy.tsx"
Cohesion: 0.40
Nodes (3): SignIn, SignUp, Story

### Community 41 - "localeLinkGuard.test.tsx"
Cohesion: 0.07
Nodes (39): SyncCartItem, clearColorModeCookie(), readColorModeCookie(), writeColorModeCookie(), readColorModeHints, COLOR_MODES, ColorMode, ColorModeHints (+31 more)

### Community 42 - "Route"
Cohesion: 0.25
Nodes (6): Publisher, mockPublishers, twoGames, mockGames, mockPublishers, twoProducts

### Community 43 - "Route"
Cohesion: 0.25
Nodes (7): MAX_WIDTH, PageContainer(), PageContainerProps, Large, Medium, Small, Story

### Community 46 - "$locale.tsx"
Cohesion: 0.33
Nodes (6): Character, Game, Team, FacetFilterViewProps, mockGames, twoTeams

### Community 47 - "ResetPasswordForm.tsx"
Cohesion: 0.24
Nodes (14): Badge(), GlobalNav(), LocaleSwitcher(), LocaleSwitcherProps, NavDrawerContent(), NavDrawerContentProps, isSupportedLocale(), useLocale() (+6 more)

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 49 - "$locale/index.tsx"
Cohesion: 0.50
Nodes (3): ORDER_STATUSES, adminOrdersSearch, Route

### Community 53 - "SignInForm.tsx"
Cohesion: 0.11
Nodes (16): LoginDto, ServerCart, VerifyEmailDto, characters, games, mockAccount, mockOrders, ProductRecord (+8 more)

### Community 57 - "AdminGamesView.tsx"
Cohesion: 0.22
Nodes (11): CreateGameDto, AdminFormSheet(), AdminFormSheetProps, AdminGamesView(), COLUMNS, DEFAULTS, FormValues, schema (+3 more)

### Community 58 - "expectNoA11yViolations"
Cohesion: 0.24
Nodes (5): Breadcrumb(), BreadcrumbProps, ProductPage, Story, TwoLevels

### Community 62 - "EmptyState.tsx"
Cohesion: 0.17
Nodes (11): BADGE_SIZE, EmptyState(), EmptyStateProps, EmptyStateSize, REDUCED_MOTION_OVERRIDE, Small, Story, TitleOnly (+3 more)

### Community 66 - "ProductDetailView.stories.tsx"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

## Knowledge Gaps
- **307 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `RawSkuAttributes` (+302 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `ResetPasswordForm.tsx` to `HTTP Client & API Types`, `Catalog Browse Components`, `Cart View & Stories`, `__root.tsx`, `Orders Module`, `localeLinkGuard.test.tsx`, `Community 13`, `Community 24`, `AdminPublishersView.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `FormField()` connect `Community 15` to `Route`, `Catalog Browse Components`, `Catalog View Tests`, `Account & Auth UI`, `Community 13`, `Community 18`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`, `AdminGamesView.tsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `renderRoute()` connect `Facet Filter Stories` to `Route`, `Community 33`, `Catalog View Tests`, `Product Detail View`, `localeLinkGuard.test.tsx`, `Route`, `App Shell & Theme`, `$locale.tsx`, `SignInForm.tsx`, `AdminGamesView.tsx`, `useAuth`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _307 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.14461538461538462 - nodes in this community are weakly interconnected._
- **Should `Catalog Browse Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06583850931677018 - nodes in this community are weakly interconnected._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._