const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const EMAIL_CONFIG_FILE = path.join(__dirname, 'emailConfig.json');

let emailConfig = {};
let transporter = null;

function loadEmailConfig() {
  if (fs.existsSync(EMAIL_CONFIG_FILE)) {
    try {
      emailConfig = JSON.parse(fs.readFileSync(EMAIL_CONFIG_FILE, 'utf-8'));
      createTransporter();
      return true;
    } catch (error) {
      console.error(chalk.red(`Error loading email config: ${error.message}`));
      emailConfig = {};
      return false;
    }
  }
  return false;
}

function saveEmailConfig() {
  fs.writeFileSync(EMAIL_CONFIG_FILE, JSON.stringify(emailConfig, null, 2));
  console.log(chalk.green('Konfigurasi email berhasil disimpan ke emailConfig.json'));
}

function createTransporter() {
  if (emailConfig.smtpHost && emailConfig.emailUser && emailConfig.emailPass) {
    try {
      transporter = nodemailer.createTransport({
        host: emailConfig.smtpHost,
        port: emailConfig.smtpPort || 587,
        secure: emailConfig.secure,
        auth: {
          user: emailConfig.emailUser,
          pass: emailConfig.emailPass,
        },
      });
    } catch (error) {
      console.error(chalk.red(`Error creating email transporter: ${error.message}`));
      transporter = null;
    }
  } else {
    transporter = null;
  }
}

async function sendReminderEmail(subject, message, fromName = 'AIRDROP INDEPENDEN') {
  if (!transporter) {
    throw new Error('Email transporter belum dikonfigurasi');
  }

  try {
    await transporter.sendMail({
      from: `"${fromName} " <${emailConfig.emailUser}>`,
      to: emailConfig.recipientEmail,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2196F3;">🚀 Airdrop Independen Indonesia</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Email ini dikirim otomatis oleh Airdrop Independen Community
          </p>
        </div>
      `,
    });
  } catch (error) {
    throw new Error(`Gagal mengirim email: ${error.message}`);
  }
}

function getEmailConfig() {
  return { ...emailConfig };
}

function setEmailConfig(config) {
  emailConfig = config;
  createTransporter();
}

module.exports = {
  loadEmailConfig,
  saveEmailConfig,
  sendReminderEmail,
  getEmailConfig,
  setEmailConfig,
};
