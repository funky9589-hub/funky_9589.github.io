import fs from 'fs';
import path from 'path';
import readline from 'readline';

const workspaceDir = '.';

// Helper to ask console questions
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
}

// Extract YouTube ID from URL
function getYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Fetch YouTube oEmbed metadata & Channel Avatar
async function fetchYoutubeMeta(ytId) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`;
    console.log(`\n正在從 YouTube 獲取影片資訊...`);
    const response = await fetch(oembedUrl);
    if (!response.ok) throw new Error('無法取得影片資訊，請確認影片 ID 是否正確或為公開影片');
    
    const data = await response.json();
    let avatarUrl = '';
    
    if (data.author_url) {
      console.log(`正在獲取頻道頭像 (${data.author_name})...`);
      try {
        const channelRes = await fetch(data.author_url);
        if (channelRes.ok) {
          const html = await channelRes.text();
          // 用正則表達式尋找 og:image (頻道頭像)
          const avatarMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
          if (avatarMatch && avatarMatch[1]) {
            avatarUrl = avatarMatch[1];
          }
        }
      } catch (err) {
        console.warn('警告：無法獲取頻道頭像，將在後續步驟使用預設頭像或進行手動輸入。');
      }
    }
    
    return {
      title: data.title || '',
      artist: data.author_name || '',
      avatarUrl: avatarUrl
    };
  } catch (error) {
    console.error(`錯誤：${error.message}`);
    return null;
  }
}

// Format date to YYYY.MM.DD
function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

async function main() {
  console.log('=========================================');
  console.log('    音樂幽浮 J-POP 網站：自動歌曲新增工具   ');
  console.log('=========================================');
  
  // 1. 選擇分類
  console.log('\n請選擇要將歌曲加入到哪個分類：');
  console.log('1) 2026 每月推薦 (monthly-2026.json)');
  console.log('2) 2025 下半年推薦 (monthly-2025-h2.json)');
  console.log('3) 2025 上半年推薦 (monthly-2025-h1.json)');
  console.log('4) 主題歌單 (theme-data.json)');
  
  const choice = await askQuestion('請輸入選項 (1-4): ');
  let dataFileName = '';
  let isTheme = false;
  
  if (choice === '1') dataFileName = 'monthly-2026.json';
  else if (choice === '2') dataFileName = 'monthly-2025-h2.json';
  else if (choice === '3') dataFileName = 'monthly-2025-h1.json';
  else if (choice === '4') {
    dataFileName = 'theme-data.json';
    isTheme = true;
  } else {
    console.log('無效的選項，退出程序。');
    return;
  }
  
  // 2. 輸入 YouTube 連結
  const ytInput = await askQuestion('\n請貼上 YouTube 影片網址或 ID: ');
  const ytId = getYoutubeId(ytInput) || (ytInput.length === 11 ? ytInput : null);
  
  if (!ytId) {
    console.log('錯誤：無法解析 YouTube 影片 ID。');
    return;
  }
  
  // 3. 獲取 YouTube 資訊
  const meta = await fetchYoutubeMeta(ytId);
  const defaultTitle = meta ? meta.title : '';
  const defaultArtist = meta ? meta.artist : '';
  const defaultAvatar = meta ? meta.avatarUrl : '';
  
  // 4. 輸入歌曲詳細資訊 (NFC 正規化)
  console.log('\n--- 請確認或編輯歌曲資訊 ---');
  let songName = await askQuestion(`歌曲名稱 (預設: ${defaultTitle}): `);
  songName = (songName || defaultTitle).normalize('NFC');
  
  let artistName = await askQuestion(`歌手名稱 (預設: ${defaultArtist}): `);
  artistName = (artistName || defaultArtist).normalize('NFC');
  
  let desc = await askQuestion('歌曲推薦介紹 (支援 HTML 如 <br>): ');
  desc = desc.normalize('NFC');
  
  let dateStr = '';
  if (!isTheme) {
    const todayStr = getTodayDateString();
    dateStr = await askQuestion(`發布日期 (預設: ${todayStr}): `);
    dateStr = (dateStr || todayStr).normalize('NFC');
  }
  
  // 5. 處理歌手頭像
  const avatarsPath = path.join(workspaceDir, 'src/data/artist-avatars.json');
  let avatars = {};
  if (fs.existsSync(avatarsPath)) {
    avatars = JSON.parse(fs.readFileSync(avatarsPath, 'utf-8'));
  }
  
  // 如果已存在頭像，提示使用者；若無，則儲存新獲取的頭像
  if (avatars[artistName]) {
    console.log(`\n[頭像資料] 歌手 "${artistName}" 的頭像已存在於資料庫中。`);
  } else {
    let finalAvatar = defaultAvatar;
    if (!finalAvatar) {
      finalAvatar = await askQuestion(`未獲取到歌手頭像，請輸入頭像網址 (或留空使用預設圖): `);
    }
    if (finalAvatar) {
      avatars[artistName] = finalAvatar;
      fs.writeFileSync(avatarsPath, JSON.stringify(avatars, null, 2), 'utf-8');
      console.log(`\n[頭像資料] 已將歌手 "${artistName}" 的頭像儲存至資料庫。`);
    }
  }

  // 6. 讀取並寫入對應的資料 JSON
  const dataPath = path.join(workspaceDir, 'src/data', dataFileName);
  const fileData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  if (isTheme) {
    // 主題歌單
    console.log('\n現有的主題列表：');
    const themes = Object.keys(fileData);
    themes.forEach((tId, idx) => {
      console.log(`${idx + 1}) [${tId}] ${fileData[tId].title}`);
    });
    
    const themeIdxInput = await askQuestion(`請輸入要加入的主題序號 (1-${themes.length}): `);
    const themeIdx = parseInt(themeIdxInput) - 1;
    
    if (isNaN(themeIdx) || themeIdx < 0 || themeIdx >= themes.length) {
      console.log('無效的主題序號，退出程序。');
      return;
    }
    
    const selectedThemeId = themes[themeIdx];
    const theme = fileData[selectedThemeId];
    
    // 計算歌曲序號
    const nextNo = String(theme.songs.length + 1).padStart(2, '0');
    
    const newSong = {
      no: nextNo,
      name: songName,
      artist: artistName,
      ytId: ytId,
      desc: desc
    };
    
    theme.songs.push(newSong);
    console.log(`\n已成功加入歌曲 "${songName}" 至主題 [${theme.title}]！`);
    
  } else {
    // 每月推薦
    console.log('\n現有的月份列表：');
    const months = Object.keys(fileData).sort().reverse(); // 最新月份排前面
    months.forEach((mId, idx) => {
      console.log(`${idx + 1}) [${mId}] ${fileData[mId].title}`);
    });
    console.log(`${months.length + 1}) 新增月份`);
    
    const monthChoice = await askQuestion(`請選擇月份序號 (1-${months.length + 1}): `);
    let selectedMonthId = '';
    
    if (monthChoice === String(months.length + 1)) {
      // 新增月份
      const newMonthId = await askQuestion('請輸入新月份 ID (格式如 month-05): ');
      const newMonthTitle = await askQuestion('請輸入月份顯示名稱 (例如 2026 5月): ');
      const coverImg = await askQuestion('請輸入封面圖片路徑 (預設: img/monthly/2026/05.jpg): ') || `img/monthly/2026/${newMonthId.replace('month-', '')}.jpg`;
      const tag = await askQuestion('請輸入月份 Tag (例如 #2026 MAY SELECTION): ');
      const review = await askQuestion('請輸入本月短評 (支援 HTML 如 <br>): ');
      
      selectedMonthId = newMonthId.normalize('NFC');
      fileData[selectedMonthId] = {
        id: selectedMonthId,
        title: newMonthTitle.normalize('NFC'),
        coverImg: coverImg.normalize('NFC'),
        tag: tag.normalize('NFC'),
        review: review.normalize('NFC'),
        songs: []
      };
      console.log(`已建立新月份 [${newMonthTitle}]。`);
    } else {
      const idx = parseInt(monthChoice) - 1;
      if (isNaN(idx) || idx < 0 || idx >= months.length) {
        console.log('無效的月份序號，退出程序。');
        return;
      }
      selectedMonthId = months[idx];
    }
    
    const month = fileData[selectedMonthId];
    const nextNo = String(month.songs.length + 1).padStart(2, '0');
    
    const newSong = {
      no: nextNo,
      name: songName,
      artist: artistName,
      avatar: avatars[artistName] || "請替換", // 可使用字典，或手動覆寫
      ytId: ytId,
      desc: desc,
      date: dateStr
    };
    
    month.songs.push(newSong);
    console.log(`\n已成功加入歌曲 "${songName}" 至 [${month.title}]！`);
  }
  
  // 寫回檔案
  fs.writeFileSync(dataPath, JSON.stringify(fileData, null, 2), 'utf-8');
  console.log(`已更新資料檔 ${dataFileName}。`);
  
  // 7. 自動觸發重新編譯
  console.log('\n--- 正在自動編譯網頁... ---');
  const { execSync } = await import('child_process');
  try {
    execSync('node tools/build.js', { stdio: 'inherit' });
    console.log('網頁編譯完成，新歌曲已立即生效！');
  } catch (err) {
    console.error('重新編譯網頁失敗，請手動執行 npm run build');
  }
}

main().catch(console.error);
