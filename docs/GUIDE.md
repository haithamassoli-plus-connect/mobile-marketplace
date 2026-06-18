# Mobile Marketplace — Developer Guide

[Live HTML version](https://9qa062832ngrzt64r5wy0aphamfng9vq.pastehtml.dev/)

Task-oriented guides for working in this codebase. Each section is a "how do I…" with the real files and snippets you'll touch.

For the **reference** material (full stack, structure, config, commands, component props, testing setup), see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.

---

## Table of Contents

- [Navigation](#navigation)
- [Authentication](#authentication)
- [Data Fetching](#data-fetching)
- [Internationalization (i18n)](#internationalization-i18n)
- [Upgrading Project Dependencies](#upgrading-project-dependencies)
- [Storage](#storage)
- [UI Components](#ui-components)
- [Forms](#forms)

---

## Navigation

Routing is **file-based** via Expo Router: a file in `src/app/` *is* a route. Typed routes are enabled (`typedRoutes: true` in `app.config.ts`), so `href`s are type-checked.

### The route tree

```
src/app/
├── _layout.tsx          # Root: providers + root <Stack> (login / onboarding / (app))
├── login.tsx            # /login
├── onboarding.tsx       # /onboarding
├── (app)/               # group — no URL segment; the authenticated area
│   ├── _layout.tsx      # <Tabs> + auth/first-time gating
│   ├── index.tsx        # /            (Feed tab)
│   ├── style.tsx        # /style       (Style tab)
│   └── settings.tsx     # /settings    (Settings tab)
├── feed/
│   ├── [id].tsx         # /feed/:id    (dynamic)
│   └── add-post.tsx     # /feed/add-post
├── +html.tsx            # web HTML shell
└── [...messing].tsx     # catch-all (404)
```

**Route groups** use parentheses: `(app)` lets several tab screens share a layout without `app` appearing in the URL. **Dynamic segments** use brackets: `feed/[id].tsx` matches `/feed/123`.

### Root layout (`src/app/_layout.tsx`)

The root declares a `<Stack>` with three screens and wraps everything in providers (gesture handler, keyboard, theme, API/React Query, bottom-sheet, flash messages). It also kicks off startup work — `hydrateAuth()` and `loadSelectedTheme()` — and manages the splash screen.

```tsx
<Stack>
  <Stack.Screen name="(app)" options={{ headerShown: false }} />
  <Stack.Screen name="onboarding" options={{ headerShown: false }} />
  <Stack.Screen name="login" options={{ headerShown: false }} />
</Stack>
```

### Tabs + gating (`src/app/(app)/_layout.tsx`)

The authenticated group renders a `<Tabs>` navigator (Feed / Style / Settings) and redirects based on app state **before** rendering tabs:

```tsx
const status = useAuth.use.status();
const [isFirstTime] = useIsFirstTime();

if (isFirstTime) return <Redirect href="/onboarding" />;
if (status === 'signOut') return <Redirect href="/login" />;
return <Tabs>{/* Feed / Style / Settings screens */}</Tabs>;
```

### Navigating

```tsx
import { Link, Redirect, useRouter } from 'expo-router';

// Imperative
const router = useRouter();
router.push('/feed/add-post');

// Declarative link (asChild lets you wrap any pressable)
<Link href="/feed/add-post" asChild><Pressable><Text>Create</Text></Pressable></Link>

// Conditional redirect (render-time)
return <Redirect href="/login" />;
```

### Add a new screen

1. Create the screen in its feature: `src/features/<feature>/<name>-screen.tsx` and export it from the feature's `index.ts`.
2. Add a route file that re-exports it, e.g. `src/app/<path>.tsx`:
   ```tsx
   export { MyScreen as default } from '@/features/<feature>';
   ```
3. Put it under `(app)/` if it should be auth-gated; add a `<Tabs.Screen>`/`<Stack.Screen>` entry in the relevant `_layout.tsx` if it needs custom nav options.

---

## Authentication

Auth = a small **Zustand** store for status + token, with the token persisted in **MMKV**. There is no real backend in the starter — `LoginScreen` fakes a token — but the wiring is production-shaped.

### The store (`src/features/auth/use-auth-store.tsx`)

Three statuses: `idle` (pre-hydration) → `signIn` (authenticated) / `signOut` (not). Actions persist the token as a side effect:

```ts
const _useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  signIn: (token) => { setToken(token); set({ status: 'signIn', token }); },
  signOut: () => { removeToken(); set({ status: 'signOut', token: null }); },
  hydrate: () => {
    const userToken = getToken();
    userToken !== null ? get().signIn(userToken) : get().signOut();
  },
}));

export const useAuthStore = createSelectors(_useAuthStore);
export const signIn = (t: TokenType) => _useAuthStore.getState().signIn(t);
export const signOut = () => _useAuthStore.getState().signOut();
export const hydrateAuth = () => _useAuthStore.getState().hydrate();
```

`createSelectors` (`src/lib/utils.ts`) generates per-field selector hooks so components subscribe to **only** what they read: `useAuthStore.use.status()`, `useAuthStore.use.signIn()`. The plain `signIn`/`signOut`/`hydrateAuth` exports let you call actions outside React.

### Token storage (`src/lib/auth/utils.ts`)

```ts
const TOKEN = 'token';
export type TokenType = { access: string; refresh: string };
export const getToken = () => getItem<TokenType>(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);
export const removeToken = () => removeItem(TOKEN);
```

These build on the MMKV helpers in `src/lib/storage.ts` (see [Storage](#storage)).

### The lifecycle

1. **Startup** — `src/app/_layout.tsx` calls `hydrateAuth()` at module load: it reads the saved token and flips status to `signIn` or `signOut`.
2. **Gating** — `src/app/(app)/_layout.tsx` reads `useAuth.use.status()` and `<Redirect href="/login" />` when `signOut`.
3. **Login** — `LoginScreen` submits the form, calls `signIn(token)`, and navigates home:

   ```tsx
   const signIn = useAuthStore.use.signIn();
   const onSubmit = (data) => {
     signIn({ access: 'access-token', refresh: 'refresh-token' });
     router.push('/');
   };
   ```

### Wiring a real backend

Replace the fake token in `LoginScreen.onSubmit` with a React Query mutation (see [Data Fetching](#data-fetching)) that posts credentials and returns `{ access, refresh }`, then call `signIn(result)`. To attach the token to requests, add an axios request interceptor in `src/lib/api/client.ts` that reads `getToken()`.

---

## Data Fetching

Server state is **React Query** + **axios**, with typed hooks from **`react-query-kit`**. The full "how to add an endpoint" walkthrough is in **[DOCUMENTATION.md §6](./DOCUMENTATION.md#6-adding-a-type-safe-api)**; this section is about *consuming* hooks in screens.

### Setup recap

`APIProvider` (`src/lib/api/provider.tsx`) wraps the app in `src/app/_layout.tsx`, so every component can use the hooks. The axios `client` points at `Env.EXPO_PUBLIC_API_URL`.

### Reading data

```tsx
import { usePosts, type Post } from '@/features/feed/api';
import { EmptyList, FocusAwareStatusBar, List, Text, View } from '@/components/ui';

export function FeedScreen() {
  const { data, isPending, isError } = usePosts();

  if (isError) return <View><Text>Error loading data</Text></View>;

  return (
    <View className="flex-1">
      <FocusAwareStatusBar />
      <List
        data={data}
        renderItem={({ item }: { item: Post }) => <PostCard {...item} />}
        keyExtractor={(_, i) => `item-${i}`}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
      />
    </View>
  );
}
```

Key fields on the result: `data` (typed as your `Response`), `isPending`, `isError`, `error` (typed `AxiosError`), `refetch`.

### A parameterized query

```tsx
const { data: post } = usePost({ variables: { id } });
```

### Writing data (mutations) + refetching

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { useAddPost } from '@/features/feed/api';

const queryClient = useQueryClient();
const { mutate, isPending } = useAddPost();

mutate(
  { title, body, userId: 1 },
  { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }) },
);
```

Invalidate the relevant `queryKey` after a successful mutation so dependent queries refetch.

### Pagination

For infinite lists, use `createInfiniteQuery` from `react-query-kit` together with the helpers in `src/lib/api/utils.ts` (`PaginateQuery`, `getNextPageParam`, `getPreviousPageParam`, `normalizePages` to flatten pages into a single array for `FlashList`).

---

## Internationalization (i18n)

Powered by **i18next + react-i18next**. Translations live in `src/translations/*.json`; the runtime is configured in `src/lib/i18n/`.

### Initialization (`src/lib/i18n/index.ts`)

```ts
i18n.use(initReactI18next).init({
  resources,                                   // { en, ar } from resources.ts
  lng: getLanguage() || getLocales()[0]?.languageTag, // saved choice, else device locale
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
});

export const isRTL = i18n.dir() === 'rtl';
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);
```

Resources (`resources.ts`) map language → JSON, and the `Language` type is derived from them (`'en' | 'ar'`).

### Translation files (`src/translations/`)

`en.json` and `ar.json` share an identical key structure (ESLint's i18n-json plugin enforces matching, sorted keys — run `npm run lint:translations`):

```jsonc
{
  "settings": {
    "title": "Settings",
    "language": "Language",
    "theme": { "title": "Theme", "dark": "Dark", "light": "Light", "system": "System" }
  }
}
```

### Using translations

```tsx
// In the Text component — type-safe key, validated against en.json:
<Text tx="settings.title" />

// Imperatively (memoized, also type-safe via TxKeyPath):
import { translate } from '@/lib/i18n';
const label = translate('settings.language');
```

`TxKeyPath` is generated from the English locale, so `tx`/`translate` keys are autocompleted and a typo fails type-check.

### Switching language (`src/lib/i18n/utils.ts`)

The language is persisted in MMKV (key `local`). Use the hook:

```tsx
import { useSelectedLanguage } from '@/lib/i18n';

const { language, setLanguage } = useSelectedLanguage();
setLanguage('ar'); // persists, switches i18next, toggles RTL, reloads the app
```

`changeLanguage()` calls `i18n.changeLanguage`, toggles `I18nManager.forceRTL` (Arabic → RTL), and reloads so layout direction applies cleanly (`DevSettings.reload()` in dev, `RNRestart.restart()` in prod, `window.location.reload()` on web).

### Add a language

1. Create `src/translations/<code>.json` mirroring `en.json`'s keys.
2. Register it in `src/lib/i18n/resources.ts` (`<code>: { translation: <code>Json }`).
3. Add it to any language picker `options`.
4. `npm run lint:translations` to confirm key parity.

---

## Upgrading Project Dependencies

This is a managed Expo project, so the SDK upgrade flow differs from a plain `npm update`. The repo doesn't document its own process; the steps below are the **standard Expo workflow** plus this repo's `doctor` script. Always do upgrades on a branch and finish with `npm run check-all`.

> Note `.npmrc` sets `legacy-peer-deps=true`, so `npm install` won't fail on peer-dependency mismatches — re-check compatibility yourself after an upgrade.

### Routine (non-SDK) dependency bumps

1. Update the package(s): `npm install <pkg>@<version>`.
2. `npm run type-check` and `npm run test`.
3. For anything Expo-managed, prefer `npx expo install <pkg>` so the version matches your SDK.

### Expo SDK upgrade (the big one)

1. **Branch** off `main`.
2. **Bump Expo:** `npx expo install expo@latest` (or a specific SDK, e.g. `expo@^57`).
3. **Align native deps:** `npx expo install --fix` — rewrites RN/Expo packages to versions compatible with the installed SDK.
4. **Validate:** `npm run doctor` (runs `npx expo-doctor@latest`) and resolve what it reports. (The repo pre-excludes `react-native-restart` from the directory check and `eslint-config-expo` from install — see `package.json` → `expo`.)
5. **Regenerate native projects** if you build locally / use config plugins: `npx expo prebuild --clean` (or an env variant like `npm run prebuild:development`, which adds `STRICT_ENV_VALIDATION=1`). Don't hand-edit `android/`/`ios/`.
6. **Run it:** `npm run ios` / `npm run android`, then smoke-test the app.
7. **Quality gate:** `npm run check-all`.

References: the [Expo SDK upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/) and `npx expo install --fix` / `npx expo-doctor` docs.

---

## Storage

Local persistence uses **MMKV** (`react-native-mmkv`) — fast, synchronous, native key-value storage. A single instance plus typed JSON helpers live in `src/lib/storage.ts`:

```ts
import { createMMKV } from 'react-native-mmkv';
export const storage = createMMKV();

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) || null : null;
}
export async function setItem<T>(key: string, value: T) { storage.set(key, JSON.stringify(value)); }
export async function removeItem(key: string) { storage.remove(key); }
```

Use `getItem`/`setItem`/`removeItem` for arbitrary JSON values; use the native typed getters (`storage.getString/getNumber/getBoolean`) directly for scalars.

### Reactive storage in components

`react-native-mmkv` ships hooks that re-render when a key changes — used across the app:

```tsx
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv';
const [isFirstTime, setIsFirstTime] = useMMKVBoolean('IS_FIRST_TIME', storage);
const [language, setLanguage] = useMMKVString('local');
```

### Keys used in this app

| Key | Type | Owner | Purpose |
| --- | --- | --- | --- |
| `token` | `TokenType` (JSON) | `src/lib/auth/utils.ts` | Auth access/refresh token |
| `local` | string | `src/lib/i18n/utils.ts` | Selected language |
| `SELECTED_THEME` | `'light'\|'dark'\|'system'` | `src/lib/hooks/use-selected-theme.tsx` | Theme preference |
| `IS_FIRST_TIME` | boolean | `src/lib/hooks/use-is-first-time.tsx` | Whether to show onboarding |

`hydrateAuth()` and `loadSelectedTheme()` read these at startup (in `src/app/_layout.tsx`) to restore session and theme. MMKV supports encryption if you need it — pass an encryption key when creating the instance.

---

## UI Components

The shared library is in `src/components/ui/`, re-exported from the barrel `@/components/ui`. Full prop reference is in **[DOCUMENTATION.md §5](./DOCUMENTATION.md#5-ui-components-reference)**; this is how to use them together.

### Importing

```tsx
import { Button, Input, Text, View } from '@/components/ui'; // barrel
import { Feed as FeedIcon } from '@/components/ui/icons';     // icons by sub-path
```

### Styling

Components accept Tailwind utility classes via `className` (Uniwind), and internally use `tailwind-variants` for `variant`/`size`. Dark mode is automatic (theme tracked by Uniwind + `use-theme-config`); RTL is handled by `Text`/`Input`. Use `dark:` prefixes for dark-specific classes.

```tsx
<View className="flex-1 justify-center p-4">
  <Text className="pb-6 text-center text-4xl font-bold">Sign In</Text>
  <Button label="Continue" variant="secondary" size="lg" />
</View>
```

### Theme control

Read/set the theme with `useSelectedTheme()` (`src/lib/hooks/use-selected-theme.tsx`); for styling decisions inside a component use `useUniwind()` from `uniwind` rather than the selected-theme hook.

### Building a screen from primitives

Compose `View`/`Text`/`Button`/`Input` for layout, `List` + `EmptyList` for collections, `Modal` + `useModal()` for sheets, `Select`/`Checkbox` for inputs, and add `<FocusAwareStatusBar />` at the top so the status bar matches the screen/theme.

---

## Forms

Forms use **TanStack Form** for state + **Zod** for validation. The canonical example is `src/features/auth/components/login-form.tsx`.

> Convention: use TanStack Form, **not** react-hook-form.

### The recipe

**1. Define a Zod schema and infer its type.**

```ts
import * as z from 'zod';

const schema = z.object({
  email: z.string({ message: 'Email is required' }).min(1, 'Email is required').email('Invalid email format'),
  password: z.string({ message: 'Password is required' }).min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});
export type FormType = z.infer<typeof schema>;
```

**2. Create the form**, validating on change and handling submit.

```tsx
import { useForm } from '@tanstack/react-form';

const form = useForm({
  defaultValues: { email: '', password: '' },
  validators: { onChange: schema as any },
  onSubmit: async ({ value }) => { onSubmit(value); },
});
```

**3. Render fields** with `<form.Field>` render-props, binding the `Input` and surfacing errors via `getFieldError` (`src/components/ui/form-utils.ts`).

```tsx
import { getFieldError } from '@/components/ui/form-utils';

<form.Field
  name="email"
  children={field => (
    <Input
      testID="email-input"
      label="Email"
      value={field.state.value}
      onBlur={field.handleBlur}
      onChangeText={field.handleChange}
      error={getFieldError(field)}
    />
  )}
/>
```

`getFieldError` returns `undefined` until the field is touched, then the first error's message (it understands both string errors and Zod's object errors).

**4. Submit button** that subscribes to `isSubmitting`.

```tsx
<form.Subscribe
  selector={state => [state.isSubmitting]}
  children={([isSubmitting]) => (
    <Button testID="login-button" label="Login" onPress={form.handleSubmit} loading={isSubmitting} />
  )}
/>
```

### Notes

- Wrap the form in `KeyboardAvoidingView` (from `react-native-keyboard-controller`) as the login form does, so inputs aren't hidden by the keyboard.
- `<form.Subscribe>` re-renders only on the selected slice of form state — keep it scoped (e.g. just `isSubmitting`) to avoid extra renders.
- Testing forms: see `login-form.test.tsx` and **[DOCUMENTATION.md §7](./DOCUMENTATION.md#7-testing)** — use `setup()` for `user.type`/`user.press`, and `findBy*`/`waitFor` for async validation and submission.

---

*See **[DOCUMENTATION.md](./DOCUMENTATION.md)** for the reference: stack, structure, config, commands, component props, and conventions.*
