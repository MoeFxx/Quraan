# Quraan

This repository contains a simple React frontend skeleton built with [Vite](https://vitejs.dev/).

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [npm](https://www.npmjs.com/)

## Setup

Install the dependencies:

```bash
npm install
```

## Development

Start a development server with hot reloading:

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

Create an optimized production build:

```bash
npm run build
```

You can preview the production build with:

```bash
npm run preview
```

## Usage

The app now includes a Quran player that fetches surah and ayah data from [Al Quran Cloud](https://alquran.cloud/api). It provides audio playback with next/previous/repeat controls. You can pick from several English translations and optionally enable a transliteration overlay. The interface defaults to Arabic with a button to switch to English.


Your progress (current surah and ayah) is saved in the browser so you can resume where you left off. Use the search box to jump directly to a verse. Font size and light/dark theme settings are available at the top of the page.

