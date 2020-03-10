#!/usr/bin/env node

const fs = require("fs");
const argv = process.argv.splice(2);
const exec = require("child_process").exec;
const path = require("path");
const pwd = (...args) => path.resolve(process.cwd(), ...args);

// 运行本地命令
const bash = code => {
  return new Promise(res => {
    exec(code, (err, stdout, stderr) => {
      console.log(stdout, stderr);
      if (err) {
        throw err;
      }
      res(stdout);
    });
  });
};

const hash = Date.now().toString(32);
const app = argv[0] || "main";

const start = async () => {
  const files = fs.readdirSync(pwd("build/web"));

  files.forEach(f => {
    if (f.indexOf(".js") > -1) {
      fs.unlinkSync(pwd("build/web/" + f));
    }
  });

  const code = "flutter build web " + argv.join();
  console.log(code);
  await bash(code);

  fs.renameSync(
    pwd("build/web/main.dart.js"),
    pwd(`build/web/${app}_${hash}.js`)
  );
  fs.renameSync(
    pwd("build/web/main.dart.js.map"),
    pwd(`build/web/${app}_${hash}.js.map`)
  );
  let file = fs.readFileSync(pwd("build/web/index.html")).toString();
  file = file.replace("main.dart.js", `${app}_${hash}.js`);
  fs.writeFileSync(pwd("build/web/index.html"), file);
  console.log("flutter build web done!");
};

start();
