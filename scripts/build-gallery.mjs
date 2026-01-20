import fs from "fs";
import path from "path";

const root = process.cwd();
const galleryDir = path.join(root, "assets", "img", "gallery");
const outPath = path.join(root, "content", "gallery.json");

const isImage = (name) => /\.(png|jpe?g|webp|gif)$/i.test(name);

const toTitle = (filename) => {
  const base = filename.replace(/\.[^.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
};

// filename convention: "category__title__desc.jpg"
// examples:
// wainscoting__living-room__two-tone.webp
// crown__kitchen__tall-ceilings.jpg
const parseMeta = (filename) => {
  const base = filename.replace(/\.[^.]+$/, "");
  const parts = base.split("__").map(s => s.trim()).filter(Boolean);

  const category = (parts[0] || "other").toLowerCase();
  const title = parts[1] ? toTitle(parts[1]) : toTitle(base);
  const desc = parts[2] ? toTitle(parts[2]) : "";

  return { category, title, desc };
};

if (!fs.existsSync(galleryDir)) {
  console.error("Gallery folder not found:", galleryDir);
  process.exit(1);
}

const files = fs.readdirSync(galleryDir)
  .filter(isImage)
  .filter(f => !f.startsWith("."))
  .sort((a,b) => a.localeCompare(b, "en"));

const items = files.map((file) => {
  const meta = parseMeta(file);
  return {
    title: meta.title,
    desc: meta.desc,
    category: meta.category,
    image: `assets/img/gallery/${file}`
  };
});

const categoriesMap = new Map();
categoriesMap.set("all", "All");
for (const it of items) {
  if (!categoriesMap.has(it.category)) {
    categoriesMap.set(it.category, toTitle(it.category));
  }
}

const payload = {
  items,
  categories: Array.from(categoriesMap.entries()).map(([key, label]) => ({ key, label }))
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

console.log(`Generated ${outPath} with ${items.length} images.`);
