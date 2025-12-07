STX Portfolio Tracker – Web App + Chrome Extension
A full-featured portfolio tracking tool built on the Stacks blockchain, enabling users to monitor STX holdings across multiple addresses, view real-time balances, check price data, and connect their Stacks wallet seamlessly. The project includes a responsive web interface and a Chrome extension for quick access.
🚀 Overview
STX Portfolio Tracker is a lightweight, contract-free application designed to make it easy for anyone to track their Stacks assets. It leverages the Stacks API, @stacks/connect, and public blockchain data to deliver a smooth and intuitive monitoring experience without needing smart contracts or backend infrastructure.
✨ Key Features
🔗 Stacks Wallet Integration
Connect instantly using @stacks/connect.
Automatically detect the user’s STX mainnet address.
Secure, non-custodial authentication.
📊 Real-Time Portfolio Tracking
Fetch balances for multiple STX addresses.
Display total STX and USD value.
Pulls live market data from CoinGecko.
Shows total holdings and individual address stats.
📮 Activity Monitoring
Displays recent transactions per address.
Includes inbound/outbound STX details.
Uses the Hiro Stacks API for reliable chain data.
🧩 Chrome Extension Included
Quick-access popup for checking STX balances.
Wallet connect support.
Lightweight extension powered by the same engine as the web version.
🎨 Beautiful UI
Built with TailwindCSS for a clean, modern interface.
Mobile-optimized, fully responsive layout.
⚡ No Smart Contract Needed
This project runs entirely on:
client-side React
public blockchain APIs
Stacks wallet connection
No Clarity contract required.
🛠 Tech Stack
React + Vite – Fast, modern front-end tooling
TailwindCSS – Streamlined UI styling
@stacks/connect – Wallet integration
Stacks API – On-chain data (balances, txs)
CoinGecko API – Real-time STX/USD price
Manifest V3 – Chrome extension
LocalStorage – Persistent multi-address watchlist
📦 Project Structure
Copy code

stx-portfolio-tracker/
│── web/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
│
│── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── icon assets
🔧 How It Works
User connects their Stacks wallet
The app fetches their STX address
Users can add more addresses to track
Balances + transactions are fetched from the Stacks API
Price data is fetched from CoinGecko
Data is aggregated into a clean portfolio dashboard
🌐 Deployment
The web app can be deployed instantly on Vercel, Netlify, or GitHub Pages since it’s a fully client-side application.
The Chrome extension loads via the chrome://extensions interface in developer mode.
📄 License
MIT License – free to use, modify, and build on.
💡 Future Enhancements
STX stacking rewards calculator
NFT holdings viewer
User-saved presets with cloud sync
Address tagging & notes
