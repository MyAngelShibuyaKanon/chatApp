import express from 'express';

const app = express();
const port = 8727;

app.get('/', (req, res) => {
  res.send('Hello, world!');
})


app.listen(port);
