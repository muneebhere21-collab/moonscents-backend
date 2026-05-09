// cPanel Passenger requires a CommonJS entry point.
// This wrapper dynamically imports the ES Module app.js
async function start() {
  try {
    await import('./app.js');
  } catch (err) {
    console.error('Failed to start frontend ESM module:', err);
  }
}

start();
