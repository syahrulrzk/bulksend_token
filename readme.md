# Bulk Token Sender for Ethereum Sepolia

Skrip ini memungkinkan pengguna untuk mengirim token ERC-20 secara massal di jaringan Ethereum Sepolia menggunakan WebSocket RPC.

## 🚀 Fitur
- Menggunakan WebSocket RPC untuk transaksi real-time.
- Membaca daftar penerima dari file CSV.
- Menangani nonce secara otomatis.
- Menambahkan jeda antar transaksi untuk menghindari rate limiting.

## 📋 Prasyarat
- Install Node.js (disarankan v16 atau lebih baru).
- Dapatkan wallet Ethereum Sepolia dengan saldo yang cukup.
- Dapatkan alamat kontrak token ERC-20 di jaringan Sepolia.
- Buat file .env dengan private key Anda.

## 🔧 Instalasi
Clone repositori ini dan install dependensi:
```
~# git clone https://github.com/yourusername/bulk-token-sender.git
~# cd bulk-token-sender
~# apt install nodejs
~# npm install dotenv ethers fs csv-parser
~# npm install
```

## ⚙️ Konfigurasi
- Edit Script file bulksend.js Dan ganti Token Adreess yang mau dikirim
- <b><i>nano file bulksend.js</i></b>
```
require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const csv = require("csv-parser");

// Konfigurasi Jaringan
const RPC_URL = "wss://ethereum-sepolia-rpc.publicnode.com"; // Pilih RPC server yg bagus
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN_ADDRESS = "0xa2efb0e5d6580C9c9C13b09b0b87E104E0916475"; // Token address yang mau di kirim
const DECIMALS = 18;
const GAS_PRICE = ethers.parseUnits("10", "gwei"); // Gwei bisa di tambah atau kurang ( semakain besar, semakain cepat untuk pengirimanya )
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
```

- Edit file .env di root directory dan tambahkan Private key Wallet: 
- <b><i>nano .env</i></b>
``` 
  PRIVATE_KEY=your_private_key_here
```

- Edit file recipients.csv dengan format berikut: 
-  <b><i>nano recipients.csv</i></b>
```
  address,amount
  0x1234...,10
  0x5678...,15
```

## ▶️ Penggunaan
Jalankan skrip dengan perintah berikut:

```
  ~# node bulksend.js
```

## 📝 Catatan
- Pastikan wallet Anda memiliki cukup token dan ETH untuk biaya gas.
- Transaksi dikirim secara berurutan dengan jeda untuk menghindari error.

## 📜 Lisensi
Skrip ini dilisensikan di bawah MIT License. Anda bebas menggunakannya dan memodifikasinya sesuai kebutuhan.
