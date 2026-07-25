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
const saveTrackerConfigButton = document.querySelector("#saveTrackerConfig");
const clearTrackerConfigButton = document.querySelector("#clearTrackerConfig");
const tradeFeed = document.querySelector("#tradeFeed");

const sampleTrades = [
  { side: "BUY", wallet: "0x7ad1...e11f", amount: "3.40 ETH", tokens: "8.1M VRT", time: "9 sec ago" },
  { side: "SELL", wallet: "0x51fe...c902", amount: "0.82 ETH", tokens: "1.9M VRT", time: "21 sec ago" },
  { side: "BUY", wallet: "0xd0a4...fa19", amount: "1.16 ETH", tokens: "2.7M VRT", time: "44 sec ago" },
  { side: "BUY", wallet: "0x39c2...8aa0", amount: "5.02 ETH", tokens: "11.8M VRT", time: "1 min ago" },
  { side: "SELL", wallet: "0xc11b...e2a7", amount: "0.49 ETH", tokens: "1.1M VRT", time: "2 min ago" }
];

function renderTradeFeed() {
  if (!tradeFeed) {
    return;
  }

  tradeFeed.innerHTML = sampleTrades
    .map(
      (trade) => `
        <article class="trade-row trade-row-${trade.side.toLowerCase()}">
          <div>
            <p class="trade-side">${trade.side}</p>
            <p class="trade-wallet">${trade.wallet}</p>
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
  });
}

if (clearTrackerConfigButton) {
  clearTrackerConfigButton.addEventListener("click", () => {
    const config = defaultTrackerConfig;
    window.localStorage.removeItem(storageKey);
    updateTrackerUI(config);
  });
}

renderTradeFeed();
updateTrackerUI(loadTrackerConfig());
