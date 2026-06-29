import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workspaceDir = '.';
const avatarsPath = path.join(workspaceDir, 'src/data/artist-avatars.json');
const monthly2026Path = path.join(workspaceDir, 'src/data/monthly-2026.json');

async function fetchAvatarFromChannel(handle) {
  const url = `https://www.youtube.com/${handle}`;
  console.log(`正在從 YouTube 頻道頁面 (${url}) 抓取頭像...`);
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const html = await res.text();
    const avatarMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (avatarMatch && avatarMatch[1]) {
      return avatarMatch[1];
    }
  } catch (err) {
    console.error(`抓取 ${handle} 失敗:`, err.message);
  }
  return null;
}

async function main() {
  const avatars = JSON.parse(fs.readFileSync(avatarsPath, 'utf-8'));
  
  // 1. Fetch KoRiN avatar
  const korinAvatar = await fetchAvatarFromChannel('@KoRiNmus');
  if (korinAvatar) {
    avatars['KoRiN/重音テトSV'] = korinAvatar;
    console.log('成功獲取 KoRiN/重音テトSV 頭像!');
  }
  
  // 2. Fetch 音田雅則 avatar
  const otodaAvatar = await fetchAvatarFromChannel('@otodamasanori6557');
  if (otodaAvatar) {
    avatars['音田雅則'] = otodaAvatar;
    console.log('成功獲取 音田雅則 頭像!');
  }
  
  // Write back avatars
  fs.writeFileSync(avatarsPath, JSON.stringify(avatars, null, 2), 'utf-8');
  
  // Update avatars in monthly-2026.json for month-05
  const monthlyData = JSON.parse(fs.readFileSync(monthly2026Path, 'utf-8'));
  if (monthlyData['month-05']) {
    monthlyData['month-05'].songs.forEach(song => {
      if (avatars[song.artist]) {
        song.avatar = avatars[song.artist];
      }
    });
    fs.writeFileSync(monthly2026Path, JSON.stringify(monthlyData, null, 2), 'utf-8');
    console.log('已同步更新 monthly-2026.json 中歌曲的頭像連結。');
  }
  
  // Recompile
  console.log('重新編譯網頁中...');
  execSync('node tools/build.js', { stdio: 'inherit' });
}

main().catch(console.error);
