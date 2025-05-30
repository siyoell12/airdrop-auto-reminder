const fs = require('fs');
const path = require('path');
const readline = require('readline');
const schedule = require('node-schedule');
const notifier = require('node-notifier');
const chalk = require('chalk');

const REMINDER_FILE = path.join(__dirname, 'reminders.json');
const SOUND_FILE = path.join(__dirname, 'alert.wav');

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
  fs.writeFileSync(REMINDER_FILE, JSON.stringify(reminders, null, 2), 'utf-8');
}

function scheduleAllReminders() {
  schedule.gracefulShutdown();
  Object.keys(reminders).forEach(list => {
    reminders[list].forEach(r => scheduleReminder(list, r));
  });
}

function scheduleReminder(list, reminder) {
  const dateObj = new Date(`${reminder.date}T${reminder.time}:00`);
  if (dateObj < new Date()) return;
  schedule.scheduleJob(dateObj, () => {
    console.clear();
    console.log(`\n🔔 [${list.toUpperCase()}] ${reminder.date} ${reminder.time} - ${reminder.message}`);
    notifier.notify({
      title: `Pengingat [${list}]`,
      message: reminder.message,
      sound: SOUND_FILE
    });
  });
}

function center(text, width) {
  text = String(text || '');
  if (text.length >= width) return text.slice(0, width);
  const pad = width - text.length;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
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
  console.log('\n📋 Semua Pengingat\n');
  showTable('TESNET', reminders.tesnet, 'TESNET');
  showTable('DEPIN', reminders.depin, 'DEPIN');

  const all=[
    ...reminders.tesnet.map(r=>({...r,list:'tesnet'})),
    ...reminders.depin.map(r=>({...r,list:'depin'}))
  ];

  const listings = all.filter(r=>r.type==='listing');
  const basics = all.filter(r=>r.type==='reminder');

  console.log('\n📅 Jadwal Listing:');
  if(!listings.length){
    console.log(chalk.red('Tidak ada jadwal listing.'));
  }else{
    listings.forEach((r,i)=>console.log(`${i+1}. ${r.date} ${r.time} [${r.list.toUpperCase()}] ${r.message}`));
  }

  console.log('\n🔔 Pengingat Biasa:');
  if(!basics.length){
    console.log(chalk.red('Tidak ada pengingat biasa.'));
  }else{
    basics.forEach((r,i)=>console.log(`${i+1}. ${r.date} ${r.time} [${r.list.toUpperCase()}] ${r.message}`));
  }

  await ask('Enter untuk kembali...');
}

async function addReminder() {
  console.clear();
  console.log('\n📋 Tambah Pengingat');
  let list='';
  while(!['tesnet','depin'].includes(list))list=(await ask('List (tesnet/depin): ')).trim().toLowerCase();

  let type='';
  while(!['listing','reminder'].includes(type))type=(await ask('Tipe (listing/reminder): ')).trim().toLowerCase();

  let date='';
  if(type==='listing'){
    do {
      date = (await ask('Tanggal (YYYY-MM-DD): ')).trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.log(chalk.red('❌ Format tanggal salah. Contoh: 2025-12-31'));
        date = '';
      }
    } while (!date);
  }else{
    const now = new Date();
    date = now.toISOString().split('T')[0];
    console.log(chalk.yellow(`Tanggal otomatis diisi: ${date}`));
  }

  let time='';
  do {
    time = (await ask('Jam (HH:mm): ')).trim();
    if (!/^\d{2}:\d{2}$/.test(time)) {
      console.log(chalk.red('❌ Format jam salah. Contoh: 09:30'));
      time = '';
    }
  } while (!time);

  const msg=await ask('Pesan: ');
  let prio='';
  while(!['rendah','sedang','tinggi'].includes(prio))prio=(await ask('Prioritas (rendah/sedang/tinggi): ')).trim().toLowerCase();
  const r={date,time,message:msg,priority:prio,type};
  reminders[list].push(r);
  saveReminders();
  scheduleAllReminders();
  console.log(chalk.green('✅ Pengingat dibuat!'));
  await ask('Enter untuk kembali...');
}

async function editReminder() {
  console.clear();
  console.log('\n🔧 Edit Pengingat');

  const all = [
    ...reminders.tesnet.map((r, i) => ({ ...r, list: 'tesnet', index: i })),
    ...reminders.depin.map((r, i) => ({ ...r, list: 'depin', index: i }))
  ];

  if (all.length === 0) {
    console.log(chalk.red('Tidak ada pengingat untuk diedit.'));
    await ask('Enter untuk kembali...');
    return;
  }

  all.forEach((r, i) => {
    console.log(`${i + 1}. [${r.list.toUpperCase()}] ${r.date} ${r.time} - ${r.message}`);
  });

  let num = 0;
  while (num < 1 || num > all.length) {
    num = parseInt(await ask('\nPilih nomor pengingat yang ingin diedit: '), 10);
    if (isNaN(num) || num < 1 || num > all.length) {
      console.log(chalk.red('❌ Pilihan tidak valid.'));
    }
  }

  const selected = all[num - 1];

  console.log(chalk.yellow(`\nEdit pengingat: [${selected.list.toUpperCase()}] ${selected.date} ${selected.time} - ${selected.message}`));

  const newDate = await ask(`Tanggal baru (YYYY-MM-DD, kosong untuk tidak diubah): `);
  const newTime = await ask(`Jam baru (HH:mm, kosong untuk tidak diubah): `);
  const newMsg = await ask(`Pesan baru (kosong untuk tidak diubah): `);
  let newPrio = '';
  while (newPrio !== '' && !['rendah', 'sedang', 'tinggi'].includes(newPrio)) {
    newPrio = (await ask('Prioritas baru (rendah/sedang/tinggi, kosong untuk tidak diubah): ')).trim().toLowerCase();
    if (newPrio !== '' && !['rendah', 'sedang', 'tinggi'].includes(newPrio)) {
      console.log(chalk.red('❌ Pilihan prioritas tidak valid.'));
    }
  }

  if (newDate) selected.date = newDate;
  if (newTime) selected.time = newTime;
  if (newMsg) selected.message = newMsg;
  if (newPrio) selected.priority = newPrio;

  reminders[selected.list][selected.index] = selected;
  saveReminders();
  scheduleAllReminders();

  console.log(chalk.green('\n✅ Pengingat berhasil diperbarui!'));
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

  console.log(chalk.green('\n✅ Pengingat berhasil dihapus!'));
  await ask('Enter untuk kembali...');
}

async function ask(q) {
  return new Promise(r => rl.question(q, r));
}

async function mainMenu() {
  while (true) {
    console.clear();
    console.log(chalk.cyanBright('\n\n'));

    const wNo = 4, wMenu = 40;
    const top = "╔" + "═".repeat(wNo) + "╦" + "═".repeat(wMenu) + "╗";
    const head = "╠" + "═".repeat(wNo) + "╬" + "═".repeat(wMenu) + "╣";
    const bot = "╚" + "═".repeat(wNo) + "╩" + "═".repeat(wMenu) + "╝";

    console.log(chalk.magenta(top));
    console.log(chalk.magenta("║" + center("No", wNo) + "║" + center("Menu", wMenu) + "║"));
    console.log(chalk.magenta(head));
    console.log("║" + center("1", wNo) + "║" + center("Tambah Pengingat", wMenu) + "║");
    console.log(chalk.magenta(head));
    console.log("║" + center("2", wNo) + "║" + center("Lihat Semua Pengingat", wMenu) + "║");
    console.log(chalk.magenta(head));
    console.log("║" + center("3", wNo) + "║" + center("Edit Pengingat", wMenu) + "║");
    console.log(chalk.magenta(head));
    console.log("║" + center("4", wNo) + "║" + center("Hapus Pengingat", wMenu) + "║");
    console.log(chalk.magenta(head));
    console.log("║" + center("5", wNo) + "║" + center("Keluar", wMenu) + "║");
    console.log(chalk.magenta(bot));

    const c = await ask('Pilih menu (1-5): ');
    if (c === '1') {
      await animeVolumeMenuLoading('Menuju Tambah Pengingat...');
      await addReminder();
    } else if (c === '2') {
      await animeVolumeMenuLoading('Menampilkan Pengingat...');
      await showAllReminders();
    } else if (c === '3') {
      await animeVolumeMenuLoading('Menuju Edit...');
      await editReminder();
    } else if (c === '4') {
      await animeVolumeMenuLoading('Menuju Hapus...');
      await deleteReminder();
    } else if (c === '5') {
      console.log(chalk.green('Sampai jumpa!'));
      rl.close();
      process.exit(0);
    } else {
      console.log(chalk.red('❌ Pilihan tidak valid.'));
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}


(async()=>{
  await animeHackerLoading('Memulai program...');
  loadReminders();
  scheduleAllReminders();
  await login();
  mainMenu();
})();
