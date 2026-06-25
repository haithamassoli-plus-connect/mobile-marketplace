# Goldenplace — Project Documentation

[Live HTML version](https://9qa062832ngrzt64r5wy0aphamfng9vq.pastehtml.dev/)

Reference documentation for the `goldenplace` app. This is the **what** and **where**: the stack, the project layout, the configuration, the available commands, the component library, how to add a type-safe API, how testing works, and the conventions that hold the codebase together.

For step-by-step **how-to** guides (navigation, authentication, data fetching, i18n, storage, forms, upgrading), see **[GUIDE.md](./GUIDE.md)**.

> This project was generated from the [Obytes React Native template](https://github.com/obytes/react-native-template-obytes). Where this repo's own conventions differ from the upstream template, this repo wins.

---

## Table of Contents

1. [Overview & Technology Stack](#1-overview--technology-stack)
2. [Project Structure](#2-project-structure)
3. [Root Configuration Files](#3-root-configuration-files)
4. [Available Commands](#4-available-commands)
5. [UI Components Reference](#5-ui-components-reference)
6. [Adding a Type-Safe API](#6-adding-a-type-safe-api)
7. [Testing](#7-testing)
8. [Project Organization & Conventions](#8-project-organization--conventions)

---

## 1. Overview & Technology Stack

A production-ready, managed **Expo** React Native application. State is split between **Zustand** (global/client state) and **React Query** (server state); UI is styled with **Tailwind** via **Uniwind**; forms use **TanStack Form + Zod**; routing is file-based with **Expo Router**; and sensitive/local data is persisted with **MMKV**. The whole codebase is **strict TypeScript** with absolute (`@/`) imports.

| Area | Library | Version |
| --- | --- | --- |
| Platform | `expo` | `^56.0.11` |
| Framework | `react-native` | `0.85.3` |
| UI runtime | `react` / `react-dom` | `19.2.3` |
| Routing | `expo-router` | `~56.2.10` |
| Styling | `uniwind` + `tailwindcss` | `^1.2.4` / `4.1.18` |
| Style variants | `tailwind-variants` + `tailwind-merge` | `^3.2.2` / `^3.4.0` |
| Client state | `zustand` | `^5.0.10` |
| Server state | `@tanstack/react-query` + `react-query-kit` | `^5.90.19` / `^3.3.2` |
| Forms | `@tanstack/react-form` | `^1.27.7` |
| Validation | `zod` | `^4.3.5` |
| Storage | `react-native-mmkv` | `~4.1.1` |
| i18n | `i18next` + `react-i18next` | `^25.8.0` / `^16.5.3` |
| HTTP | `axios` | `^1.13.2` |
| Lists | `@shopify/flash-list` | `2.0.2` |
| Bottom sheets / modals | `@gorhom/bottom-sheet` | `^5.2.8` |
| Animation | `react-native-reanimated` + `moti` | `~4.3.1` / `^0.30.0` |
| Unit testing | `jest` + `@testing-library/react-native` | `^29.7.0` / `^13.3.3` |
| E2E testing | Maestro (CLI, installed separately) | — |
| Lint | `eslint` + `@antfu/eslint-config` | `^9.39.2` / `^7.2.0` |
| Language | `typescript` | `^6.0.3` |

**Package manager:** npm. The repo ships an `.npmrc` with `legacy-peer-deps=true`, so install with a plain `npm install`. Node should be a current LTS release.

**Experiments enabled** (in `app.config.ts`): the React Compiler (`reactCompiler: true`) and typed routes (`typedRoutes: true`).

---

## 2. Project Structure

```
.
├── src/
│   ├── app/                      # Expo Router routes (file = route). Thin wrappers.
│   │   ├── _layout.tsx           # Root layout: providers + root Stack
│   │   ├── +html.tsx             # Web HTML shell
│   │   ├── [...messing].tsx      # Catch-all (404) route
│   │   ├── login.tsx             # /login  -> re-exports LoginScreen
│   │   ├── onboarding.tsx        # /onboarding
│   │   ├── (app)/                # Auth-gated tab group (parens = no URL segment)
│   │   │   ├── _layout.tsx       # Tabs + auth/first-time redirects
│   │   │   ├── index.tsx         # Feed tab  -> FeedScreen
│   │   │   ├── style.tsx         # Style demo tab
│   │   │   └── settings.tsx      # Settings tab -> SettingsScreen
│   │   └── feed/
│   │       ├── [id].tsx          # /feed/:id -> PostDetailScreen
│   │       └── add-post.tsx      # /feed/add-post -> AddPostScreen
│   │
│   ├── features/                 # Feature modules (the bulk of the app)
│   │   ├── auth/                 # login screen + form + Zustand auth store
│   │   ├── feed/                 # feed/detail/add screens + api.ts (React Query)
│   │   ├── onboarding/
│   │   ├── settings/
│   │   └── style-demo/
│   │
│   ├── components/ui/            # Shared, generic UI library (see §5)
│   │   ├── index.tsx             # Barrel export
│   │   ├── button/ input/ text/ image/ list/ modal/ select/ checkbox/ …
│   │   ├── icons/                # SVG icon components (imported via subpath)
│   │   ├── colors.js             # Color tokens used by components
│   │   ├── form-utils.ts         # getFieldError() for TanStack Form
│   │   └── use-theme-config.tsx  # React Navigation theme wiring
│   │
│   ├── lib/                      # Pre-configured infrastructure
│   │   ├── api/                  # axios client + React Query provider + pagination utils
│   │   ├── auth/                 # token storage helpers
│   │   ├── hooks/                # useIsFirstTime, useSelectedTheme, loadSelectedTheme
│   │   ├── i18n/                 # i18next init, translate(), language switching
│   │   ├── storage.ts            # MMKV instance + getItem/setItem/removeItem
│   │   └── test-utils.tsx        # custom render() + setup() with providers
│   │
│   ├── translations/             # en.json, ar.json
│   └── global.css                # Tailwind + Uniwind theme (colors, dark mode)
│
├── assets/                       # icons, splash, fonts referenced by app.config.ts
├── android/ ios/                 # Native projects — generated by prebuild, do not edit
├── .maestro/                     # Maestro E2E flows
├── __mocks__/                    # Manual Jest mocks for native modules
├── scripts/                      # e.g. i18next syntax validation
└── <root config files>           # see §3
```

### How the layers relate

The app is organized in four layers; dependencies flow **downward only**:

- **`src/app/`** — Route files are intentionally thin. Most are a single re-export, e.g. `src/app/(app)/index.tsx` is literally `export { FeedScreen as default } from '@/features/feed';`. Layout files (`_layout.tsx`) wire up navigators and providers.
- **`src/features/<name>/`** — The real screens. Each feature owns its screens, feature-specific `components/`, its `api.ts` (React Query hooks), its Zustand store(s), and an `index.ts` barrel.
- **`src/components/ui/`** — Generic, reusable presentational components shared across features (Button, Input, Modal…). No feature knowledge.
- **`src/lib/`** — Cross-cutting infrastructure: HTTP client, storage, i18n, auth token utils, hooks, test utilities.

A feature imports from `components/ui` and `lib`; `lib` and `components/ui` never import from a feature.

---

## 3. Root Configuration Files

### `env.ts` — typed, validated environment

A single Zod schema (`envSchema`) describes every environment variable. There are two classes of variable:

- **`EXPO_PUBLIC_*`** — inlined into the app bundle and readable at runtime in app code.
- **Build-only** (e.g. `APP_BUILD_ONLY_VAR`) — available only to `app.config.ts` at build time, never shipped to the client.

The active environment is chosen by `EXPO_PUBLIC_APP_ENV` (`development` | `preview` | `production`), which selects the bundle id, Android package, and scheme from per-env maps:

```ts
const BUNDLE_IDS = {
  development: 'com.goldenplace.development',
  preview: 'com.goldenplace.preview',
  production: 'com.goldenplace',
} as const;
```

Validation is **opt-in via `STRICT_ENV_VALIDATION=1`** (set by every `prebuild:*` script). When strict, invalid/missing vars `throw` and abort the build; otherwise the raw env is used. `export default Env` is the validated, typed object you import elsewhere (as `import Env from 'env'` / `@env`).

### `app.config.ts` — Expo app config

Dynamic config (TypeScript). Reads `env.ts` to set `name`, `scheme`, `version`, iOS `bundleIdentifier`, and Android `package` per environment. Notable bits:

- **`experiments`**: `reactCompiler: true`, `typedRoutes: true`.
- **EAS**: `extra.eas.projectId` + `owner: 'plusconnect'`.
- **App icon badge**: enabled for non-production builds (shows env + version on the icon).
- **Plugins**: `expo-splash-screen`, `expo-font` (Inter 400/500/600/700), `expo-image`, `expo-status-bar`, `expo-localization`, `expo-router`, `app-icon-badge`, `react-native-edge-to-edge`, and the four `@react-native-vector-icons/*` plugins.

### `tsconfig.json`

Extends `expo/tsconfig.base`. `strict: true`, `checkJs: true`. Path aliases:

```jsonc
"paths": {
  "@/*": ["./src/*"],
  "@env": ["env.ts"]
}
```

### `babel.config.js` / `metro.config.js`

Babel uses `babel-preset-expo`, the `module-resolver` plugin (mirrors the `@/` and `@env` aliases) and the Reanimated plugin. Metro wraps the default Expo config with `withUniwindConfig`, pointing at `./src/global.css` as the Tailwind entry.

### `jest.config.js`

Preset `jest-expo`; `setupFilesAfterEnv: ['<rootDir>/jest-setup.ts']`; `testMatch: ['**/?(*.)+(spec|test).ts?(x)']`; `moduleNameMapper` resolves `@/` to `src/`; coverage collected from `src/**/*.{ts,tsx}` with `json-summary`, `text`, and `jest-junit` reporters.

### `eslint.config.mjs`

Built on `@antfu/eslint-config` (2-space indent, single quotes, semicolons, kebab-case filenames) plus Tailwind class checking (`eslint-plugin-better-tailwindcss`, entry `./src/global.css`), i18n JSON key validation (`eslint-plugin-i18n-json`), React Compiler, and Testing Library rules.

### `eas.json`

Build profiles for cloud builds:

| Profile | Use | Notes |
| --- | --- | --- |
| `development` | Internal dev client | `developmentClient: true` |
| `simulator` | iOS simulator builds | development env |
| `preview` | Internal QA | Android APK, `autoIncrement: true` |
| `production` | Store release | Android app-bundle, `autoIncrement: true` |

### `.env`

Holds the actual values for the current machine (e.g. `EXPO_PUBLIC_API_URL=https://dummyjson.com/`). `EXPO_PUBLIC_*` vars reach the app; non-prefixed vars (e.g. `SECRET_KEY`, `APP_BUILD_ONLY_VAR`) are build-only.

---

## 4. Available Commands

All scripts are in `package.json`; run with `npm run <name>`.

### Development

| Command | Runs | What it does |
| --- | --- | --- |
| `start` | `expo start` | Start the Metro dev server (development env) |
| `ios` | `expo run:ios` | Build + run on an iOS simulator/device |
| `android` | `expo run:android` | Build + run on an Android emulator/device |
| `web` | `expo start --web` | Run in the browser |
| `prebuild` | `npx expo prebuild` | Regenerate native `android/`/`ios/` from config |
| `xcode` | `xed -b ios` | Open the iOS project in Xcode |
| `doctor` | `npx expo-doctor@latest` | Diagnose dependency/config problems |

### Environment-specific run

These set `EXPO_PUBLIC_APP_ENV` via `cross-env` before delegating:

| Command | Env |
| --- | --- |
| `start:preview` / `start:production` | preview / production dev server |
| `ios:preview` / `ios:production` | preview / production iOS |
| `android:preview` / `android:production` | preview / production Android |
| `prebuild:development` / `prebuild:preview` / `prebuild:production` | prebuild with `STRICT_ENV_VALIDATION=1` |

### EAS cloud builds

`build:<profile>:<platform>` → `eas build --profile <profile> --platform <platform>` for `development` / `preview` / `production` × `ios` / `android`. Example: `npm run build:production:ios`.

### Quality gates

| Command | Runs | What it does |
| --- | --- | --- |
| `lint` | `eslint .` | Lint everything |
| `lint:fix` | `eslint . --fix` | Lint and autofix |
| `type-check` | `tsc --noemit` | TypeScript type check |
| `lint:translations` | `eslint ./src/translations/ --fix --ext .json` | Validate/sort translation JSON |
| `test` | `jest` | Run unit tests |
| `test:watch` | `jest --watch` | Watch mode |
| `test:ci` | `jest --coverage` | Tests with coverage |
| **`check-all`** | lint + type-check + lint:translations + test | **The full pre-commit gate — run this before pushing** |

### E2E & misc

| Command | What it does |
| --- | --- |
| `install-maestro` | Install the Maestro CLI |
| `e2e-test` | `maestro test .maestro/ -e APP_ID=com.goldenplace.development` |
| `prepare` | Husky git-hook install (runs on `npm install`) |
| `app-release` | Versioned release via `np` |

---

## 5. UI Components Reference

Shared components live in `src/components/ui/` and are re-exported from the barrel `@/components/ui`. They are styled with **Uniwind** (Tailwind for React Native) and use **`tailwind-variants` (`tv`)** for variant-driven styles; they are dark-mode aware and RTL-aware (text honors `I18nManager.isRTL`). Color tokens come from `src/components/ui/colors.js` and `src/global.css`.

```ts
// The barrel re-exports components AND a few RN primitives:
import { Button, Input, Text, View, Pressable, SafeAreaView } from '@/components/ui';
// Icons and a couple of helpers are imported by sub-path, NOT the barrel:
import { Feed as FeedIcon } from '@/components/ui/icons';
```

> Exported from the barrel: `button`, `checkbox`, `colors`, `focus-aware-status-bar`, `image`, `input`, `list`, `modal`, `progress-bar`, `select`, `text`, `utils`, plus RN primitives (`ActivityIndicator`, `Pressable`, `ScrollView`, `TouchableOpacity`, `View`, `SafeAreaView`) and `StyledSvg`. `icons/`, `modal-keyboard-aware-scroll-view`, and `use-theme-config` are imported by sub-path.

### Button — `button/button.tsx`

Primary tappable action. Renders a label or a loading spinner (or arbitrary `children`).

Key props: `label?`, `loading?`, `variant?` (`default | secondary | outline | destructive | ghost | link`), `size?` (`default | lg | sm | icon`), `disabled?`, `fullWidth?` (default `true`), `className?`, `textClassName?`, plus all `Pressable` props (`onPress`, `testID`, …). When `loading` or `disabled`, presses are blocked.

```tsx
<Button label="Login" size="lg" loading={isSubmitting} onPress={handleSubmit} />
```

### Input — `input/input.tsx`

Labeled text field with focus/error/disabled states and an inline error message. RTL-aware writing direction and alignment.

Key props: `label?`, `error?` (string — renders the message), `disabled?`, plus all `TextInputProps` (`value`, `onChangeText`, `onBlur`, `placeholder`, `secureTextEntry`, `testID`, …). With `testID="x"` it exposes `x-label` and `x-error` test ids.

```tsx
<Input label="Email" value={email} onChangeText={setEmail} error={emailError} testID="email-input" />
```

### Text — `text/text.tsx`

Themed text. Pass plain `children` **or** a type-safe i18n key via `tx`.

Key props: `tx?: TxKeyPath` (translation key), `className?`, plus all `TextProps`.

```tsx
<Text tx="settings.title" className="text-lg font-bold" />
<Text>Plain string</Text>
```

### Checkbox / Radio / Switch — `checkbox/checkbox.tsx`

Three accessible selection controls exported as `Checkbox`, `Radio`, `Switch` (each is a base component with attached sub-parts, e.g. `.Root`, `.Icon`, `.Label`). Animated with Moti, RTL-aware.

Key props: `checked?`, `onChange: (checked: boolean) => void`, `accessibilityLabel` (required), `label?`, `disabled?`, `className?`.

```tsx
<Checkbox checked={agree} onChange={setAgree} accessibilityLabel="agree" label="I agree" />
```

### Select — `select/select.tsx`

Dropdown that opens a bottom-sheet list of options.

Key props: `options: { label: string; value: string | number }[]`, `value?`, `onSelect?: (value) => void`, `label?`, `placeholder?`, `error?`, `disabled?`, `testID?`.

```tsx
<Select
  label="Language"
  value={lang}
  onSelect={setLang}
  options={[{ label: 'English', value: 'en' }, { label: 'العربية', value: 'ar' }]}
/>
```

### Modal — `modal/modal.tsx`

Bottom-sheet modal built on `@gorhom/bottom-sheet`. Pair it with the exported `useModal()` hook, which returns `{ ref, present, dismiss }`.

Key props: `title?`, `snapPoints?` (default `['60%']`), `detached?`, plus all `BottomSheetModalProps`.

```tsx
const { ref, present, dismiss } = useModal();
// ...
<Button label="Open" onPress={present} />
<Modal ref={ref} title="Options" snapPoints={['70%']}>{/* content */}</Modal>
```

### List / EmptyList — `list/list.tsx`

`List` is `FlashList` from `@shopify/flash-list` (high-performance list). `EmptyList` renders a spinner while `isLoading`, otherwise a "no data" illustration — wire it to `ListEmptyComponent`.

```tsx
<List data={posts} renderItem={({ item }) => <PostCard {...item} />} ListEmptyComponent={<EmptyList isLoading={isPending} />} />
```

### Image — `image/image.tsx`

`expo-image` wrapped for Tailwind `className` support, with a default blurhash `placeholder`. `preloadImages(urls: string[])` prefetches.

```tsx
<Image source={{ uri }} className="h-24 w-24 rounded-lg" />
```

### ProgressBar — `progress-bar/progress-bar.tsx`

Reanimated progress indicator. Exposes an imperative `setProgress(value)` via ref.

### FocusAwareStatusBar — `focus-aware-status-bar/focus-aware-status-bar.tsx`

Sets the status bar style for the currently focused screen, synced to the theme. Drop it at the top of a screen. Prop: `hidden?`.

### ModalKeyboardAwareScrollView — `modal-keyboard-aware-scroll-view/`

A keyboard-aware scroll view for content inside a bottom-sheet modal. Import by sub-path.

### Icons — `icons/`

SVG icon components (`Feed`, `Settings`, `Home`, `Style`, `Github`, `Language`, `Share`, `Rate`, `Support`, `Website`, `ArrowRight`, `CaretDown`…). Each accepts `SvgProps` including `color`. Import via `@/components/ui/icons`.

---

## 6. Adding a Type-Safe API

The data layer is `axios` for HTTP + `@tanstack/react-query` for caching/state, with **`react-query-kit`** factories (`createQuery`, `createMutation`) giving fully typed hooks.

### The pieces (`src/lib/api/`)

- **`client.ts`** — a single axios instance whose `baseURL` is `Env.EXPO_PUBLIC_API_URL`:

  ```ts
  export const client = axios.create({ baseURL: Env.EXPO_PUBLIC_API_URL });
  ```

- **`provider.tsx`** — exports `queryClient` and `APIProvider` (a `QueryClientProvider` wrapper, also wiring React Query devtools). It is mounted near the root in `src/app/_layout.tsx`.
- **`utils.ts`** — pagination helpers for infinite queries: the `PaginateQuery<T>` type, `getQueryKey`, `normalizePages`, `getUrlParameters`, `getNextPageParam`, `getPreviousPageParam`.
- **`index.ts`** — barrel re-exporting all of the above; import from `@/lib/api`.

### The pattern (`src/features/feed/api.ts`)

`createQuery` / `createMutation` take **three generics — `<Response, Variables, Error>`** — which is where the type-safety comes from: the hook's `data` is typed as `Response`, its argument is typed as `Variables`, and `error` is typed as `Error` (here `AxiosError`).

```ts
import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';
import { client } from '@/lib/api';

export type Post = { userId: number; id: number; title: string; body: string };

// READ — no variables
type PostsResponse = Post[];
type PostsVariables = void;
export const usePosts = createQuery<PostsResponse, PostsVariables, AxiosError>({
  queryKey: ['posts'],
  fetcher: () => client.get(`posts`).then(response => response.data.posts),
});

// READ — with variables
type PostResponse = Post;
type PostVariables = { id: string };
export const usePost = createQuery<PostResponse, PostVariables, AxiosError>({
  queryKey: ['posts'],
  fetcher: variables => client.get(`posts/${variables.id}`).then(r => r.data),
});

// WRITE
type AddPostResponse = Post;
type AddPostVariables = { title: string; body: string; userId: number };
export const useAddPost = createMutation<AddPostResponse, AddPostVariables, AxiosError>({
  mutationFn: async variables =>
    client({ url: 'posts/add', method: 'POST', data: variables }).then(r => r.data),
});
```

### Step-by-step: add a new endpoint

1. **Create / open the feature's `api.ts`** (e.g. `src/features/<feature>/api.ts`).
2. **Declare types** for the response and (if any) the variables.
3. **For reads**, export a `createQuery<Response, Variables, AxiosError>` with a stable `queryKey` and a `fetcher` that calls `client`.
4. **For writes**, export a `createMutation<Response, Variables, AxiosError>` with a `mutationFn`.
5. **Consume it** in a component — the result is fully typed:

   ```tsx
   const { data, isPending, isError } = usePosts();
   const { mutate, isPending: isSaving } = useAddPost();
   // mutate({ title, body, userId }) — TS enforces the variable shape
   ```

No manual `useQuery`/`useMutation` wiring is needed; the factory builds typed hooks for you. For paginated endpoints, reach for `createInfiniteQuery` from `react-query-kit` together with the helpers in `src/lib/api/utils.ts`.

See **[GUIDE.md → Data Fetching](./GUIDE.md#data-fetching)** for usage patterns in screens (loading/error states, mutations, invalidation).

---

## 7. Testing

### Configuration

- **`jest.config.js`** — preset `jest-expo`, `@/` module mapping, coverage from `src/`, and `jest-junit`/`json-summary`/`text` reporters.
- **`jest-setup.ts`** — runs before every suite and mocks native modules that don't exist under Jest: `react-native-reanimated`, `react-native-worklets`, `react-native-mmkv`, `expo-localization`, `react-native-keyboard-controller`, `react-native-gesture-handler`.
- **`__mocks__/`** — additional manual mocks (e.g. `@gorhom`, `moti`).
- **`src/lib/test-utils.tsx`** — the custom renderer. It wraps components in the providers they need (`BottomSheetModalProvider`) and re-exports everything from `@testing-library/react-native`:
  - `render(ui)` — render with providers.
  - `setup(ui)` — render with providers **and** a configured `userEvent` (`const { user } = setup(<…/>)`).

  Always import test helpers from `@/lib/test-utils`, not directly from the testing library.

### The pattern

Tests are **colocated** with the code they cover and named `*.test.tsx` (or `*.test.ts`). The shape: render → query by `testID`/text/role → drive interactions with `user` → assert.

```tsx
import { cleanup, render, screen, setup } from '@/lib/test-utils';
import { Button } from './button';

afterEach(cleanup);

describe('button component', () => {
  it('renders its label', () => {
    render(<Button testID="button" label="Submit" />);
    expect(screen.getByText('Submit')).toBeOnTheScreen();
  });

  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    const { user } = setup(<Button testID="button" label="Tap" onPress={onPress} />);
    await user.press(screen.getByTestId('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress while loading', async () => {
    const onPress = jest.fn();
    const { user } = setup(<Button testID="button" loading onPress={onPress} />);
    expect(screen.getByTestId('button')).toBeDisabled();
    await user.press(screen.getByTestId('button'));
    expect(onPress).toHaveBeenCalledTimes(0);
  });
});
```

For forms and async flows, use `await user.type(...)`, `await screen.findByText(...)`, and `await waitFor(() => …)` — see `src/features/auth/components/login-form.test.tsx` for validation/submission examples.

### How to write a new test

1. Create `my-component.test.tsx` next to the component.
2. `import { cleanup, render, screen, setup } from '@/lib/test-utils';` and `afterEach(cleanup);`.
3. Use `render` for static assertions, `setup` when you need to simulate user input.
4. Query by `testID` (preferred for stable selectors), text, or role; assert with matchers like `toBeOnTheScreen()`, `toBeDisabled()`, `toHaveTextContent()`.
5. Run `npm run test` (or `npm run test:watch`).

### End-to-end (Maestro)

Flows live in `.maestro/` (e.g. `auth/login-with-validation.yaml`, `app/tabs.yaml`, reusable steps under `utils/`), orchestrated by `.maestro/config.yaml`. Install once with `npm run install-maestro`, then run `npm run e2e-test`.

---

## 8. Project Organization & Conventions

### Feature-based structure

Each feature is a self-contained folder under `src/features/<name>/`:

```
src/features/auth/
├── index.ts                    # Barrel: re-exports the feature's public surface
├── login-screen.tsx            # Screen
├── use-auth-store.tsx          # Zustand store (client state)
└── components/
    ├── login-form.tsx          # Feature-specific component
    └── login-form.test.tsx     # Colocated test
```

Add a `api.ts` to a feature for its React Query hooks (see `src/features/feed/api.ts`).

### Routes are thin wrappers

Route files in `src/app/` re-export the screen from the feature, e.g.:

```tsx
// src/app/(app)/index.tsx
export { FeedScreen as default } from '@/features/feed';
```

This keeps routing (URLs, layouts, navigators) separate from screen implementation. Route **groups** use parentheses — `(app)` groups the authenticated tabs without adding a URL segment. Typed routes are on (`typedRoutes: true`).

### Conventions checklist

- ✅ **Absolute imports** with the `@/` alias — never relative (`../../…`).
- ✅ **kebab-case** filenames (enforced by ESLint).
- ✅ **Feature-first**: new screens go in `src/features/<name>/`, shared UI in `src/components/ui/`, infra in `src/lib/`.
- ✅ **Forms** use **TanStack Form + Zod** (not react-hook-form).
- ✅ **Sensitive/local persistence** uses **MMKV** via `src/lib/storage.ts` (not AsyncStorage).
- ✅ **Server state** via **React Query** factories; **client state** via **Zustand**.
- ✅ **Env vars** for the app must be prefixed `EXPO_PUBLIC_*`.
- ✅ **Production builds** via EAS (`npm run build:production:ios|android`).
- ❌ **Don't** hand-edit `android/` or `ios/` — use Expo config plugins and `prebuild`.
- ✅ Run **`npm run check-all`** before pushing.

Formatting (via `@antfu/eslint-config`): 2-space indentation, single quotes, required semicolons, inline type imports, `type` over `interface`.

---

*Next: read **[GUIDE.md](./GUIDE.md)** for task-oriented guides on navigation, authentication, data fetching, internationalization, upgrading dependencies, storage, UI components, and forms.*
