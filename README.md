# Coffee Varieties

A SvelteKit project that displays coffee data, including blend name, origin, variety, notes, and related images.

## Features

- Displays detailed information about various coffee varieties.
- Error handling for invalid or missing data.
- Interactive UI with responsive design.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/coffee-varieties.git
   ```

2. Install dependencies:
   ```
   yarn install
   ```

## Development

To start the development server, run:

```
yarn dev
```

This will start the SvelteKit development server at `http://localhost:5173`.

## Build

To build the project for production, run:

```
yarn build
```

To preview the built project, use:

```
yarn preview
```

## Linting and Formatting

To lint the project, run:

```
yarn lint
```

To automatically format the code, run:

```
yarn format
```

## Testing

To run unit tests, use:

```
yarn test:unit
```

For full test run:

```
yarn test
```

## Available Scripts

- `dev`: Start the development server.
- `build`: Build the project for production.
- `preview`: Preview the production build.
- `prepare`: Sync with SvelteKit.
- `check`: Run type checks with `svelte-check`.
- `check:env`: Check the environment configuration.
- `check:watch`: Watch for changes and check with `svelte-check`.
- `format`: Automatically format the code using Prettier.
- `lint`: Lint the project using ESLint.
- `test:unit`: Run unit tests using Vitest.
- `test`: Run tests.

## Dependencies

### Development Dependencies:

- `@eslint/compat`, `@eslint/js`: ESLint configuration for JavaScript.
- `@sveltejs/kit`: SvelteKit framework for building apps.
- `@sveltejs/vite-plugin-svelte`: Vite plugin for Svelte.
- `typescript`, `ts-node`: TypeScript support.
- `vite`: Development server and build tool.
- `vitest`: Testing framework.
- `prettier`, `eslint-config-prettier`: Code formatting and linting.
- `svelte-check`: Type-checking for Svelte files.

### Production Dependencies:

- `lru-cache`, `node-cache`: Caching utilities for optimizing app performance.
- `pino`, `pino-pretty`: Logging libraries for structured logs.

## Environment Variables

Use the `.env` file to manage environment-specific configurations. You can create a `.env` file in the root of your project and add necessary variables there.
