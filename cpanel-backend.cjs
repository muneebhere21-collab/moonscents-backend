// cPanel Passenger requires a CommonJS entry point.
// This wrapper dynamically imports the ES Module server.js
async function start() {
  try {
    await import('./server.js');
  } catch (err) {
    console.error('Failed to start backend ESM module:', err);
  }
}

start();
