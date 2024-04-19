import express from 'express';
import dotenv from 'dotenv';
import chalk from 'chalk';
import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { handleIncomingMessage } from './messageHandler.js';
import pool from './database.js';
import userRoutes from './userRoutes.js';
import ignoredNumberRoutes from './ignoredNumberRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/ignoredNumbers', ignoredNumberRoutes);

// const client = new Client({
//   puppeteer: {
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//       devtools: true,  // Enable devtools to see Puppeteer actions in a non-headless mode
//   },
//   authStrategy: new LocalAuth(),
// });
const client = new Client({
      puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          devtools: true,  // Enable devtools to see Puppeteer actions in a non-headless mode
      },
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
  });

client.on('qr', qr => {
    console.log(chalk.green('QR RECEIVED'), qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log(chalk.green('Client is ready!'));
});

client.on('authenticated', () => {
    console.log(chalk.green('Client is authenticated!'));
});

client.on('auth_failure', msg => {
    console.error(chalk.red(`Auth failure: ${msg}`));
});

client.on('message', async msg => {
    if (!msg.fromMe) {
        try {
            const responseText = await handleIncomingMessage(msg);
            await client.sendMessage(msg.from, responseText);
        } catch (error) {
            console.error(chalk.red('Error in message handler:'), error);
        }
    }
});

client.initialize()
  .then(() => {
    console.log('WhatsApp client has been initialized.');
  })
  .catch(async (error) => {
    console.error('Error initializing WhatsApp client:', error.message);
    console.log('Attempting to reinitialize client...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds
    client.initialize().catch(err => console.error('Failed to reinitialize client:', err));
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
// import dotenv from 'dotenv';
// import express from 'express';
// import chalk from 'chalk';
// import qrcode from 'qrcode-terminal';
// import whatsappWeb from 'whatsapp-web.js';
// import { handleIncomingMessage } from './messageHandler.js';
// import pool from './database.js'; // Ensure it exports using ES Module syntax
// import userRoutes from './userRoutes.js';
// import ignoredNumberRoutes from './ignoredNumberRoutes.js';

// dotenv.config();

// const app = express();
// app.use(express.json()); // To parse JSON bodies

// // API routes for ignore list management and user authentication
// app.use('/api/users', userRoutes);
// app.use('/api/ignoredNumbers', ignoredNumberRoutes);

// app.get('/api/ignorelist', async (req, res) => {
//   try {
//     const [results] = await pool.query('SELECT phone_number FROM ignored_numbers');
//     res.json({ ignoredNumbers: results.map(row => row.phone_number) });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error retrieving ignore list' });
//   }
// });

// app.post('/api/ignorelist', async (req, res) => {
//   const { phone_number } = req.body;
//   try {
//     await pool.query('INSERT INTO ignored_numbers (phone_number) VALUES (?)', [phone_number]);
//     res.status(201).json({ message: 'Number added to ignore list' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error adding number to ignore list' });
//   }
// });

// app.delete('/api/ignorelist/:phone_number', async (req, res) => {
//   const { phone_number } = req.params;
//   try {
//     const [result] = await pool.query('DELETE FROM ignored_numbers WHERE phone_number = ?', [phone_number]);
//     if (result.affectedRows > 0) {
//       res.json({ message: 'Number removed from ignore list' });
//     } else {
//       res.status(404).json({ error: 'Number not found in ignore list' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error removing number from ignore list' });
//   }
// });

// const { Client, LocalAuth } = whatsappWeb;

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     restartOnAuthFail: true,
// });

// client.on('qr', (qr) => {
//     qrcode.generate(qr, { small: true });
// });

// client.on('ready', () => {
//     console.log(chalk.green('WhatsApp client ready!'));
// });

// client.on('message', async (message) => {
//     try {
//         const responseText = await handleIncomingMessage(message);
//         client.sendMessage(message.from, responseText);
//     } catch (error) {
//         console.error(chalk.red('Error:'), error);
//     }
// });

// client.initialize();

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });