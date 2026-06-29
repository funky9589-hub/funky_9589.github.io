import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workspaceDir = '.';
const themeDataPath = path.join(workspaceDir, 'src/data/theme-data.json');
const avatarsPath = path.join(workspaceDir, 'src/data/artist-avatars.json');

const songsToImport = [
  {
    no: "01",
    name: "カタオモイ",
    artist: "Aimer",
    ytId: "kxs9Su_mbpU",
    desc: "Darling 夢が叶ったの お似合いの言葉が見つからないよ<br><span class=\"zh-translate\">親愛的，我的願望實現了，我找不到任何足以形容此刻的話語。</span><br>Darling 夢が叶ったの 愛が溢れていく<br><span class=\"zh-translate\">親愛的，我的願望實現了，愛正不斷滿溢而出。</span>"
  },
  {
    no: "02",
    name: "Ref:rain",
    artist: "Aimer",
    ytId: "mvkbCZfwWzA",
    desc: "What a good thing we lose? What a bad thing we knew<br><span class=\"zh-translate\">我們所失去的，究竟是多麼珍貴？我們所明白的，又是多麼難過？</span><br>そんなフレーズに濡れてく 雨の中<br><span class=\"zh-translate\">在雨中，被那樣的話語一點一滴浸濕。</span>"
  },
  {
    no: "03",
    name: "Torches",
    artist: "Aimer",
    ytId: "DP89-sZL1YM",
    desc: "You're not alone 今 灯火を抱け その闇にむけ<br><span class=\"zh-translate\">你並不孤單，此刻擁抱手中的火光，朝著那片黑暗前進吧！</span><br>Listen to me Cleave your way again<br><span class=\"zh-translate\">聽我說，再次開闢屬於你的道路。</span>"
  },
  {
    no: "04",
    name: "Polaris",
    artist: "Aimer",
    ytId: "K1kjy1XLx7I",
    desc: "「僕は一人だ...」そんなこと もう言わせない<br><span class=\"zh-translate\">「我是一個人……」這種話，我再也不會讓你說了。</span><br>いつだって 途惑って 帰ることもできなくなって<br><span class=\"zh-translate\">無論何時都在迷惘著，甚至連回去的路都找不到了。</span>"
  },
  {
    no: "05",
    name: "コイワズライ",
    artist: "Aimer",
    ytId: "4LaNC7jB6gY",
    desc: "ありふれた会話や仕草を 少しも忘れたくはないよ<br><span class=\"zh-translate\">那些再平凡不過的對話與小動作，我一點也不想忘記。</span><br>ゆらり きらり 白雪のように 溶けてしまわないように<br><span class=\"zh-translate\">輕輕搖曳、閃閃發亮，如同白雪一般，願它不要就此融化消失。</span>"
  }
];

async function run() {
  // 1. Read theme data
  let themeData = JSON.parse(fs.readFileSync(themeDataPath, 'utf-8'));

  // 2. Construct theme-09 data
  const themeId = "theme-09";
  const newTheme = {
    id: themeId,
    title: "歌單推薦 - Aimer",
    coverImg: "img/theme/Aimer.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PL0GKCkSU2vniKufOPiKZAcabz26r1KmMO", // Default playlist
    tag: "#AIMER SELECTION",
    review: "Aimer，讀做「欸美」，在法文中為「愛」的意思。從小開始學習鋼琴與練習吉他，在海外生活也讓她於英文作詞方面投入很大心力。十五歲時，因為過度使用喉嚨聲帶發痛，被迫採用沉默治療法，聲帶損傷至今仍未痊癒，但也造就了 Aimer 現在獨特而迷人的砂啞聲線。<br><br>2011年以單曲正式出道。2013年起與澤野弘之等作曲家合作，2016年起更與不同音樂人連動推出風格多變的專輯《daydream》，打破以往的世界觀。隨後正式進入主流市場，並為許多知名動漫（如《鬼滅之刃》、《命運停駐之夜》）獻唱主題曲。<br><br>Aimer 的歌聲與曲風，都非常適合在夜晚時播放。雖然聲音聽起來柔弱，但也有如《black bird》般充滿爆發力的曲目。還記得第一次聽到《Ref:rain》進入副歌時，我整個人都起了雞皮疙瘩。<br><br>你也喜歡 Aimer 嗎？你對 Aimer 印象最深的歌是什麼呢？歡迎分享！",
    songs: songsToImport.map(song => ({
      no: song.no,
      name: song.name.normalize('NFC'),
      artist: song.artist.normalize('NFC'),
      ytId: song.ytId,
      desc: song.desc.normalize('NFC')
    }))
  };

  // Reorder themeData so theme-09 is first, then theme-08, theme-07, and the rest
  delete themeData[themeId];
  
  const orderedThemeData = {
    [themeId]: newTheme,
    ...themeData
  };

  fs.writeFileSync(themeDataPath, JSON.stringify(orderedThemeData, null, 2), 'utf-8');
  console.log(`已成功將主題「歌單推薦 - Aimer」寫入 ${themeDataPath} 並排在第一個！`);

  // 3. Run build to compile the web pages
  console.log('\n重新編譯網頁中...');
  try {
    execSync('node tools/build.js', { stdio: 'inherit' });
    console.log('\nAimer 歌單編譯完成！');
  } catch (err) {
    console.error('編譯失敗，請手動執行 npm run build');
  }
}

run().catch(console.error);
