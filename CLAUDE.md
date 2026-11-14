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

A full build is made using `mvn clean install` at the repository root.

# Running

Both the backend and frontend can be run locally, I have a basic configuration setup in my home folder for the backend to use.

## Backend

* `mvn exec:java` under `device-backend`

## Frontend

* `npm run dev` under `device-frontend`

# WinCtrl 

The WinCtrl companion app is located at https://github.com/TommyPersson/winctrl. Making changes to it is out-of-scope for now.

# CLAUDE.md

Make suggestions on how to improve this file as you encountered issues. Without overloading it with details that can be
understood from the code.