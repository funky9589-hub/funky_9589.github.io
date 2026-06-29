import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workspaceDir = '.';
const themeDataPath = path.join(workspaceDir, 'src/data/theme-data.json');

// Shorter, easy-to-read lyrics (2-3 lines)
const formattedSongs = [
  {
    no: "01",
    name: "おくすり",
    artist: "ユイカ",
    ytId: "-qSqMSsJ4AE",
    desc: "私だけって約束して。<br><span class=\"zh-translate\">答應我，你只有我一個人。</span><br>私は貴方のおくすり 離れられないわ。<br><span class=\"zh-translate\">我是屬於你的藥，你再也無法離開我。</span>"
  },
  {
    no: "02",
    name: "17さいのうた。",
    artist: "ユイカ",
    ytId: "TLvMXOEXi_k",
    desc: "拝啓、未来の私へ。<br><span class=\"zh-translate\">致敬，寫給未來的我。</span><br>今そこで どんな大人になって生きていますか。<br><span class=\"zh-translate\">此刻的你，在那裡成為了怎樣的大人、又是如何活著呢。</span>"
  },
  {
    no: "03",
    name: "すないぱー。",
    artist: "ユイカ",
    ytId: "nvQN56D8RYo",
    desc: "きゅん きゅん ぎゅん ぎゅん 急上昇！<br><span class=\"zh-translate\">心動不已、怦然加速、情感急速上升！</span><br>この思いで貴方を撃ち抜いちゃえ！<br><span class=\"zh-translate\">就用這份心意，將你一擊命中吧！</span>"
  },
  {
    no: "04",
    name: "そばにいて。",
    artist: "ユイカ",
    ytId: "AG1o7NN2Dwo",
    desc: "2人一緒に笑っちゃうよ<br><span class=\"zh-translate\">我們兩個總會一起笑出來呢</span><br>君がそばにいて<br><span class=\"zh-translate\">只要你陪在我身邊</span>"
  },
  {
    no: "05",
    name: "私が選んだもの",
    artist: "ユイカ",
    ytId: "d8coIl7ARZc",
    desc: "私が選んだもので生きている<br><span class=\"zh-translate\">我正靠著自己所選擇的事物活著</span><br>貴方が握りしめているものはなんだ？<br><span class=\"zh-translate\">而你緊握在手中的，又是什麼呢？</span>"
  }
];

async function run() {
  const themeData = JSON.parse(fs.readFileSync(themeDataPath, 'utf-8'));

  const themeId = "theme-07";
  const newTheme = {
    id: themeId,
    title: "青澀系少女歌手- ユイカ",
    coverImg: "img/theme/yuika.jpg",
    playlistUrl: "https://www.youtube.com/@yuika_singuitar",
    tag: "#YUIKA SELECTION",
    review: "來自日本年僅21歲的創作歌手ユイカ<br><br>一首好きだから<br>唱出了多少位少年少女那酸澀的心情<br>2024年與日本環球音樂簽約後正式主流出道後<br>隨後的幾首新歌<br>更是可以聽出ユイカ對於人生的看法<br>面對感情的糾結<br>人生的迷惘<br>未來的方向<br>喜歡大聲歌唱的心情<br>現在 讓我們一同進入他的歌曲中<br><br>好久沒有聽到ユイカ的直播了<br>ユイカ如果能多開直播就好<br>希望有買到票的人能夠聽的開心！",
    songs: formattedSongs.map(song => ({
      no: song.no,
      name: song.name.normalize('NFC'),
      artist: song.artist.normalize('NFC'),
      ytId: song.ytId,
      desc: song.desc.normalize('NFC')
    }))
  };

  // Rebuild themeData object so theme-07 is the FIRST key
  delete themeData[themeId];

  const orderedThemeData = {
    [themeId]: newTheme,
    ...themeData
  };

  // Write back to theme-data.json
  fs.writeFileSync(themeDataPath, JSON.stringify(orderedThemeData, null, 2), 'utf-8');
  console.log(`已更新為精簡版歌詞，且維持排在最前面！`);

  // Build the static pages
  console.log('重新編譯網頁中...');
  execSync('node tools/build.js', { stdio: 'inherit' });
  console.log('編譯完成！');
}

run().catch(console.error);
