const fs = require('fs');
const path = require('path');
const readline = require('readline');
const schedule = require('node-schedule');
const notifier = require('node-notifier');
const chalk = require('chalk');
const emailSender = require('./emailSender'); // Memuat modul email

const REMINDER_FILE = path.join(__dirname, 'reminders.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let reminders = { tesnet: [], depin: [] };

function banner() {
  console.log(chalk.redBright(`
        ┌────────────┐ ┌────────────┐ ┌────────────┐
        │            │ │            │ │            │
        │    ░█▀█    │ │    ░▀█▀    │ │    ░█▀▄    │
        │    ░█▀█    │ │    ░░█░    │ │    ░█▀▄    │
        │    ░▀░▀    │ │    ░▀▀▀    │ │    ░▀░▀    │
        │            │ │            │ │            │
        └────────────┘ └────────────┘ └────────────┘
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│            │ │            │ │            │ │            │
│    ░█▀▄    │ │    ░█▀▄    │ │    ░█▀█    │ │    ░█▀█    │
│    ░█░█    │ │    ░█▀▄    │ │    ░█░█    │ │    ░█▀▀    │
│    ░▀▀░    │ │    ░▀░▀    │ │    ░▀▀▀    │ │    ░▀░░    │
│            │ │            │ │            │ │            │
└────────────┘ └────────────┘ └────────────┘ └────────────┘

        ░▀█▀░█▀█░█▀▄░█▀▀░█▀█░█▀▀░█▀█░█▀▄░█▀▀░█▀█
        ░░█░░█░█░█░█░█▀▀░█▀▀░█▀▀░█░█░█░█░█▀▀░█░█
        ░▀▀▀░▀░▀░▀▀░░▀▀▀░▀░░░▀▀▀░▀░▀░▀▀░░▀▀▀░▀░▀
`));
}

// FUNGSI ANIMASI YANG TELAH DIPERBAIKI
async function playLoadingAnimation(message = 'Loading...', duration = 2000) {
    const chars = '01';
    const colors = [chalk.red, chalk.yellow, chalk.green, chalk.cyan, chalk.blue, chalk.magenta];
    const interval = 50;
    const totalFrames = Math.floor(duration / interval);
    for (let i = 0; i < totalFrames; i++) {
        let line = '';
        for (let j = 0; j < 30; j++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            line += color(chars[Math.floor(Math.random() * chars.length)]);
        }
        process.stdout.write(`\r${line} ${chalk.whiteBright(message)}`);
        await new Promise(r => setTimeout(r, interval));
    }
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
}


async function login() {
  while (true) {
    console.clear();
    banner();
    console.log(chalk.red('\nSELAMAT DATANG AIRDROP HUNTER '));
    console.log(chalk.red('SILAHKAN LOGIN UNTUK MELANJUTKAN.\n'));

    const username = await ask('USERNAME: ');
    const password = await ask('PASSWORD: ');
    await playLoadingAnimation('Memeriksa identitas...', 2000);

    if (username === 'DEASAPUTRA12' && password === 'DEAGANTENG') {
      console.log(chalk.green('\n✅ Login berhasil!'));
      await new Promise(r => setTimeout(r, 1000));
      break;
    } else {
      console.log(chalk.red('\n❌ Username atau password salah.'));
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

function loadReminders() {
  try {
    if (fs.existsSync(REMINDER_FILE)) {
      const fileContent = fs.readFileSync(REMINDER_FILE, 'utf-8');
      reminders = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error(chalk.red('Gagal memuat file reminders.json. File mungkin rusak. Membuat file baru.'));
    reminders = { tesnet: [], depin: [] };
    saveReminders();
  }
}

function saveReminders() {
  try {
    fs.writeFileSync(REMINDER_FILE, JSON.stringify(reminders, null, 2));
  } catch (error) {
    console.error(chalk.red('Gagal menyimpan file reminders.json:', error.message));
  }
}

function scheduleReminder(list, reminder) {
  const dateObj = new Date(`${reminder.date}T${reminder.time}:00`);
  if (dateObj < new Date()) {
    return;
  }

  schedule.scheduleJob(dateObj, async () => {
    console.clear();
    const message = `
🔔 [${list.toUpperCase()}] ${reminder.type.toUpperCase()}
Tanggal: ${reminder.date}
Waktu: ${reminder.time}
Prioritas: ${reminder.priority.toUpperCase()}
Pesan: ${reminder.message}
    `.trim();

    console.log(chalk.yellow(message));
    notifier.notify({
      title: `${reminder.type.toUpperCase()} [${list.toUpperCase()}]`,
      message: reminder.message,
      sound: true
    });

    try {
      await emailSender.sendReminderEmail(
        `${reminder.type.toUpperCase()} [${list.toUpperCase()}]`,
        message,
        'Airdrop Hunter Reminder'
      );
      console.log(chalk.green('✅ Notifikasi email terkirim!'));
    } catch (error) {
      console.error(chalk.red('❌ Gagal mengirim email:', error.message));
    }
  });
}

function scheduleAllReminders() {
  schedule.gracefulShutdown();
  Object.entries(reminders).forEach(([list, items]) => {
    items.forEach(reminder => scheduleReminder(list, reminder));
  });
  console.log(chalk.cyan('🚀 Semua pengingat telah dijadwalkan ulang.'));
}

async function addReminder() {
  console.clear();
  console.log('\n📋 Tambah Pengingat Baru');
  let list = '';
  while (!['tesnet', 'depin'].includes(list)) {
    list = (await ask('List (tesnet/depin): ')).trim().toLowerCase();
  }
  let type = '';
  while (!['listing', 'reminder'].includes(type)) {
    type = (await ask('Tipe (listing/reminder): ')).trim().toLowerCase();
  }
  let date = '';
  if (type === 'listing') {
    do {
      date = (await ask('Tanggal (YYYY-MM-DD): ')).trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.log(chalk.red('❌ Format tanggal salah. Contoh: 2025-12-31'));
        date = '';
      }
    } while (!date);
  } else {
    const now = new Date();
    date = now.toISOString().split('T')[0];
    console.log(chalk.yellow(`Tanggal otomatis diisi: ${date}`));
  }
  let time = '';
  do {
    time = (await ask('Jam (HH:mm): ')).trim();
    if (!/^\d{2}:\d{2}$/.test(time)) {
      console.log(chalk.red('❌ Format jam salah. Contoh: 09:30'));
      time = '';
    }
  } while (!time);
  const msg = await ask('Pesan: ');
  let prio = '';
  while (!['rendah', 'sedang', 'tinggi'].includes(prio)) {
    prio = (await ask('Prioritas (rendah/sedang/tinggi): ')).trim().toLowerCase();
  }
  const reminder = { date, time, message: msg, priority: prio, type };
  reminders[list].push(reminder);
  saveReminders();
  scheduleAllReminders();
  console.log(chalk.green('✅ Pengingat dibuat dan telah dijadwalkan secara otomatis!'));
  await ask('Enter untuk kembali...');
}

function showTable(title, data, listName) {
    if (!data) data = [];
    const wNo = 4, wDate = 17, wPrio = 10, wList = 8, wMsg = 30;
    const top = "╔" + "═".repeat(wNo) + "╦" + "═".repeat(wDate) + "╦" + "═".repeat(wPrio) + "╦" + "═".repeat(wList) + "╦" + "═".repeat(wMsg) + "╗";
    const head = "╠" + "═".repeat(wNo) + "╬" + "═".repeat(wDate) + "╬" + "═".repeat(wPrio) + "╬" + "═".repeat(wList) + "╬" + "═".repeat(wMsg) + "╣";
    const bot = "╚" + "═".repeat(wNo) + "╩" + "═".repeat(wDate) + "╩" + "═".repeat(wPrio) + "╩" + "═".repeat(wList) + "╩" + "═".repeat(wMsg) + "╝";

    console.log(chalk.blue(top));
    console.log(chalk.blue("║" + center("No", wNo) + "║" + center("Tanggal & Jam", wDate) + "║" + center("Prioritas", wPrio) + "║" + center("List", wList) + "║" + center("Pesan", wMsg) + "║"));
    console.log(chalk.blue(head));
    if (!data.length) {
        console.log("║" + center("-", wNo) + "║" + center("-", wDate) + "║" + center("-", wPrio) + "║" + center("-", wList) + "║" + center("-", wMsg) + "║");
    } else {
        data.forEach((r, i) => {
            console.log("║" + center(i + 1, wNo) + "║" + center(`${r.date} ${r.time}`, wDate) + "║" + center(r.priority?.toUpperCase() || "N/A", wPrio) + "║" + center(listName, wList) + "║" + center(r.message, wMsg) + "║");
            if (i !== data.length - 1) console.log(chalk.blue(head));
        });
    }
    console.log(chalk.blue(bot));
}

async function showAllReminders() {
  console.clear();
  console.log('\n📋 Semua Pengingat Tersimpan\n');
  showTable('TESNET', reminders.tesnet, 'TESNET');
  showTable('DEPIN', reminders.depin, 'DEPIN');
  await ask('Enter untuk kembali...');
}

async function deleteReminder() {
  console.clear();
  console.log('\n🗑️ Hapus Pengingat');
  const all = [
    ...reminders.tesnet.map((r, i) => ({ ...r, list: 'tesnet', index: i })),
    ...reminders.depin.map((r, i) => ({ ...r, list: 'depin', index: i }))
  ];
  if (all.length === 0) {
    console.log(chalk.red('Tidak ada pengingat untuk dihapus.'));
    await ask('Enter untuk kembali...');
    return;
  }
  all.forEach((r, i) => {
    console.log(`${i + 1}. [${r.list.toUpperCase()}] ${r.date} ${r.time} - ${r.message}`);
  });
  let num = 0;
  while (true) {
    const input = await ask('\nPilih nomor pengingat yang ingin dihapus (atau 0 untuk batal): ');
    num = parseInt(input, 10);
    if (input === '0') {
      console.log(chalk.yellow('Penghapusan dibatalkan.'));
      await ask('Enter untuk kembali...');
      return;
    }
    if (!isNaN(num) && num >= 1 && num <= all.length) {
      break;
    }
    console.log(chalk.red('❌ Pilihan tidak valid.'));
  }
  const selected = all[num - 1];
  reminders[selected.list].splice(selected.index, 1);
  saveReminders();
  scheduleAllReminders();
  console.log(chalk.green('\n✅ Pengingat berhasil dihapus dan jadwal diperbarui!'));
  await ask('Enter untuk kembali...');
}

async function emailSettings() {
    console.clear();
    console.log(chalk.cyan('\n⚙️ PENGATURAN AKUN EMAIL\n'));
    const currentConfig = emailSender.getEmailConfig();
    console.log('Konfigurasi saat ini:');
    console.log(`Email Pengirim: ${currentConfig.emailUser || 'Belum diatur'}`);
    console.log(`Email Penerima: ${currentConfig.recipientEmail || 'Belum diatur'}`);
    console.log(`SMTP Host: ${currentConfig.smtpHost || 'Belum diatur'}`);
    console.log(`SMTP Port: ${currentConfig.smtpPort || 'Belum diatur'}\n`);

    console.log(chalk.yellow('Masukkan konfigurasi baru (kosongkan untuk tidak mengubah):'));
    console.log(chalk.red('!!! PENTING: Gunakan App Password dari Gmail/penyedia lain, bukan password email utama !!!\n'));

    const emailUser = await ask(`Email Pengirim (saat ini: ${currentConfig.emailUser || 'kosong'}): `) || currentConfig.emailUser;
    const emailPass = await ask('App Password (kosongkan jika tidak ingin mengubah): ');
    const recipientEmail = await ask(`Email Penerima (saat ini: ${currentConfig.recipientEmail || 'kosong'}): `) || currentConfig.recipientEmail;
    const smtpHost = await ask(`SMTP Host (saat ini: ${currentConfig.smtpHost || 'kosong'}): `) || currentConfig.smtpHost;
    const smtpPort = await ask(`SMTP Port (saat ini: ${currentConfig.smtpPort || 'kosong'}): `) || currentConfig.smtpPort;

    const newConfig = {
        emailUser,
        recipientEmail,
        smtpHost,
        smtpPort: smtpPort ? parseInt(smtpPort, 10) : currentConfig.smtpPort,
        // Hanya perbarui password jika user memasukkan yang baru
        emailPass: emailPass || currentConfig.emailPass
    };

    emailSender.setEmailConfig(newConfig);
    emailSender.saveEmailConfig();
    console.log(chalk.green('\n✅ Pengaturan email berhasil disimpan!'));
    await ask('Enter untuk kembali...');
}

async function testEmail() {
  console.clear();
  console.log(chalk.cyan('\n📧 TES PENGIRIMAN EMAIL\n'));
  try {
    await emailSender.sendReminderEmail(
      'Test Email dari Airdrop Hunter',
      'Ini adalah email tes otomatis. Jika Anda menerima ini, berarti konfigurasi email Anda berhasil!',
      'Airdrop Hunter Reminder'
    );
    console.log(chalk.green('\n✅ Tes email berhasil dikirim! Silakan periksa kotak masuk Anda.'));
  } catch (error) {
    console.error(chalk.red('\n❌ Gagal mengirim email tes:', error.message));
    console.error(chalk.red('Pastikan konfigurasi email Anda benar dan "App Password" sudah diatur.'));
  }
  await ask('\nEnter untuk kembali...');
}

function center(text, width) {
  text = String(text || '');
  if (text.length >= width) return text.slice(0, width);
  const pad = width - text.length;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}

async function mainMenu() {
  while (true) {
    console.clear();
    banner();
    const wNo = 4, wMenu = 40;
    const top = "╔" + "═".repeat(wNo) + "╦" + "═".repeat(wMenu) + "╗";
    const head = "╠" + "═".repeat(wNo) + "╬" + "═".repeat(wMenu) + "╣";
    const bot = "╚" + "═".repeat(wNo) + "╩" + "═".repeat(wMenu) + "╝";

    console.log(chalk.magenta(top));
    console.log(chalk.magenta("║" + center("No", wNo) + "║" + center("Menu", wMenu) + "║"));
    console.log(chalk.magenta(head));
    console.log("║" + center("1", wNo) + "║" + center("TAMBAH PENGINGAT", wMenu) + "║");
    console.log(chalk.magenta(head));
    console.log("║" + center("2", wNo) + "║" + center("LIHAT SEMUA PENGINGAT", wMenu) + "║");
    console.log(chalk.magenta(head));
    console.log("║" + center("3", wNo) + "║" + center("HAPUS PENGINGAT", wMenu) + "║");
    console.log(chalk.magenta(head));
    console.log("║" + center("4", wNo) + "║" + center("PENGATURAN EMAIL", wMenu) + "║");
    console.log(chalk.magenta(head));
    console.log("║" + center("5", wNo) + "║" + center("TES PENGIRIMAN EMAIL", wMenu) + "║");
    console.log(chalk.magenta(head));
    console.log("║" + center("6", wNo) + "║" + center("KELUAR", wMenu) + "║");
    console.log(chalk.magenta(bot));

    const choice = await ask('\nPilih menu (1-6): ');

    switch (choice) {
      case '1': await playLoadingAnimation('Menuju Tambah Pengingat...'); await addReminder(); break;
      case '2': await playLoadingAnimation('Menampilkan Pengingat...'); await showAllReminders(); break;
      case '3': await playLoadingAnimation('Menuju Hapus Pengingat...'); await deleteReminder(); break;
      case '4': await playLoadingAnimation('Menuju Pengaturan Email...'); await emailSettings(); break;
      case '5': await playLoadingAnimation('Mengirim Tes Email...'); await testEmail(); break;
      case '6':
        console.log(chalk.green('\nTerima kasih telah menggunakan Airdrop Hunter Reminder! 👋'));
        rl.close();
        process.exit(0);
      default:
        console.log(chalk.red('\nPilihan tidak valid!'));
        await new Promise(r => setTimeout(r, 1500));
    }
  }
}

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

// Fungsi utama untuk menjalankan aplikasi
(async () => {
  console.clear();
  await playLoadingAnimation('Memulai program...');
  loadReminders();
  emailSender.loadEmailConfig();
  scheduleAllReminders();
  await login();
  mainMenu();
})();

rl.on('close', () => {
    console.log(chalk.yellow('\nAplikasi ditutup. Sampai jumpa!'));
    process.exit(0);
});
