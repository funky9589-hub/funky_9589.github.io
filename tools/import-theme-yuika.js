import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workspaceDir = '.';
const themeDataPath = path.join(workspaceDir, 'src/data/theme-data.json');

// Songs list to import
const songsToImport = [
  {
    no: "01",
    name: "おくすり",
    artist: "ユイカ",
    ytId: "-qSqMSsJ4AE",
    desc: "這首以「藥」為隱喻的歌曲是ユイカ首支實寫 MV，描述用音樂治癒人心的溫柔心情。"
  },
  {
    no: "02",
    name: "17さいのうた。",
    artist: "ユイカ",
    ytId: "TLvMXOEXi_k",
    desc: "唱出17歲那年最青澀、真摯與無憂無慮心情的代表作，是青春歲月最純粹的寫照。"
  },
  {
    no: "03",
    name: "すないぱー。",
    artist: "ユイカ",
    ytId: "nvQN56D8RYo",
    desc: "旋律甜美、輕快又帶有滿滿少女心事的戀愛歌，像狙擊手一般正中少年少女的心臟！"
  },
  {
    no: "04",
    name: "そばにいて。",
    artist: "ユイカ",
    ytId: "F553P1-p3P0",
    desc: "TikTok TOHO Film Festival 2021 獲獎影片《夏、二分》主題曲，溫柔述說著「待在我身邊」的陪伴力量。"
  },
  {
    no: "05",
    name: "私が選んだもの",
    artist: "ユイカ",
    ytId: "d8coIl7ARZc",
    desc: "深刻描繪面對人生苦難與抉擇時，選擇「相信自己的選擇，不要迷惘地向前走」的療癒曲目。"
  }
];

async function run() {
  // 1. Read theme data
  let themeData = {};
  if (fs.existsSync(themeDataPath)) {
    themeData = JSON.parse(fs.readFileSync(themeDataPath, 'utf-8'));
  }

  // 2. Construct theme-07 data
  const themeId = "theme-07";
  const newTheme = {
    id: themeId,
    title: "青澀系少女歌手- ユイカ",
    coverImg: "img/theme/yuika.jpg",
    playlistUrl: "https://www.youtube.com/@yuika_singuitar",
    tag: "#YUIKA SELECTION",
    review: "來自日本年僅21歲的創作歌手ユイカ<br><br>一首好きだから<br>唱出了多少位少年少女那酸澀的心情<br>2024年與日本環球音樂簽約後正式主流出道後<br>隨後的幾首新歌<br>更是可以聽出ユイカ對於人生的看法<br>面對感情的糾結<br>人生的迷惘<br>未來的方向<br>喜歡大聲歌唱的心情<br>現在 讓我們一同進入他的歌曲中<br><br>好久沒有聽到ユイカ的直播了<br>ユイカ如果能多開直播就好<br>希望有買到票的人能夠聽的開心！",
    songs: songsToImport.map(song => ({
      no: song.no,
      name: song.name.normalize('NFC'),
      artist: song.artist.normalize('NFC'),
      ytId: song.ytId,
      desc: song.desc.normalize('NFC')
    }))
  };

  // Add theme-07 to themeData
  themeData[themeId] = newTheme;

  // Write theme data back
  fs.writeFileSync(themeDataPath, JSON.stringify(themeData, null, 2), 'utf-8');
  console.log(`\n已成功將主題「青澀系少女歌手- ユイカ」寫入 ${themeDataPath}！`);

  // 3. Run build to compile the web pages
  console.log('\n正在重新編譯網頁...');
  try {
    execSync('node tools/build.js', { stdio: 'inherit' });
    console.log('\n網頁編譯順利完成！主題歌單已成功導入！');
  } catch (err) {
    console.error('編譯失敗，請手動執行 npm run build');
  }
}

run().catch(console.error);
