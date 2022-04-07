#!/usr/bin/env node

const fs = require("fs");
const argv = process.argv.splice(2);
const exec = require("child_process").exec;
const path = require("path");
const crypto = require("crypto");
const pwd = (...args) => path.resolve(process.cwd(), ...args);

// 运行本地命令
const bash = (code) => {
  return new Promise((res) => {
    exec(code, (err, stdout, stderr) => {
      console.log(stdout, stderr);
      if (err) {
        throw err;
      }
      res(stdout);
    });
  });
};

const jsPath = pwd("build/web/main.dart.js");

function changeFileDetail(url, hash) {
  let file = fs.readFileSync(pwd(url)).toString();
  file = file.replace(/(main\.dart\.js)/g, `main_${hash}.js`);
  fs.writeFileSync(pwd(url), file);
}

const start = async () => {
  const files = fs.readdirSync(pwd("build/web"));

  files.forEach((f) => {
    if (f.indexOf(".js") > -1) {
      fs.unlinkSync(pwd("build/web/" + f));
    }
  });

  if (argv[0] == "build") {
    const code = "flutter build web " + argv.slice(1).join();
    console.log(code);
    await bash(code);
  }

  if (!fs.existsSync(jsPath)) {
    console.log("Not found build/web/main.dart.js, flutter build web first!!");
    process.exit(0);
  }

  let mainString = fs.readFileSync(jsPath).toString();
  const hash = crypto
    .createHash("md5")
    .update(mainString)
    .digest("hex")
    .slice(0, 8);

  console.log("loaded main.dart.js...");

  fs.renameSync(jsPath, pwd(`build/web/main_${hash}.js`));
  changeFileDetail("build/web/index.html", hash);
  changeFileDetail("build/web/flutter_service_worker.js", hash);
  console.log("flutter build web done!");
};

start();
