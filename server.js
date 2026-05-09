import { createApp } from './dist-server/app.js';
import { getEnv } from './dist-server/config/env.js';

const app = createApp();

// Add the requested health endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'Moonscents API Running'
  });
});

const env = getEnv();
const PORT = process.env.PORT || env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on ${PORT}`);
});
