import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());

app.use(
  '/assets',
  express.static(path.join(__dirname, 'dist/client/assets'))
);

app.use(express.static(path.join(__dirname, 'dist/client')));

let serverModule;
try {
  serverModule = await import('./dist/server/index.js');
} catch (e) {
  try {
    const files = fs.readdirSync(path.join(__dirname, 'dist/server/assets'));
    const workerFile = files.find(f => f.startsWith('worker-entry'));
    if (workerFile) {
      console.warn('Falling back to worker entry:', workerFile);
      serverModule = await import(`./dist/server/assets/${workerFile}`);
    } else {
      throw e;
    }
  } catch(err) {
    console.error('Failed to load SSR server', err);
  }
}

// Adapter to run Cloudflare Fetch Handler in Express
app.use(async (req, res, next) => {
  if (serverModule && serverModule.default && typeof serverModule.default.fetch === 'function') {
    try {
      const url = new URL(req.originalUrl || req.url, `http://${req.headers.host || 'localhost'}`);
      
      const headers = new Headers();
      for (const key in req.headers) {
        if (req.headers[key] !== undefined) {
          headers.append(key, Array.isArray(req.headers[key]) ? req.headers[key].join(',') : req.headers[key]);
        }
      }

      const requestInit = {
        method: req.method,
        headers,
      };

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        // Native Node 18+ fetch requires duplex: 'half' for streams
        requestInit.body = req;
        requestInit.duplex = 'half';
      }

      const fetchReq = new Request(url, requestInit);
      
      // Call the Cloudflare worker fetch handler
      const fetchRes = await serverModule.default.fetch(fetchReq, process.env, { 
        waitUntil: () => {}, 
        passThroughOnException: () => {} 
      });

      res.status(fetchRes.status);
      fetchRes.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (fetchRes.body) {
        const reader = fetchRes.body.getReader();
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        await pump();
      } else {
        res.end();
      }
    } catch (err) {
      next(err);
    }
  } else if (serverModule && (serverModule.default || serverModule.handler)) {
     // Fallback if it somehow exported an Express middleware
     const middleware = serverModule.default || serverModule.handler || serverModule;
     if (typeof middleware === 'function') {
         middleware(req, res, next);
     } else {
         next();
     }
  } else {
    next();
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Moonscents Frontend running on port ${PORT}`);
});
