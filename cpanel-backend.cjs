try {
  require('./dist-bundle/app.js');
} catch (err) {
  console.error('Failed to start backend CJS module:', err);
}
