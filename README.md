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

The app now includes a simple Quran player that fetches surah and ayah data from [Al Quran Cloud](https://alquran.cloud/api) and allows audio playback with navigation controls. The player also supports selecting an English translation edition so the corresponding text appears alongside the Arabic verses. Modify `src/components/QuranPlayer.jsx` to extend the functionality further.

You can also switch between light and dark themes and adjust the base font size using the controls at the top of the page.

