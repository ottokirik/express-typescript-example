import express from 'express';

const port = 8000;
const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://127.0.0.1:${port}`);
});
