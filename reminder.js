const fs = require('fs');
const path = require('path');
const readline = require('readline');
const schedule = require('node-schedule');
const notifier = require('node-notifier');
const chalk = require('chalk');
const emailSender = require('./emailSender'); // Pastikan file ini ada dan berfungsi

const REMINDER_FILE = path.join(__dirname, 'reminders.json');
const SOUND_FILE = path.join(__dirname, 'alert.wav'); // Perlu diperhatikan penggunaan file suara ini

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

async function animeLoginLoading(message = 'Memeriksa identitas...', duration = 4000) {
  const frames = [
    `
         .-''''-.
       .'  \\  /  '.
      /   O      O  \\
     :                :
     |                |
     :   .------.     :
      \\ '        '   /
       '.          .'
         '-......-'
        /|\\    /|\\
       / | \\  / | \\
    `,
    `
         .-''''-.
       .'  \\  /  '.
      /   o      o  \\
     :                :
     |    .------.    |
     :   '        '   :
      \\   .----.     /
       '.          .'
         '-......-'
        /|\\    /|\\
       / | \\  / | \\
    `,
    `
         .-''''-.
       .'  \\  /  '.
      /   O      O  \\
     :                :
     |     .----.     |
     :   '        '   :
      \\   .----.     /
       '.          .'
         '-......-'
        /|\\    /|\\
       / | \\  / | \\
    `
  ];

  const colors = [chalk.red, chalk.yellow, chalk.green, chalk.cyan, chalk.blue, chalk.magenta];
  const interval = 300;
  const totalFrames = Math.floor(duration / interval);

  for (let i = 0; i < totalFrames; i++) {
    console.clear();
    const color = colors[i % colors.length];
    console.log(color(frames[i % frames.length]));
    console.log(chalk.whiteBright(message));
    await new Promise(r => setTimeout(r, interval));
  }
  console.clear();
}

async function animeHackerLoading(message = 'Memulai program...', duration = 3000) {
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

async function animeVolumeMenuLoading(message = 'Loading...', duration = 3000) {
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
  let username = '', password = '';
  while (true) {
    console.clear();
    banner();

    console.log(chalk.red('\nSELAMAT DATANG AIRDROP HUNTER '));
    console.log(chalk.red('SILAHKAN LOGIN UNTUK MELANJUTKAN.\n'));

    username = await ask('USERNAME: ');
    password = await ask('PASSWORD: ');
    await animeLoginLoading();

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
  if (fs.existsSync(REMINDER_FILE)) {
    reminders = JSON.parse(fs.readFileSync(REMINDER_FILE, 'utf-8'));
  }
}

function saveReminders() {
  fs.writeFileSync(REMINDER_FILE, JSON.stringify(reminders, null, 2));
}


function scheduleReminder(list, reminder) {
  const dateObj = new Date(`${reminder.date}T${reminder.time}:00`);
  
  // Hanya jadwalkan jika tanggal/waktu pengingat ada di masa depan
  if (dateObj < new Date()) {
    // console.log(chalk.gray(`[INFO] Melewatkan pengingat lama: ${reminder.message}`)); // Opsional: Untuk debug
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
    
    // Notifikasi Desktop Otomatis
    notifier.notify({
      title: `${reminder.type.toUpperCase()} [${list.toUpperCase()}]`,
      message: reminder.message,
      sound: true 
    });

    // Notifikasi Email Otomatis
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
  schedule.gracefulShutdown(); // Hentikan semua jadwal yang ada untuk menghindari duplikasi
  Object.entries(reminders).forEach(([list, items]) => {
    items.forEach(reminder => scheduleReminder(list, reminder));
  });
  console.log(chalk.cyan('🚀 Semua pengingat telah dijadwalkan ulang.'));
}

async function addReminder() {
  console.clear();
  console.log('\n📋 Tambah Pengingat Baru'); // Nama menu yang lebih baik
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
    console.log(chalk.yellow(`Tanggal otomatis diisi: ${date} (Untuk pengingat umum, biasanya hari ini)`));
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
  const wNo=4,wDate=17,wPrio=10,wList=8,wMsg=30;
  const top="╔"+"═".repeat(wNo)+"╦"+"═".repeat(wDate)+"╦"+"═".repeat(wPrio)+"╦"+"═".repeat(wList)+"╦"+"═".repeat(wMsg)+"╗";
  const head="╠"+"═".repeat(wNo)+"╬"+"═".repeat(wDate)+"╬"+"═".repeat(wPrio)+"╬"+"═".repeat(wList)+"╬"+"═".repeat(wMsg)+"╣";
  const bot="╚"+"═".repeat(wNo)+"╩"+"═".repeat(wDate)+"╩"+"═".repeat(wPrio)+"╩"+"═".repeat(wList)+"╩"+"═".repeat(wMsg)+"╝";

  console.log(chalk.blue(top));
  console.log(chalk.blue("║"+center("No",wNo)+"║"+center("Tanggal & Jam",wDate)+"║"+center("Prioritas",wPrio)+"║"+center("List",wList)+"║"+center("Pesan",wMsg)+"║"));
  console.log(chalk.blue(head));
  if (!data.length) {
    console.log("║"+center("-",wNo)+"║"+center("-",wDate)+"║"+center("-",wPrio)+"║"+center("-",wList)+"║"+center("-",wMsg)+"║");
  } else {
    data.forEach((r,i)=>{
      console.log("║"+center(i+1,wNo)+"║"+center(`${r.date} ${r.time}`,wDate)+"║"+center(r.priority?.toUpperCase()||"N/A",wPrio)+"║"+center(listName,wList)+"║"+center(r.message,wMsg)+"║");
      if(i!==data.length-1)console.log(chalk.blue(head));
    });
  }
  console.log(chalk.blue(bot));
}

async function showAllReminders() {
  console.clear();
  console.log('\n📋 Semua Pengingat Tersimpan\n'); 
  showTable('TESNET', reminders.tesnet, 'TESNET');
  showTable('DEPIN', reminders.depin, 'DEPIN');

  const all=[
    ...reminders.tesnet.map(r=>({...r,list:'tesnet'})),
    ...reminders.depin.map(r=>({...r,list:'depin'}))
  ];

  const listings = all.filter(r=>r.type==='listing');
  const basics = all.filter(r=>r.type==='reminder');

  console.log('\n📅 Jadwal Listing (Otomatis Dinotifikasi):');
  if(!listings.length){
    console.log(chalk.red('Tidak ada jadwal listing.'));
  }else{
    listings.forEach((r,i)=>console.log(`${i+1}. ${r.date} ${r.time} [${r.list.toUpperCase()}] ${r.message}`));
  }

  console.log('\n🔔 Pengingat Umum (Otomatis Dinotifikasi):');
  if(!basics.length){
    console.log(chalk.red('Tidak ada pengingat umum.'));
  }else{
    basics.forEach((r,i)=>console.log(`${i+1}. ${r.date} ${r.time} [${r.list.toUpperCase()}] ${r.message}`));
  }

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
  while (num < 1 || num > all.length) {
    num = parseInt(await ask('\nPilih nomor pengingat yang ingin dihapus: '), 10);
    if (isNaN(num) || num < 1 || num > all.length) {
      console.log(chalk.red('❌ Pilihan tidak valid.'));
    }
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
  console.log(`SMTP Port: ${currentConfig.smtpPort || 'Belum diatur'}`);
  console.log(`Koneksi Aman: ${currentConfig.secure ? 'Ya' : 'Tidak'}\n`);

  console.log(chalk.yellow('Masukkan konfigurasi baru (kosongkan untuk tidak mengubah):'));
  console.log(chalk.red('!!! PENTING: Gunakan App Password, bukan password email utama !!!\n'));

  const emailUser = await ask('Email Pengirim: ');
  const emailPass = await ask('App Password: ');
  const recipientEmail = await ask('Email Penerima: ');
  const smtpHost = await ask('SMTP Host (e.g., smtp.gmail.com): ');
  const smtpPort = parseInt(await ask('SMTP Port (587 untuk TLS, 465 untuk SSL): '));
  const secure = (await ask('Gunakan koneksi aman? (y/n): ')).toLowerCase() === 'y';

  const config = {
    emailUser: emailUser || currentConfig.emailUser,
    emailPass: emailPass || currentConfig.emailPass,
    recipientEmail: recipientEmail || currentConfig.recipientEmail,
    smtpHost: smtpHost || currentConfig.smtpHost,
    smtpPort: smtpPort || currentConfig.smtpPort,
    secure
  };

  emailSender.setEmailConfig(config);
  emailSender.saveEmailConfig();

  console.log(chalk.green('\n✅ Pengaturan email berhasil disimpan!'));
  await ask('Enter untuk kembali...');
}

async function testEmail() {
  console.clear();
  console.log(chalk.cyan('\n📧 TES PENGIRIMAN EMAIL\n')); 

  try {
    await emailSender.sendReminderEmail(
      'Test Email dari Airdrop Independen',
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
    console.log("║" + center("1", wNo) + "║" + center("TAMBAH PENGINGAT BARU", wMenu) + "║"); // Nama baru
    console.log(chalk.magenta(head));
    console.log("║" + center("2", wNo) + "║" + center("LIHAT SEMUA PENGINGAT", wMenu) + "║"); // Nama baru
    console.log(chalk.magenta(head));
    console.log("║" + center("3", wNo) + "║" + center("HAPUS PENGINGAT", wMenu) + "║"); // Nama baru
    console.log(chalk.magenta(head));
    console.log("║" + center("4", wNo) + "║" + center("PENGATURAN AKUN EMAIL", wMenu) + "║"); // Nama baru
    console.log(chalk.magenta(head));
    console.log("║" + center("5", wNo) + "║" + center("TES PENGIRIMAN EMAIL", wMenu) + "║"); // Nama baru
    console.log(chalk.magenta(head));
    console.log("║" + center("6", wNo) + "║" + center("KELUAR", wMenu) + "║"); // Nama baru
    console.log(chalk.magenta(bot));

    const choice = await ask('\nPilih menu (1-6): ');

    switch (choice) {
      case '1':
        await animeVolumeMenuLoading('Menuju Tambah Pengingat...');
        await addReminder();
        break;
      case '2':
        await animeVolumeMenuLoading('Menampilkan Pengingat...');
        await showAllReminders();
        break;
      case '3':
        await animeVolumeMenuLoading('Menuju Hapus Pengingat...');
        await deleteReminder();
        break;
      case '4':
        await animeVolumeMenuLoading('Menuju Pengaturan Email...');
        await emailSettings();
        break;
      case '5':
        await animeVolumeMenuLoading('Mengirim Tes Email...');
        await testEmail();
        break;
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

(async () => {
  console.clear();
  await animeHackerLoading('Memulai program dan menjadwalkan pengingat otomatis...');
  loadReminders(); 
  emailSender.loadEmailConfig(); 
  scheduleAllReminders(); 
  await login();
  mainMenu();
})();
