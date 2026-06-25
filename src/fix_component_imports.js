const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname);

// Map of old import path patterns -> new import path patterns
// These are matched as literal substrings (without quotes)
const remaps = [
  // Mission components
  { from: /from ['"]([.\/]*)\.\.\/components\/MissionCard['"]/g,       to: (m, p) => `from '${p}../components/mission/MissionCard'` },
  { from: /from ['"]([.\/]*)\.\.\/components\/MissionDetailModal['"]/g, to: (m, p) => `from '${p}../components/mission/MissionDetailModal'` },
  { from: /from ['"]([.\/]*)\.\.\/components\/MissionSuccessModal['"]/g,to: (m, p) => `from '${p}../components/mission/MissionSuccessModal'` },
  { from: /from ['"]([.\/]*)\.\.\/components\/MissionSwapModal['"]/g,   to: (m, p) => `from '${p}../components/mission/MissionSwapModal'` },
  // Home components
  { from: /from ['"]([.\/]*)\.\.\/components\/MorningSuccessModal['"]/g,to: (m, p) => `from '${p}../components/home/MorningSuccessModal'` },
  { from: /from ['"]([.\/]*)\.\.\/components\/NightSuccessModal['"]/g,  to: (m, p) => `from '${p}../components/home/NightSuccessModal'` },
  // Onboarding components
  { from: /from ['"]([.\/]*)\.\.\/components\/OnboardingSummaryCard['"]/g, to: (m, p) => `from '${p}../components/onboarding/OnboardingSummaryCard'` },
  // Report components
  { from: /from ['"]([.\/]*)\.\.\/components\/TimelineRecords['"]/g,    to: (m, p) => `from '${p}../components/report/TimelineRecords'` },
  
  // Also fix imports inside HomeScreen.tsx (which uses ../../components/...)
  { from: /from '\.\.\/\.\.\/components\/MissionCard'/g,       to: `from '../../components/mission/MissionCard'` },
  { from: /from '\.\.\/\.\.\/components\/MissionDetailModal'/g, to: `from '../../components/mission/MissionDetailModal'` },
  { from: /from '\.\.\/\.\.\/components\/MissionSuccessModal'/g,to: `from '../../components/mission/MissionSuccessModal'` },
  { from: /from '\.\.\/\.\.\/components\/MissionSwapModal'/g,   to: `from '../../components/mission/MissionSwapModal'` },
  { from: /from '\.\.\/\.\.\/components\/MorningSuccessModal'/g,to: `from '../../components/home/MorningSuccessModal'` },
  { from: /from '\.\.\/\.\.\/components\/NightSuccessModal'/g,  to: `from '../../components/home/NightSuccessModal'` },
  { from: /from '\.\.\/\.\.\/components\/OnboardingSummaryCard'/g, to: `from '../../components/onboarding/OnboardingSummaryCard'` },
  { from: /from '\.\.\/\.\.\/components\/TimelineRecords'/g,    to: `from '../../components/report/TimelineRecords'` },
  
  // Fix App.tsx which uses ./components/...
  { from: /from '\.\/components\/MissionCard'/g,       to: `from './components/mission/MissionCard'` },
  { from: /from '\.\/components\/MissionDetailModal'/g, to: `from './components/mission/MissionDetailModal'` },
  { from: /from '\.\/components\/MissionSuccessModal'/g,to: `from './components/mission/MissionSuccessModal'` },
  { from: /from '\.\/components\/MissionSwapModal'/g,   to: `from './components/mission/MissionSwapModal'` },
  { from: /from '\.\/components\/MorningSuccessModal'/g,to: `from './components/home/MorningSuccessModal'` },
  { from: /from '\.\/components\/NightSuccessModal'/g,  to: `from './components/home/NightSuccessModal'` },
  { from: /from '\.\/components\/OnboardingSummaryCard'/g, to: `from './components/onboarding/OnboardingSummaryCard'` },
  { from: /from '\.\/components\/TimelineRecords'/g,    to: `from './components/report/TimelineRecords'` },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const remap of remaps) {
    if (typeof remap.to === 'function') {
      content = content.replace(remap.from, remap.to);
    } else {
      content = content.replace(remap.from, remap.to);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      walkDir(full);
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      processFile(full);
    }
  }
}

walkDir(srcDir);
console.log('Done!');
