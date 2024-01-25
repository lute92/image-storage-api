import express from 'express';
import routes from './routes';

const app = express();
const PORT = 4600;

app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Image storage server is running on http://localhost:${PORT}`);
});
