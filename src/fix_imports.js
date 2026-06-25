const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'screens');

function fixImports(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'report') {
        fixImports(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Fix assets, components, constants, store
      content = content.replace(/from\s+['"]\.\.\/(assets|components|constants|store)\//g, "from '../../$1/");
      content = content.replace(/from\s+['"]\.\.\/(assets|components|constants|store)['"]/g, "from '../../$1'");

      // Also fix imports like import DoodyLogo from '../assets/doodyLogo.png'
      content = content.replace(/import\s+(.*?)\s+from\s+['"]\.\.\/(assets|components|constants|store)(.*?)['"]/g, "import $1 from '../../$2$3'");

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

fixImports(screensDir);
