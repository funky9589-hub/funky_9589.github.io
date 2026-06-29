import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workspaceDir = '.';
const monthly2026Path = path.join(workspaceDir, 'src/data/monthly-2026.json');
const avatarsPath = path.join(workspaceDir, 'src/data/artist-avatars.json');

// Songs list to import
const songsToImport = [
  {
    name: "一二三",
    artist: "Penthouse",
    ytId: "pdcdLtdT98s",
    desc: "動畫《入間同學入魔了！》第四季片頭曲，充滿魔性且旋律極其輕快洗腦的曲風！"
  },
  {
    name: "誓い",
    artist: "Leina",
    ytId: "1KnySdlZHJU",
    desc: "電視動畫《日本三國》的片尾曲，以溫柔且深具穿透力的歌聲訴說著誓言。"
  },
  {
    name: "しんそう",
    artist: "KoRiN/重音テトSV",
    ytId: "gxv0Zk5Nd10",
    desc: "來自台灣創作者的寶藏 V家原創歌曲，是在新一代設計展中無意間發現的超棒作品！"
  },
  {
    name: "閃光",
    artist: "[Alexandros]",
    ytId: "xfG6L9I7N8I",
    desc: "動畫電影《機動戰士鋼彈 閃光的哈薩威》主題曲，強烈節奏與熱血感爆棚的搖滾神曲。"
  },
  {
    name: "CLASSIC",
    artist: "Ayumu Imazu",
    ytId: "toD2V6Sohhc",
    desc: "來自第二張個人專輯的主打歌。Ayumu Imazu 的新歌再次展現了他驚人的才華與極強的節奏感。"
  },
  {
    name: "omoi",
    artist: "音田雅則",
    ytId: "nO3jFwN8Y2w",
    desc: "寫實且動人的抒情歌，描寫在深夜便利商店、副駕駛座等日常場景中，對重要之人最真摯的思念。"
  }
];

// Helper to fetch YouTube oEmbed metadata & Channel Avatar
async function fetchArtistAvatar(ytId, artistName) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`;
    const response = await fetch(oembedUrl);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.author_url) {
      console.log(`正在為 "${artistName}" 從 YouTube 頻道 (${data.author_url}) 獲取頭像...`);
      const channelRes = await fetch(data.author_url);
      if (channelRes.ok) {
        const html = await channelRes.text();
        const avatarMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (avatarMatch && avatarMatch[1]) {
          return avatarMatch[1];
        }
      }
    }
  } catch (err) {
    console.error(`獲取 ${artistName} 頭像失敗:`, err.message);
  }
  return null;
}

async function run() {
  // 1. Read artist avatars database
  let avatars = {};
  if (fs.existsSync(avatarsPath)) {
    avatars = JSON.parse(fs.readFileSync(avatarsPath, 'utf-8'));
  }

  // 2. Fetch missing avatars
  for (const song of songsToImport) {
    const normalizedArtistName = song.artist.normalize('NFC');
    if (!avatars[normalizedArtistName]) {
      const avatarUrl = await fetchArtistAvatar(song.ytId, song.artist);
      if (avatarUrl) {
        avatars[normalizedArtistName] = avatarUrl;
        console.log(`- 成功新增歌手 "${normalizedArtistName}" 的頭像網址`);
      } else {
        avatars[normalizedArtistName] = "img/default-avatar.jpg";
        console.log(`- 未能獲取 "${normalizedArtistName}" 的頭像，已暫時使用預設圖`);
      }
    }
  }

  // Save avatars
  fs.writeFileSync(avatarsPath, JSON.stringify(avatars, null, 2), 'utf-8');

  // 3. Read monthly data
  let monthlyData = {};
  if (fs.existsSync(monthly2026Path)) {
    monthlyData = JSON.parse(fs.readFileSync(monthly2026Path, 'utf-8'));
  }

  // 4. Construct month-05 data
  const monthId = "month-05";
  const songs = songsToImport.map((song, index) => {
    const normalizedArtist = song.artist.normalize('NFC');
    const normalizedName = song.name.normalize('NFC');
    const normalizedDesc = song.desc.normalize('NFC');
    
    return {
      no: String(index + 1).padStart(2, '0'),
      name: normalizedName,
      artist: normalizedArtist,
      avatar: avatars[normalizedArtist] || "img/default-avatar.jpg",
      ytId: song.ytId,
      desc: normalizedDesc,
      date: "2026.05.TBA" // default placeholder for release
    };
  });

  const month5Data = {
    id: monthId,
    title: "2026 5月",
    coverImg: "img/monthly/2026/05.jpg",
    tag: "#2026 MAY SELECTION",
    review: "新星宛如繁星般閃爍<br>這個五月份聽了很多的作品<br>蠻多知名度不高，但是非常不錯的寶藏歌手<br>其中有一首是來自台灣創作者的歌曲<br>是在新一代展中發現的<br>此外Ayumu Imazu的新歌也是令人震驚<br>這個人真是才華洋溢阿<br><br>那以下是這次的歌單",
    songs: songs
  };

  // We want to insert month-05 at the top of monthlyData (maintaining newest first order)
  const newMonthlyData = {
    "month-05": month5Data,
    ...monthlyData
  };

  // Write monthly data back
  fs.writeFileSync(monthly2026Path, JSON.stringify(newMonthlyData, null, 2), 'utf-8');
  console.log(`\n已成功將 2026 5月 的歌單寫入 ${monthly2026Path}！`);

  // 5. Run build to compile the web pages
  console.log('\n正在重新編譯網頁...');
  try {
    execSync('node tools/build.js', { stdio: 'inherit' });
    console.log('\n網頁編譯順利完成！您可以開始預覽「2026 5月」的推薦內容了！');
  } catch (err) {
    console.error('編譯失敗，請手動執行 npm run build');
  }
}

run().catch(console.error);
