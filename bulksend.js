require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const csv = require("csv-parser");

// Konfigurasi Jaringan
const RPC_URL = "https://evmrpc-testnet.0g.ai"; // Pilih RPC server yg bagus
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN_ADDRESS = "0xe3e8705442b9342511681107396be352a8ad924f"; // Token address yang mau di kirim
const DECIMALS = 18;
const GAS_PRICE = ethers.parseUnits("1", "gwei"); // Gwei bisa di tambah atau kurang ( semakain besar, semakain cepat untuk pengirimanya )
const GAS_LIMIT = 150000; // Atur sesuai 
const DELAY_SECONDS = 5; // Delay antar transaksi

// ABI Kontrak ERC-20
const tokenAbi = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];

// Inisialisasi Provider & Wallet
const provider = new ethers.WebSocketProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, wallet);

// Fungsi Baca CSV dengan Filter Duplikat
async function readCSV(file) {
  return new Promise((resolve, reject) => {
    const recipients = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (row) => {
        const address = row.address.trim().toLowerCase();
        if (ethers.isAddress(address)) {
          recipients.push({
            address: address,
            amount: row.amount
          });
        }
      })
      .on("end", () => {
        const unique = [...new Map(recipients.map(item => [item.address, item])).values()];
        resolve(unique);
      })
      .on("error", reject);
  });
}

// Fungsi Utama Pengiriman Token
async function sendTokens() {
  try {
    const recipients = await readCSV("recipients.csv");
    let nonce = await provider.getTransactionCount(wallet.address);
    
    console.log(`🚀 Memulai pengiriman ke ${recipients.length} alamat unik`);

    for (const [index, recipient] of recipients.entries()) {
      const amount = ethers.parseUnits(recipient.amount, DECIMALS);
      
      console.log(`\n📦 Proses ${index + 1}/${recipients.length}:`);
      console.log(`   Alamat: ${recipient.address}`);
      console.log(`   Jumlah: ${recipient.amount} token`);

      try {
        const tx = await tokenContract.transfer(
          recipient.address, 
          amount,
          { gasPrice: GAS_PRICE, gasLimit: GAS_LIMIT, nonce: nonce++ }
        );
        console.log(`   ⏳ TX Hash: ${tx.hash}`);
        await tx.wait();
        console.log(`   ✅ Berhasil dikirim!`);
      } catch (error) {
        console.error(`   ❌ Gagal mengirim ke ${recipient.address}:`, error.message);
      }
      
      await new Promise(resolve => setTimeout(resolve, DELAY_SECONDS * 1000));
    }
  } catch (error) {
    console.error("❌ Terjadi kesalahan:", error.message);
  }
}

sendTokens();
