const fs = require('fs');
const path = require('path');

const musicDir = path.join(__dirname, 'public', 'music');
const prefix = '[SPOTDOWNLOADER.COM]';

fs.readdir(musicDir, (err, files) => {
  if (err) {
    console.error('Error reading music directory:', err);
    process.exit(1);
  }

  files.forEach((file) => {
    if (file.startsWith(prefix)) {
      const newName = file.replace(/^\[SPOTDOWNLOADER\.COM\]\s*/, '');
      const oldPath = path.join(musicDir, file);
      const newPath = path.join(musicDir, newName);
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(`Error renaming ${file}:`, err);
        } else {
          console.log(`Renamed: ${file} -> ${newName}`);
        }
      });
    }
  });
}); 