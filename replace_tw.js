const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let changed = 0;

files.forEach(file => {
  // skip the tailwind.ts file itself
  if (file.includes('utils\\tailwind.ts') || file.includes('utils/tailwind.ts')) return;

  let content = fs.readFileSync(file, 'utf8');
  
  // Regex to match "import tw from 'twrnc';" with variations in spacing
  const regex = /import\s+tw\s+from\s+['"]twrnc['"]\s*;/g;
  
  if (regex.test(content)) {
    // calculate relative path from the current file to src/utils/tailwind.ts
    const dir = path.dirname(file);
    let relPath = path.relative(dir, './src/utils/tailwind').replace(/\\/g, '/');
    if (!relPath.startsWith('.')) {
      relPath = './' + relPath;
    }
    
    content = content.replace(regex, `import tw from '${relPath}';`);
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Successfully updated ${changed} files.`);
