# Memecoin Starter

This project creates a basic ERC-20 token called `Verity` with ticker `VRT`, plus a static landing page.

The contract mints a fixed supply of `1,000,000,000` tokens with `18` decimals to the deployer wallet.

## Files

- `contracts/MemeCoin.sol`: token contract
- `scripts/deploy.js`: deployment script
- `hardhat.config.js`: compiler and network config
- `index.html`: site entry point
- `site/styles.css`: landing page styles
- `site/main.js`: landing page interactions

## Quick start

```bash
npm install
copy .env.example .env
```

Set these values in `.env`:

- `SEPOLIA_RPC_URL`
- `PRIVATE_KEY`

Build contracts and site:

```bash
npm run build
```

Run the landing page locally:

```bash
npm run dev:site
```

## Publish to GitHub Pages

This repo includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml`.

1. Create a new GitHub repository.
2. Push this project to the `main` branch of that repository.
3. In GitHub, open `Settings > Pages`.
4. Set `Source` to `GitHub Actions`.
5. Push to `main` again if needed.

Your public site URL will be:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

Deploy to Sepolia:

```bash
npm run deploy:sepolia
```

## Notes

- This is a plain ERC-20 starter, not an audited production token.
- There are no taxes, blacklist features, admin minting hooks, or liquidity controls.
- If you want a different token name, symbol, or supply, edit `contracts/MemeCoin.sol`.
- Replace the placeholder contract button in `index.html` after deployment.
