const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

const parallaxLayers = [
  { element: document.querySelector(".bg-gradient-shift"), multiplierX: 18, multiplierY: 14 },
  { element: document.querySelector(".bg-orb-a"), multiplierX: 30, multiplierY: 24 },
  { element: document.querySelector(".bg-orb-b"), multiplierX: -26, multiplierY: 20 },
  { element: document.querySelector(".bg-ribbon-a"), multiplierX: 34, multiplierY: 10 },
  { element: document.querySelector(".bg-ribbon-b"), multiplierX: -30, multiplierY: 14 },
  { element: document.querySelector(".bg-ribbon-c"), multiplierX: 22, multiplierY: -18 },
  { element: document.querySelector(".bg-grid-glow"), multiplierX: 16, multiplierY: 12 },
  { element: document.querySelector(".site-header"), multiplierX: 5, multiplierY: 4 },
  { element: document.querySelector(".hero"), multiplierX: 8, multiplierY: 6 },
  { element: document.querySelector(".hero-card"), multiplierX: 10, multiplierY: 8 },
  { element: document.querySelector(".overview"), multiplierX: -6, multiplierY: 5 },
  { element: document.querySelector(".signal"), multiplierX: 6, multiplierY: -5 },
  { element: document.querySelector("#tokenomics"), multiplierX: -5, multiplierY: 4 },
  { element: document.querySelector("#community"), multiplierX: 5, multiplierY: -4 },
  { element: document.querySelector("#roadmap"), multiplierX: -5, multiplierY: 4 },
  { element: document.querySelector("#faq"), multiplierX: 5, multiplierY: -4 },
  { element: document.querySelector(".site-footer"), multiplierX: 6, multiplierY: 4 }
].filter((layer) => layer.element);

let pointerX = 0;
let pointerY = 0;
let currentX = 0;
let currentY = 0;
let animationFrame = null;

function renderParallax() {
  currentX += (pointerX - currentX) * 0.08;
  currentY += (pointerY - currentY) * 0.08;

  parallaxLayers.forEach(({ element, multiplierX, multiplierY }) => {
    const x = currentX * multiplierX;
    const y = currentY * multiplierY;
    element.style.setProperty("--parallax-x", `${x}px`);
    element.style.setProperty("--parallax-y", `${y}px`);
  });

  animationFrame = requestAnimationFrame(renderParallax);
}

window.addEventListener("mousemove", (event) => {
  pointerX = event.clientX / window.innerWidth - 0.5;
  pointerY = event.clientY / window.innerHeight - 0.5;
});

window.addEventListener("mouseleave", () => {
  pointerX = 0;
  pointerY = 0;
});

if (!animationFrame) {
  animationFrame = requestAnimationFrame(renderParallax);
}

const storageKey = "verity-local-tracker-config";
const defaultTrackerConfig = {
  contractAddress: "CUNmNyAnPAA3wkUTbqo1jvQWjvu9UDVkQdBBH1grpump",
  chain: "Solana"
};
const contractInput = document.querySelector("#contractAddressInput");
const chainSelect = document.querySelector("#chainSelect");
const savedContractText = document.querySelector("#savedContractText");
const savedChainText = document.querySelector("#savedChainText");
const savedPoolText = document.querySelector("#savedPoolText");
const saveTrackerConfigButton = document.querySelector("#saveTrackerConfig");
const clearTrackerConfigButton = document.querySelector("#clearTrackerConfig");
const tradeFeed = document.querySelector("#tradeFeed");
const metricPrice = document.querySelector("#metricPrice");
const metricVolume = document.querySelector("#metricVolume");
const metricLiquidity = document.querySelector("#metricLiquidity");
const metricTxns = document.querySelector("#metricTxns");
const trackerNote = document.querySelector("#trackerNote");

let activeTrackerInterval = null;

function formatCompactNumber(value, maximumFractionDigits = 2) {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits
  }).format(numericValue);
}

function formatUsd(value, maximumFractionDigits = 2) {
  const numericValue = Number(value || 0);

  if (numericValue > 0 && numericValue < 0.01) {
    return `$${numericValue.toFixed(8)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits
  }).format(numericValue);
}

function shortenAddress(address) {
  if (!address || address.length < 12) {
    return address || "Unknown";
  }

  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function relativeTime(timestamp) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));

  if (seconds < 60) {
    return `${seconds} sec ago`;
  }

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)} min ago`;
  }

  return `${Math.floor(seconds / 3600)} hr ago`;
}

function setTrackerMessage(message) {
  if (trackerNote) {
    trackerNote.textContent = message;
  }
}

function renderTradeFeed(trades) {
  if (!tradeFeed) {
    return;
  }

  if (!trades.length) {
    tradeFeed.innerHTML = '<p class="tracker-empty">No recent trades returned yet.</p>';
    return;
  }

  tradeFeed.innerHTML = trades
    .map(
      (trade) => `
        <article class="trade-row trade-row-${trade.side.toLowerCase()}">
          <div>
            <p class="trade-side">${trade.side}</p>
            <p class="trade-wallet">${shortenAddress(trade.wallet)}</p>
          </div>
          <div>
            <p class="trade-amount">${trade.amount}</p>
            <p class="trade-tokens">${trade.tokens}</p>
          </div>
          <p class="trade-time">${trade.time}</p>
        </article>
      `
    )
    .join("");
}

function updateMetricElements({ priceUsd, volumeUsd24h, liquidityUsd, buys24h, sells24h, poolAddress }) {
  if (metricPrice) {
    metricPrice.textContent = formatUsd(priceUsd, 8);
  }

  if (metricVolume) {
    metricVolume.textContent = formatUsd(volumeUsd24h);
  }

  if (metricLiquidity) {
    metricLiquidity.textContent = formatUsd(liquidityUsd);
  }

  if (metricTxns) {
    metricTxns.textContent = `${buys24h} / ${sells24h}`;
  }

  if (savedPoolText) {
    savedPoolText.textContent = poolAddress ? shortenAddress(poolAddress) : "Not found";
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

async function loadLiveTracker(config) {
  const contractAddress = config.contractAddress?.trim();

  if (!contractAddress) {
    updateMetricElements({
      priceUsd: 0,
      volumeUsd24h: 0,
      liquidityUsd: 0,
      buys24h: 0,
      sells24h: 0,
      poolAddress: ""
    });
    renderTradeFeed([]);
    setTrackerMessage("Enter a contract address to load live data.");
    return;
  }

  setTrackerMessage("Loading live data...");

  try {
    const [dexData, geckoData] = await Promise.all([
      fetchJson(`https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`),
      fetchJson(`https://api.geckoterminal.com/api/v2/networks/solana/tokens/${contractAddress}`)
    ]);

    const pair = dexData.pairs?.[0];
    const topPoolId = geckoData.data?.relationships?.top_pools?.data?.[0]?.id;
    const poolAddress = topPoolId?.split("solana_")[1] || pair?.pairAddress || "";

    if (!pair || !poolAddress) {
      throw new Error("No live pair found for this token.");
    }

    const tradesData = await fetchJson(
      `https://api.geckoterminal.com/api/v2/networks/solana/pools/${poolAddress}/trades`
    );

    updateMetricElements({
      priceUsd: pair.priceUsd,
      volumeUsd24h: pair.volume?.h24,
      liquidityUsd: geckoData.data?.attributes?.total_reserve_in_usd,
      buys24h: pair.txns?.h24?.buys || 0,
      sells24h: pair.txns?.h24?.sells || 0,
      poolAddress
    });

    const trades = (tradesData.data || []).slice(0, 8).map((trade) => {
      const attributes = trade.attributes || {};
      const isBuy = attributes.kind === "buy";
      const quoteSymbol = pair.quoteToken?.symbol || "QUOTE";
      const baseSymbol = pair.baseToken?.symbol || "TOKEN";
      const quoteAmount = Number(isBuy ? attributes.from_token_amount : attributes.to_token_amount || 0);
      const baseAmount = Number(isBuy ? attributes.to_token_amount : attributes.from_token_amount || 0);

      return {
        side: isBuy ? "BUY" : "SELL",
        wallet: attributes.tx_from_address,
        amount: `${quoteAmount.toFixed(4)} ${quoteSymbol}`,
        tokens: `${formatCompactNumber(baseAmount, 2)} ${baseSymbol}`,
        time: relativeTime(attributes.block_timestamp)
      };
    });

    renderTradeFeed(trades);
    setTrackerMessage(`Live data from public Dexscreener and GeckoTerminal APIs.`);
  } catch (error) {
    console.error(error);
    renderTradeFeed([]);
    setTrackerMessage("Live data request failed. Check the token address and try again.");
  }
}

function updateTrackerUI(config) {
  if (savedContractText) {
    savedContractText.textContent = config.contractAddress || defaultTrackerConfig.contractAddress;
  }

  if (savedChainText) {
    savedChainText.textContent = config.chain || defaultTrackerConfig.chain;
  }

  if (contractInput) {
    contractInput.value = config.contractAddress || defaultTrackerConfig.contractAddress;
  }

  if (chainSelect) {
    chainSelect.value = config.chain || defaultTrackerConfig.chain;
  }
}

function loadTrackerConfig() {
  try {
    const rawConfig = window.localStorage.getItem(storageKey);
    return rawConfig ? JSON.parse(rawConfig) : defaultTrackerConfig;
  } catch {
    return defaultTrackerConfig;
  }
}

if (saveTrackerConfigButton) {
  saveTrackerConfigButton.addEventListener("click", () => {
    const config = {
      contractAddress: contractInput?.value.trim() || defaultTrackerConfig.contractAddress,
      chain: chainSelect?.value || defaultTrackerConfig.chain
    };

    window.localStorage.setItem(storageKey, JSON.stringify(config));
    updateTrackerUI(config);
    loadLiveTracker(config);
  });
}

if (clearTrackerConfigButton) {
  clearTrackerConfigButton.addEventListener("click", () => {
    const config = defaultTrackerConfig;
    window.localStorage.removeItem(storageKey);
    updateTrackerUI(config);
    loadLiveTracker(config);
  });
}

const initialTrackerConfig = loadTrackerConfig();

updateTrackerUI(initialTrackerConfig);
loadLiveTracker(initialTrackerConfig);

if (activeTrackerInterval) {
  window.clearInterval(activeTrackerInterval);
}

activeTrackerInterval = window.setInterval(() => {
  loadLiveTracker(loadTrackerConfig());
}, 30000);
