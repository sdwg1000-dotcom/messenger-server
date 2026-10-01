// Сигнальный сервер для Интернет-Мессенджера.
// Запуск:  node server.js
// Использует PORT из окружения (Render/Heroku задают его сам).
// Локально для теста:  PORT=9000 node server.js

const express = require('express');
const http = require('http');
const { ExpressPeerServer } = require('peer');

const app = express();
const port = process.env.PORT || 9000;

// trust proxy: на Render/Heroku приложение стоит за https-прокси,
// иначе клиентам придёт http вместо https и WebSocket не подключится.
app.set('trust proxy', true);

// Простой health-check для платформ хостинга и ручной проверки
app.get('/', (req, res) => res.send('Messenger signal server is running ✓'));
app.get('/health', (req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  debug: 1,        // вывод логов в консоль сервера (полезно на старте)
  allow_discovery: false,
});

// Все адреса вида https://<хост>/peerjs/* обслуживает PeerServer
app.use('/peerjs', peerServer);

server.listen(port, () => {
  console.log(`Сигнальный сервер запущен на порту ${port}`);
});