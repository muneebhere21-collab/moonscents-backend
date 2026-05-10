import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { createApp } = require('./dist-server/app.js');
const { getEnv } = require('./dist-server/config/env.js');

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
