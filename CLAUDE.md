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

There are no automated tests yet.

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

# CLAUDE.md

Make suggestions on how to improve this file as you encountered issues. Without overloading it with details that can be
understood from the code.

# FUTURE_WORK.md

Ideas for future work is stored in this file. Append to it if we discuss any such ideas.