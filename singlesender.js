require("dotenv").config();
const { ethers } = require("ethers");

// Konfigurasi
const RPC_URL = "https://1rpc.io/sepolia"; // Ganti dengan jaringan yang sesuai
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN_ADDRESS = "0xa2efb0e5d6580C9c9C13b09b0b87E104E0916475"; // Ganti dengan token yang ingin dikirim
const DECIMALS = 18; // Sesuaikan dengan token

// Alamat penerima & jumlah token
const RECIPIENT = "0x85331ff167aa0345301c1ad66cf7cbc0cde6edc3"; // Ganti dengan alamat tujuan
const AMOUNT = "10"; // Jumlah token yang ingin dikirim

// ABI Kontrak ERC-20 (Minimal untuk transfer)
const tokenAbi = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];

async function sendToken() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, wallet);

    const amountInWei = ethers.parseUnits(AMOUNT, DECIMALS);
    
    console.log(`🚀 Mengirim ${AMOUNT} token ke ${RECIPIENT}...`);

    const tx = await tokenContract.transfer(RECIPIENT, amountInWei);
    console.log(`✅ Transaksi dikirim! TX Hash: ${tx.hash}`);

    // Tunggu transaksi selesai
    await tx.wait();
    console.log("🎉 Transaksi berhasil!");
  } catch (error) {
    console.error("❌ Gagal mengirim token:", error.message);
  }
}

// Jalankan fungsi pengiriman token
sendToken();
