import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workspaceDir = '.'; // Run from root of workspace

// Templates
const headerTemplatePath = path.join(workspaceDir, 'src/templates/header.html');
const footerTemplatePath = path.join(workspaceDir, 'src/templates/footer.html');

const headerTemplate = fs.readFileSync(headerTemplatePath, 'utf-8');
const footerTemplate = fs.readFileSync(footerTemplatePath, 'utf-8');

// Pages configuration
const pages = [
  {
    name: 'index.html',
    title: '音樂幽浮的日文歌網站',
    contentFile: 'index.content.html',
    bgLogo: true,
    scripts: ['script.js']
  },
  {
    name: 'monthly.html',
    title: '每月推薦 - 音樂幽浮',
    contentFile: 'monthly.content.html',
    bgLogo: false,
    scripts: ['data.js', 'script.js']
  },
  {
    name: 'monthly-2025-h2.html',
    title: '2025下半年推薦 - 音樂幽浮',
    contentFile: 'monthly-2025-h2.content.html',
    bgLogo: false,
    scripts: ['data-2025-h2.js', 'script.js']
  },
  {
    name: 'monthly-2025-h1.html',
    title: '2025上半年推薦 - 音樂幽浮',
    contentFile: 'monthly-2025-h1.content.html',
    bgLogo: false,
    scripts: ['data-2025-h1.js', 'script.js']
  },
  {
    name: 'playlist.html',
    title: '主題歌單 - 音樂幽浮',
    contentFile: 'playlist.content.html',
    bgLogo: false,
    scripts: ['theme-data.js', 'script.js']
  },
  {
    name: 'shorts.html',
    title: 'Shorts - 音樂幽浮',
    contentFile: 'shorts.content.html',
    bgLogo: false,
    scripts: ['script.js']
  }
];

// 1. Compile HTML pages
console.log('Compiling HTML pages...');
pages.forEach(page => {
  const contentPath = path.join(workspaceDir, 'src/pages', page.contentFile);
  const content = fs.readFileSync(contentPath, 'utf-8');

  // Build header
  let header = headerTemplate.replace('{{PAGE_TITLE}}', page.title);
  if (page.bgLogo) {
    header = header.replace('{{BG_LOGO}}', `
    <div id="bg-logo" class="bg-logo-wrapper">
        <img src="img/logobgmove.png" alt="Background Logo">
    </div>`);
  } else {
    header = header.replace('{{BG_LOGO}}', '');
  }

  // Build footer
  const scriptTags = page.scripts
    .map(script => `<script src="${script}"></script>`)
    .join('\n    ');
  const footer = footerTemplate.replace('{{SCRIPTS}}', scriptTags);

  const fullHtml = header + content + footer;
  const outputPath = path.join(workspaceDir, page.name);
  fs.writeFileSync(outputPath, fullHtml, 'utf-8');
  console.log(`- Generated ${page.name}`);
});

// 2. Compile JSON Data files to Javascript Global Variables
console.log('\nCompiling JSON data files to JS global variables...');

function compileDataFile(jsonFileName, jsFileName, varName) {
  const jsonPath = path.join(workspaceDir, 'src/data', jsonFileName);
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  const jsContent = `/* =========================================
   音樂幽浮 - 自動生成資料庫 (請勿手動編輯此檔案)
   ========================================= */

const ${varName} = ${JSON.stringify(jsonData, null, 2)};
`;
  
  const outputPath = path.join(workspaceDir, jsFileName);
  fs.writeFileSync(outputPath, jsContent, 'utf-8');
  console.log(`- Generated ${jsFileName} from ${jsonFileName}`);
}

compileDataFile('monthly-2026.json', 'data.js', 'monthlyData');
compileDataFile('monthly-2025-h2.json', 'data-2025-h2.js', 'monthlyData');
compileDataFile('monthly-2025-h1.json', 'data-2025-h1.js', 'monthlyData');
compileDataFile('theme-data.json', 'theme-data.js', 'themeData');

// 3. Compile script.js (injecting artist-avatars.json)
console.log('\nInjecting artist avatars into script.js...');
const srcScriptPath = path.join(workspaceDir, 'src/script.js');
const avatarsPath = path.join(workspaceDir, 'src/data/artist-avatars.json');

if (fs.existsSync(srcScriptPath)) {
  let scriptContent = fs.readFileSync(srcScriptPath, 'utf-8');
  const avatarsContent = fs.readFileSync(avatarsPath, 'utf-8');
  
  // Replace the placeholder or the entire DB object block
  // To make it easy, we replace "// {{ARTIST_AVATAR_DB}}" or find the placeholder
  scriptContent = scriptContent.replace('// {{ARTIST_AVATAR_DB}}', `const artistAvatarDB = ${avatarsContent};`);
  
  const outputPath = path.join(workspaceDir, 'script.js');
  fs.writeFileSync(outputPath, scriptContent, 'utf-8');
  console.log('- Compiled script.js with up-to-date artist avatars');
} else {
  console.error('Error: src/script.js not found! Please copy original script.js to src/script.js first.');
}

console.log('\nBuild complete! All files generated successfully.');

// 4. Generate sitemap.xml
console.log('\nGenerating sitemap.xml...');
try {
  execSync('node tools/generate-sitemap.js', { stdio: 'inherit' });
} catch (err) {
  console.error('Sitemap generation failed:', err.message);
}
