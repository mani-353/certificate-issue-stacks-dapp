# 📜 Certificate Issuer DApp on Stacks Blockchain

A decentralized application (DApp) to issue and verify certificates using the [Stacks Blockchain](https://www.stacks.co/). Built with Clarity smart contracts and a modern Next.js frontend, this project allows secure, transparent, and verifiable certificate management on the blockchain.

---

## 🛠 Tech Stack Used

- **Frontend**: Next.js, Tailwind CSS, TypeScript, Heroicons, Lucide
- **Blockchain**: Clarity Smart Contracts, Stacks Testnet
- **Tools & Libraries**: Clarinet (for contract testing), Stacks.js, Blockstack Auth
- **Deployment**: Vercel (Frontend), Hiro Wallet (for blockchain interaction)

---

## ⚙️ Setup Instructions

1. **Clone the Repository**
   
   ```bash
   git clone https://github.com/your-username/certificate-issue-stacks-dapp.git
   
   cd certificate-issue-stacks-dapp
   ```
   
2. **Install Frontend Dependencies**

   ```bash
   cd frontend/next.js
   
   npm install
   ```
   
3. **Run the Frontend Locally**
   
   ```bash
   npm run dev
   ```
   
4. **Deploy Smart Contract (Optional)**
   
   Requires [Clarinet](https://docs.stacks.co/docs/clarity/clarinet-cli/overview/)
   
   ```bash
   cd contracts
   clarinet test
   clarinet check
   ```
   
---
## 📄 Smart Contract Address

- **Network**: Stacks Testnet  
- **Contract Address**: `ST34H017VX32RKDE9QG5Z3F1AC54KFMMJQ7QMS5H4.cert-dapp`

---

## 🚀 How to Use the Project

1. Visit the deployed DApp:  
   🌐 [certificate-issue-stacks.vercel.app](https://certificate-issue-stacks.vercel.app)

2. Connect your **Hiro Wallet** (ensure it’s set to Testnet)

3. Go to **Issue Certificate**
   - Fill in student and course information
   - Click **Issue Certificate** to confirm the blockchain transaction

4. Go to **Verify Certificate**
   - Enter the certificate ID or details
   - Fetch and verify certificate data directly from the blockchain

---

## 👥 Team Members

- **Manikanta Veera Nandikolla**  
  Full Stack & Blockchain Developer  
  GitHub: [@mani-353](https://github.com/mani-353)


---


## 📁 Repository Structure

```bash
certificate-issue-stacks-dapp/
├── contracts/
│   └── cert-dapp.clar          # Clarity smart contract logic
├── frontend/next.js/           # Frontend built with Next.js and Tailwind CSS
│   └── ...                     # Pages, Components, Utilities
├── contract-address.txt        # Reference file for deployed address
├── README.md                   # You're here!
```
---

> 🚀 Built for the Stacks Full Stack Bootcamp — bringing decentralized credentialing to the blockchain world.



