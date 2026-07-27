import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workspaceDir = '.'; // Run from root of workspace

// Templates
const headerTemplatePath = path.join(workspaceDir, 'src/templates/header.html');
const footerTemplatePath = path.join(workspaceDir, 'src/templates/footer.html');

const headerTemplate = fs.readFileSync(headerTemplatePath, 'utf-8');
const footerTemplate = fs.readFileSync(footerTemplatePath, 'utf-8');

const baseUrl = 'https://funky9589-hub.github.io/funky_9589.github.io';

// Pages configuration
const pages = [
  {
    name: 'index.html',
    title: '音樂幽浮 | J-POP日文歌推薦與中日歌詞翻譯對照',
    description: '音樂幽浮是專注於J-POP日文歌推薦與熱門日本音樂中日歌詞翻譯對照的獨立誌。收錄米津玄師、YOASOBI、Aimer、tuki.、星街すいせい等歌手熱門單曲推薦與歌詞賞析。',
    canonical: `${baseUrl}/index.html`,
    contentFile: 'index.content.html',
    bgLogo: true,
    scripts: ['script.js'],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "音樂幽浮",
      "alternateName": "Funky 9589 J-POP Music",
      "url": `${baseUrl}/`,
      "description": "J-POP日文歌推薦與中日歌詞翻譯對照誌"
    }
  },
  {
    name: 'monthly.html',
    title: '2026日文歌推薦與熱門歌曲中日歌詞翻譯 | 音樂幽浮',
    description: '2026年最新J-POP日文歌推薦，提供米津玄師《烏》、SHO-SENSEI!!《プラネタリウム》、春茶、tuki.等熱門單曲中文歌詞對照與賞析。',
    canonical: `${baseUrl}/monthly.html`,
    contentFile: 'monthly.content.html',
    bgLogo: false,
    scripts: ['data.js', 'script.js'],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MusicPlaylist",
      "name": "2026年日文歌推薦歌單",
      "numTracks": 30,
      "genre": "J-POP",
      "description": "收錄2026年最值得聆聽的熱門J-POP歌曲與歌詞翻譯"
    }
  },
  {
    name: 'monthly-2025-h2.html',
    title: '2025下半年日文歌推薦與熱門J-POP歌曲介紹 | 音樂幽浮',
    description: '2025下半年精選日文歌推薦，收錄熱門J-POP單曲介紹、中日歌詞對照與音樂心得分享。',
    canonical: `${baseUrl}/monthly-2025-h2.html`,
    contentFile: 'monthly-2025-h2.content.html',
    bgLogo: false,
    scripts: ['data-2025-h2.js', 'script.js'],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MusicPlaylist",
      "name": "2025下半年日文歌推薦歌單",
      "genre": "J-POP"
    }
  },
  {
    name: 'monthly-2025-h1.html',
    title: '2025上半年日文歌推薦與經典歌曲歌詞翻譯 | 音樂幽浮',
    description: '2025上半年經典日文歌曲推薦與中文歌詞對照，涵蓋人氣動畫主題曲與獨立寶藏歌手作品。',
    canonical: `${baseUrl}/monthly-2025-h1.html`,
    contentFile: 'monthly-2025-h1.content.html',
    bgLogo: false,
    scripts: ['data-2025-h1.js', 'script.js'],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MusicPlaylist",
      "name": "2025上半年日文歌推薦歌單",
      "genre": "J-POP"
    }
  },
  {
    name: 'playlist.html',
    title: '主題歌單推薦 - Aimer專題與熱門動畫主題曲中日歌詞對照 | 音樂幽浮',
    description: '精選Aimer專題推薦歌單、動漫主題曲中日歌詞對照與賞析，帶來深度J-POP音樂聆聽體驗。',
    canonical: `${baseUrl}/playlist.html`,
    contentFile: 'playlist.content.html',
    bgLogo: false,
    scripts: ['theme-data.js', 'script.js'],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MusicPlaylist",
      "name": "Aimer與動漫主題曲歌單專題",
      "genre": "J-POP / Anime"
    }
  },
  {
    name: 'shorts.html',
    title: 'J-POP短影音與熱門短片精選歌曲推薦 | 音樂幽浮',
    description: '精選J-POP短影音與抖音熱門日文歌曲推薦，快速探索最新流行音樂趨勢。',
    canonical: `${baseUrl}/shorts.html`,
    contentFile: 'shorts.content.html',
    bgLogo: false,
    scripts: ['script.js'],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemPage",
      "name": "J-POP 短影音推薦"
    }
  }
];

// 1. Compile HTML pages
console.log('Compiling HTML pages...');
pages.forEach(page => {
  const contentPath = path.join(workspaceDir, 'src/pages', page.contentFile);
  const content = fs.readFileSync(contentPath, 'utf-8');

  // Build header
  let header = headerTemplate
    .replaceAll('{{PAGE_TITLE}}', page.title)
    .replaceAll('{{META_DESCRIPTION}}', page.description)
    .replaceAll('{{CANONICAL_URL}}', page.canonical);

  const jsonLd = page.structuredData
    ? `<script type="application/ld+json">\n${JSON.stringify(page.structuredData, null, 2)}\n</script>`
    : '';
  header = header.replace('{{STRUCTURED_DATA}}', jsonLd);

  if (page.bgLogo) {
    header = header.replace('{{BG_LOGO}}', `
    <div id="bg-logo" class="bg-logo-wrapper">
        <img src="img/logobgmove.png" alt="Background Logo">
    </div>`);
  } else {
    header = header.replace('{{BG_LOGO}}', '');
  }

  // Build footer
  const version = Date.now();
  const scriptTags = page.scripts
    .map(script => `<script src="${script}?v=${version}"></script>`)
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
