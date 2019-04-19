const fs = require('fs');
const cwd = process.cwd();

const appJson = require(`${cwd}/app.json`);

const readAndParsEnv = environment =>
  new Promise((resolve, reject) => {
    fs.readFile(
      `${cwd}/.env${environment ? `.${environment}` : ''}`,
      (err, data) => {
        if (err) return reject();
        const envVars = data.toString('utf-8').split('\n');
        return resolve(envVars);
      }
    );
  });

const copyExistingAppJson = () =>
  new Promise((resolve, reject) => {
    fs.copyFile(`${cwd}/app.json`, `${cwd}/temp.app.json`, err => {
      if (err) return reject(err);
      return resolve();
    });
  });

const resolveVar = (obj, restKeys, value) => {
  if (!obj && restKeys.length) {
    const newObj = {};
    const first = restKeys.shift();
    newObj[first] = resolveVar(newObj[first], restKeys, value);
    return newObj;
  } else if (obj && restKeys.length) {
    const first = restKeys.shift();
    obj[first] = resolveVar(obj[first], restKeys, value);
    return obj;
  } else {
    return value;
  }
};

const mergeEnvInApp = envVars =>
  new Promise((resolve, reject) => {
    const newAppJson = {
      ...appJson
    };
    envVars.forEach(envVar => {
      const splitted = envVar.split('=');
      if (splitted[0].includes('.')) {
        const keys = splitted[0].split('.');
        const first = keys.shift();
        newAppJson.expo[first] = resolveVar(
          newAppJson.expo[first],
          keys,
          splitted[1]
        );
      } else {
        newAppJson.expo[splitted[0]] = splitted[1];
      }
    });
    fs.writeFile(
      `${cwd}/app.json`,
      JSON.stringify(newAppJson),
      'utf-8',
      err => {
        if (err) return reject(err);
        return resolve();
      }
    );
  });

const executePre = async env => {
  try {
    console.log(env);
    await copyExistingAppJson();
    const envVars = await readAndParsEnv(env);
    await mergeEnvInApp(envVars);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  executePre
};
