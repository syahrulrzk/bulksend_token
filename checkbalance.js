require("dotenv").config();
const { ethers } = require("ethers");

// Konfigurasi Jaringan
const RPC_URL = "https://1rpc.io/sepolia";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("❌ Private key tidak ditemukan! Pastikan sudah diset di .env");
  process.exit(1);
}

// Fungsi Cek Saldo ETH
async function checkBalance() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Saldo ETH: ${ethers.formatEther(balance)} ETH`);
  } catch (error) {
    console.error("❌ Gagal mengecek saldo:", error.message);
  }
}

// Jalankan fungsi cek saldo
checkBalance();
