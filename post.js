const fs = require('fs');
const cwd = process.cwd();

const executePost = () => {
  fs.copyFile(`${cwd}/temp.app.json`, `${cwd}/app.json`, err => {
    if (err) throw new Error('error copying temp file');
    fs.unlink(`${cwd}/temp.app.json`, err2 => {
      if (err2) throw new Error('error deleting temp file');
    });
  });
};

module.exports = {
  executePost
};
