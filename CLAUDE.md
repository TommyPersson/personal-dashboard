# Overview

The "desktop dashboard" is an application intended to run on a Raspberry Pi with a small ultra-wide touch screen.

# Components

* device-backend
  * A Kotlin/JVM backend intended to run on a server using Docker
* device-frontend
  * A React/Vite frontend served by the backend, but running on the device (Raspberry Pi) using Chrome in kiosk-like mode.
* common-backend
  * Currently used just to configure all JVM dependencies. In a previous iteration there was intended to be multiple 
    backends that shared this configuration.

# Features

* Most features are implemented as "apps" on both the frontend and backend (not all apps have a backend). 
  Each in their own subdirectory in each.
  * Apps are identified by IDs that need to match on both backend and frontend 
  * Core features, such as `notifications`, `auth`, `layout` live under `core` instead of the app folders.
* Data, configuration and caches for both apps and the main applications is located in `DATA_DIR`, default: `~/.personal-dashboard`

## Frontend UI Concept

### Unlocked mode

The app is intended to run on a device with a wide display. As such, each "app" feature is implemented as a vertical (roughly mobile app sized) slice on a long scrollable horizontal plane. Shortcuts on the right side of the screen will navigate to the corresponding app.

Some apps, such as the media player, have specialized UI that is rendered separately from the main content.

### Locked mode

In locked mode, only a subset of app widgets are shown, such as the pomodoro timer and calendar.

# Testing

The backend has integration tests (`device-backend/src/it/kotlin`, classes named `*IT`) run by failsafe during
`verify`/`install`. They boot the real Ktor/Guice wiring in-process on a random port with RestAssured, against a
throw-away data directory (`device-backend/target/it-data`, set via the `dataDir` system property, which overrides
`DATA_DIR`). Configs are written by `testing/TestConfigs.kt`. Every external service (WinCtrl, GitHub,
Bitbucket, OpenWeather) is played by its own WireMock server on `TestBackend`, which tests stub and verify; external
API base URLs are therefore configurable in each app's config. Between tests the WireMocks are reset (WinCtrl then
accepts any `POST .../actions/...` and 404s everything else) and files in `data`/`cache` are deleted, but in-memory
state is not. Tests reach that state through the backend's injector (`inject<T>()` in `IntegrationTest`), e.g. calling
`invalidateCaches()` on a query handler. Request handlers aren't singletons by default, so a handler whose state tests
need to reset must be annotated `@Singleton`; otherwise the injector hands out a fresh instance.

Integration tests have their own source root (`src/it/kotlin`, added by `build-helper-maven-plugin`) so they don't mix
with unit tests, which go in `src/test/kotlin` as usual and are run by surefire.

* Run only the backend tests: `./mvnw -pl device-backend -am verify` at the repository root (skips the frontend build).

The frontend has no automated tests yet.

# Deployment Architecture

```
Pi (Chrome kiosk) ──HTTP/WebSocket──▶ device-backend (Docker on a server, :8080)
│
└──HTTP──▶ WinCtrl (web service on the Windows PC, core.winCtrl.url)
```

# Building

The Maven configuration does both a backend and frontend build. The frontend is built by the `device-frontend` Maven 
module and is then copied into the backend resources.

Always use the Maven wrapper (`./mvnw`, or `mvnw.cmd` on Windows), never the system `mvn`; the enforcer plugin rejects
Maven < 3.9 and JDKs older than `java.version` (25). All plugin versions are managed in the root `pom.xml`.

A full build is made using `./mvnw clean install` at the repository root.

The Maven build expects Node and NPM to be available on the system PATH.

## Docker

The Docker image is built by copying `device-backend/target/device-backend-*-shaded.jar`, so the backend needs to be 
built separately from the Docker build script for now.

CI will build and publish the image to `ghcr.io/tommypersson/personal-dashboard`.

# Running

Both the backend and frontend can be run locally, I have a basic configuration setup in my home folder for the backend to use.

## Backend

* `../mvnw exec:java` under `device-backend`
* The backend will run at `localhost:8080` with the bundled UI served at the root. The API is mounted at `/api`
* The port can be overridden with the `server.port` JVM system property, e.g. `../mvnw exec:java -Dserver.port=8081`
  (or `java -Dserver.port=8081 -jar ...` for the shaded jar). The user usually has an instance running on 8080 from
  their IDE, so use a different port when running the backend yourself.

## Frontend

* `npm run dev` under `device-frontend`. It should start at `localhost:5173`
* `/api` is proxied to `http://localhost:8080` by default. Override it with the `BACKEND_URL` environment variable
  (or in a `.env.local` file), e.g. `BACKEND_URL=http://localhost:8081 npm run dev -- --port 5174` to pair with a
  backend started on a custom `server.port`.

## Storybook

* `npm run storybook` under `device-frontend`, at `localhost:6006`. It needs no backend: `/api` is never proxied.
* Stories live in a `stories/` folder next to each app (`src/apps/<app>/stories`), together with fixtures for the
  app's state and API payloads. `src/shell/stories` renders the whole app (pin code `1234`).
* Widgets take their state as props, so most stories pass a fixture state. Components that load their own data are
  served by MSW handlers given in the `msw` story parameter, grouped by name (`msw: { handlers: { weather: [...] } }`)
  so a story can override one group. Unmocked `/api` requests are answered by fallbacks in `src/storybook/msw.ts`.
  The worker script is served by MSW's Vite plugin, so there's no `mockServiceWorker.js` in `public/`.
* Widgets that render through portals (lock screen, app bar, app area overlay) need the matching decorator from
  `src/storybook/frames.tsx`.

# WinCtrl 

The WinCtrl companion app is located at https://github.com/TommyPersson/winctrl. Making changes to it is out-of-scope for now.

# Claude Code app

Shows what Claude Code sessions on the workstation are doing. It is fed by Claude Code hooks on the PC that run
`tools/claude-hooks/forward-event.mjs`, which POSTs each hook payload to `/api/apps/claude/events`;
the backend folds the events into per-session state (`apps/claude/domain/ClaudeHookEvent.kt`).

The hooks are packaged as the `personal-dashboard` plugin (`tools/claude-hooks`, listed by the repository's
`.claude-plugin/marketplace.json`). Its "Dashboard backend URL" option (default `http://localhost:8080`) reaches the
script as `CLAUDE_PLUGIN_OPTION_BACKEND_URL`. Install it with `/plugin marketplace add C:/work/personal-dashboard`
(or `TommyPersson/personal-dashboard` from GitHub), then `/plugin install personal-dashboard@personal-dashboard`, and
change the URL in `/config`. Don't also register the hooks in a settings file, or every event is posted twice.

# CLAUDE.md

Make suggestions on how to improve this file as you encountered issues. Without overloading it with details that can be
understood from the code.

# FUTURE_WORK.md

Ideas for future work is stored in this file. Append to it if we discuss any such ideas.