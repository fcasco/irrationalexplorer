# Irrational Explorer

Visualize hidden patterns in the digits of irrational numbers (π, φ, e) by applying boolean functions to each digit and rendering the results as a grid of colored squares.

## Features

- **3 irrational numbers**: Pi (π), Phi (φ), Euler's number (e)
- **12 digit functions**: even/odd, prime, greater/less than, increasing/decreasing, Fibonacci, perfect square, and more
- **Adjustable range**: select any range of digits to visualize
- **Copy states**: export the binary pattern as a string of 1s and 0s
- **Statistics**: true/false counts, ratio, and total digits

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on every push to `main`.

### Setup

1. Go to your repository **Settings → Pages**
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. Push to `main` or manually trigger the workflow from the **Actions** tab

The site will be available at `https://<username>.github.io/<repository-name>/`.
