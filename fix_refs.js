const fs = require("fs");
const path = require("path");

function walkDir(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walkDir(full));
    else if ([".ts", ".tsx"].includes(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const srcDir = path.join(__dirname, "src");
const files = walkDir(srcDir);
let total = 0;

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const updated = original.replace(/\.(jpg|jpeg)(?=['"\)\s])/gi, ".webp");
  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    const count = (original.match(/\.(jpg|jpeg)(?=['"\)\s])/gi) || []).length;
    total += count;
    console.log("Fixed: " + path.relative(__dirname, file) + " (" + count + " refs)");
  }
}
console.log("\nTotal fixed: " + total + " references");
