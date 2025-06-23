Aplikasi ini dirancang khusus untuk para "Airdrop Hunter" dan penggemar kripto yang ingin mengelola dan tidak melewatkan jadwal penting seperti listing token, event testnet, atau pengingat proyek DePIN. Dilengkapi dengan notifikasi desktop dan email otomatis, serta antarmuka yang interaktif!
✨ Fitur Unggulan

* Manajemen Pengingat Komprehensif: Tambah, lihat, dan hapus pengingat dengan mudah.
* Kategori Khusus: Atur pengingat ke dalam kategori Tesnet atau DePIN.
* Tipe Pengingat Fleksibel: Buat pengingat untuk Listing (dengan tanggal spesifik di masa depan) atau Reminder umum (dengan tanggal hari ini sebagai default).
* Notifikasi Otomatis:

Notifikasi Desktop: Dapatkan pop-up pemberitahuan langsung di desktop Anda saat pengingat jatuh tempo.
Notifikasi Email: Terima detail pengingat melalui email, memastikan Anda tidak melewatkan informasi penting bahkan saat tidak berada di depan komputer.


* Konfigurasi Email Mudah: Atur detail SMTP dan kredensial email pengirim/penerima langsung dari aplikasi.

PENTING: Mendukung penggunaan App Password untuk keamanan maksimal (disarankan untuk Gmail, Outlook, dll.).


* Penyimpanan Data Persisten: Semua pengingat dan konfigurasi email disimpan secara lokal, jadi Anda tidak perlu mengaturnya ulang setiap kali aplikasi dimulai.
* Antarmuka Interaktif: Pengalaman pengguna yang menarik dengan banner ASCII art, animasi loading yang keren, dan pewarnaan teks yang intuitif.
* Sistem Login Sederhana: Pengamanan dasar untuk akses aplikasi.

📦 Dependensi
Pastikan Anda memiliki Node.js terinstal di sistem Anda.
Aplikasi ini menggunakan beberapa pustaka Node.js yang populer:

* node-schedule: Untuk penjadwalan pengingat.
* node-notifier: Untuk notifikasi desktop.
* chalk: Untuk pewarnaan teks di konsol.
* nodemailer: Untuk pengiriman email.

🚀 Cara Instalasi & Penggunaan
Ikuti langkah-langkah di bawah ini untuk menginstal dan menjalankan Airdrop Hunter Reminder di komputer Anda.
1. Klon Repositori
```bash
git clone https://github.com/your-username/airdrop-hunter-reminder.git
cd airdrop-hunter-reminder
```

2. Instal Dependensi
```bash
npm install node-schedule node-notifier chalk nodemailer
```
3. Buat File emailSender.js
Pastikan Anda memiliki file emailSender.js di direktori yang sama dengan index.js.
Berikut adalah isinya:
```bash
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const EMAIL_CONFIG_FILE = path.join(__dirname, 'emailConfig.json'); 

let emailConfig = {
  emailUser: '',
  emailPass: '', // Ini HARUS App Password dari penyedia email Anda, bukan password email utama
  recipientEmail: '',
  smtpHost: '',
  smtpPort: 587,
  secure: false // true untuk port 465 (SSL/TLS), false untuk port lain seperti 587 (STARTTLS)
};

// Muat konfigurasi email dari file saat modul diinisialisasi
function loadEmailConfig() {
  if (fs.existsSync(EMAIL_CONFIG_FILE)) {
    try {
      emailConfig = JSON.parse(fs.readFileSync(EMAIL_CONFIG_FILE, 'utf-8'));
    } catch (error) {
      console.error('Error loading email config file:', error.message);
      // Atur ulang ke default jika ada kesalahan parsing
      emailConfig = {
        emailUser: '',
        emailPass: '',
        recipientEmail: '',
        smtpHost: '',
        smtpPort: 587,
        secure: false
      };
    }
  }
}

// Simpan konfigurasi email ke file
function saveEmailConfig() {
  try {
    fs.writeFileSync(EMAIL_CONFIG_FILE, JSON.stringify(emailConfig, null, 2));
    console.log('Konfigurasi email berhasil disimpan ke emailConfig.json');
  } catch (error) {
    console.error('Error saving email config file:', error.message);
  }
}

// Dapatkan konfigurasi email saat ini (salinannya)
function getEmailConfig() {
  return { ...emailConfig };
}

// Atur konfigurasi email baru
function setEmailConfig(newConfig) {
  // Hanya perbarui properti yang diberikan, jaga yang lain tetap utuh
  emailConfig = { ...emailConfig, ...newConfig };
}

// Fungsi untuk mengirim email pengingat
async function sendReminderEmail(subject, htmlBody, senderDisplayName = 'Airdrop Hunter Reminder') {
  // Validasi konfigurasi sebelum mencoba mengirim
  if (!emailConfig.emailUser || !emailConfig.emailPass || !emailConfig.smtpHost || !emailConfig.recipientEmail) {
    throw new Error('Konfigurasi email belum lengkap. Harap atur melalui menu "Pengaturan Akun Email" (Opsi 4).');
  }

  // Buat transporter Nodemailer
  let transporter = nodemailer.createTransport({
    host: emailConfig.smtpHost,
    port: emailConfig.smtpPort,
    secure: emailConfig.secure,
    auth: {
      user: emailConfig.emailUser,
      pass: emailConfig.emailPass,
    },
    // Jika secure: false dan Anda mengalami masalah sertifikat, Anda bisa menambahkan ini
    // Namun, disarankan untuk memperbaiki masalah sertifikat atau menggunakan secure: true
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Kirim email
    let info = await transporter.sendMail({
      from: `"${senderDisplayName}" <${emailConfig.emailUser}>`,
      to: emailConfig.recipientEmail,
      subject: subject,
      html: htmlBody,
    });

    // console.log("Pesan email terkirim: %s", info.messageId); // Opsional: untuk debug
    return true; // Berhasil terkirim
  } catch (error) {
    console.error("Kesalahan saat mengirim email:", error); // Log error secara detail
    throw new Error(`Gagal mengirim email. Pesan: ${error.message}. Periksa detail konfigurasi email.`);
  }
}

module.exports = {
  loadEmailConfig,
  saveEmailConfig,
  getEmailConfig,
  setEmailConfig,
  sendReminderEmail
};
```
4. Jalankan Aplikasi
```bash
node reminder.js
```
👨‍💻 Cara Menggunakan Aplikasi
Setelah menjalankan node index.js, Anda akan diarahkan melalui beberapa langkah:
1. Login
Anda akan diminta untuk login. Gunakan kredensial berikut:

* USERNAME: DEASAPUTRA12
* PASSWORD: DEAGANTENG

2. Menu Utama
Setelah login, Anda akan melihat menu utama dengan opsi-opsi berikut:
No.MenuFungsi1.TAMBAH PENGINGAT BARUMenambahkan pengingat baru (listing atau reminder) dengan detail waktu dan pesan.2.LIHAT SEMUA PENGINGATMenampilkan daftar semua pengingat yang tersimpan, dikategorikan dan diurutkan.3.HAPUS PENGINGATMemungkinkan Anda memilih dan menghapus pengingat yang sudah tidak relevan.4.PENGATURAN AKUN EMAILMengatur detail akun email yang akan digunakan untuk mengirim notifikasi. Wajib diatur agar notifikasi email berfungsi!5.TES PENGIRIMAN EMAILMengirim email tes untuk memverifikasi bahwa pengaturan email Anda sudah benar.6.KELUARMenutup aplikasi.
3. Konfigurasi Email (Opsi 4) - PENTING!
Ini adalah langkah paling krusial untuk memastikan notifikasi email Anda berfungsi.

* Email Pengirim: Alamat email Anda yang akan digunakan untuk mengirim notifikasi.
* App Password: INI BUKAN PASSWORD EMAIL UTAMA ANDA. Anda harus membuat App Password khusus dari pengaturan keamanan akun email Anda (misalnya, di akun Google, Outlook, dll.). Ini adalah string karakter alfanumerik yang panjang (contoh: abcd efgh ijkl mnop).

Contoh Gmail: Kunjungi myaccount.google.com/apppasswords setelah mengaktifkan Verifikasi 2 Langkah.


* Email Penerima Notifikasi: Alamat email tujuan notifikasi. Bisa sama dengan email pengirim atau email lain.
* SMTP Host: Alamat server SMTP penyedia email Anda (misal: smtp.gmail.com, smtp.office365.com).
* SMTP Port: Port server SMTP (misal: 587 untuk STARTTLS, 465 untuk SSL/TLS).
* Gunakan koneksi aman? (y/n): Jawab y jika menggunakan SSL/TLS (biasanya dengan Port 465), atau n jika menggunakan STARTTLS (biasanya dengan Port 587).

Setelah mengisi, gunakan Opsi 5 (TES PENGIRIMAN EMAIL) untuk memastikan konfigurasi Anda benar.
4. Menambah Pengingat (Opsi 1)

* List: tesnet atau depin.
* Tipe:

listing: Untuk jadwal spesifik di masa depan (misal: 2025-12-31 23:59).
reminder: Untuk pengingat umum (tanggal akan otomatis hari ini).


* Tanggal (YYYY-MM-DD): Hanya untuk tipe listing. Pastikan tanggal di masa depan.
* Jam (HH:mm): Waktu spesifik (format 24 jam, misal: 09:30 atau 14:00).
* Pesan: Teks notifikasi yang akan muncul di desktop dan email Anda.
* Prioritas: rendah, sedang, atau tinggi.

Penting: Setelah menambah pengingat, biarkan aplikasi tetap berjalan di terminal agar notifikasi dapat terpicu pada waktunya. Jika Anda menutup aplikasi, jadwal akan berhenti dan tidak akan mengirim notifikasi.
💡 Tips & Trik

* App Password: Selalu gunakan App Password untuk keamanan. Jangan pernah menggunakan kata sandi email utama Anda langsung di aplikasi pihak ketiga.
* Tetap Berjalan: Agar pengingat berfungsi, aplikasi ini harus tetap berjalan (misalnya, di terminal yang diminimalisir atau di background menggunakan pm2 atau sejenisnya).
* Cek Spam: Jika Anda tidak menerima email, periksa folder spam atau junk Anda.
* Waktu Sistem: Pastikan waktu di komputer Anda akurat dan sinkron.
* Debug Email: Jika TES PENGIRIMAN EMAIL gagal, perhatikan pesan kesalahan di konsol. Itu akan memberikan petunjuk tentang apa yang salah (misalnya, autentikasi gagal, detail server salah).
