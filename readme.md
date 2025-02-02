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
<pre>
git clone https://github.com/yourusername/bulk-token-sender.git
cd bulk-token-sender
npm install
</pre>

## ⚙️ Konfigurasi
- Buat file .env di root directory dan tambahkan:

<pre> 
PRIVATE_KEY=your_private_key_here
</pre>

- Siapkan file recipients.csv dengan format berikut:

<pre>
address,amount
0x1234...,10
0x5678...,15
</pre>

## ▶️ Penggunaan
Jalankan skrip dengan perintah berikut:

<pre>
  node script.js
</pre>

## 📝 Catatan
- Pastikan wallet Anda memiliki cukup token dan ETH untuk biaya gas.
- Transaksi dikirim secara berurutan dengan jeda untuk menghindari error.

## 📜 Lisensi
Skrip ini dilisensikan di bawah MIT License. Anda bebas menggunakannya dan memodifikasinya sesuai kebutuhan.
