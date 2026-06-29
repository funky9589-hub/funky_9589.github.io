import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workspaceDir = '.';
const themeDataPath = path.join(workspaceDir, 'src/data/theme-data.json');
const avatarsPath = path.join(workspaceDir, 'src/data/artist-avatars.json');

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

const songsToImport = [
  {
    no: "01",
    name: "僕らまた",
    artist: "SG",
    ytId: "hSdcy2_vtaQ",
    desc: "僕らまたそれぞれの道を歩み始めたのさ<br><span class=\"zh-translate\">我們終將各自踏上不同的人生道路開始向前走</span><br>交差点でまた会えたら その時は長い話を語り明かしたいね<br><span class=\"zh-translate\">若能在交會的路口再次相遇，到那時我們就徹夜聊個不停吧</span>"
  },
  {
    no: "02",
    name: "サヨナラの合図",
    artist: "みなとん",
    ytId: "YUKhmzGPcaM",
    desc: "講述對畢業的感受，既是期待亦有不捨<br><span class=\"zh-translate\">懷念現在的同時，也勇敢邁向人生的下個階段。</span>"
  },
  {
    no: "03",
    name: "17さいのうた。",
    artist: "ユイカ",
    ytId: "TLvMXOEXi_k",
    desc: "拝啓、未来の私へ。<br><span class=\"zh-translate\">致敬，寫給未來的我。</span><br>今そこで どんな大人になって生きていますか。<br><span class=\"zh-translate\">此刻的你，在那裡成為了怎樣的大人、又是如何活著呢。</span>"
  },
  {
    no: "04",
    name: "桜晴",
    artist: "優里 × tuki.",
    ytId: "Lp6OiPCDYYw",
    desc: "今はさよなら またねでいいかな<br><span class=\"zh-translate\">現在說再見，用「下次見」來代替，好嗎？</span><br>どんなに遠くなっても忘れたくない<br><span class=\"zh-translate\">無論彼此變得多麼遙遠，我都不想忘記——</span>"
  },
  {
    no: "05",
    name: "手紙 ~拝啓 十五の君へ~",
    artist: "アンジェラ・アキ",
    ytId: "erGCAu_hFqM",
    desc: "ひとつしかないこの胸が何度もばらばらに割れて<br><span class=\"zh-translate\">獨一無二的這個心，不論經歷多少波折</span><br>苦しい中で今を生きている<br><span class=\"zh-translate\">在痛苦之中，努力活著、努力活在當下</span>"
  }
];

async function run() {
  // 1. Manage avatars
  const avatars = JSON.parse(fs.readFileSync(avatarsPath, 'utf-8'));
  
  if (!avatars['SG']) {
    const sgAvatar = await fetchAvatarFromChannel('@sg_official');
    if (sgAvatar) {
      avatars['SG'] = sgAvatar;
      console.log('成功獲取 SG 頭像!');
    }
  }
  
  if (!avatars['アンジェラ・アキ']) {
    const angelaAvatar = await fetchAvatarFromChannel('@angelaakiSMEJ');
    if (angelaAvatar) {
      avatars['アンジェラ・アキ'] = angelaAvatar;
      console.log('成功獲取 アンジェラ・アキ 頭像!');
    }
  }
  
  // Make sure "優里 × tuki." is mapped (if not, combine them or use standard default/one of them)
  const normalizedCombineArtist = "優里 × tuki.".normalize('NFC');
  if (!avatars[normalizedCombineArtist]) {
    // Fallback to 優里 avatar if exists, or tuki.
    avatars[normalizedCombineArtist] = avatars['優里'] || avatars['tuki.'] || 'img/default-avatar.jpg';
  }

  fs.writeFileSync(avatarsPath, JSON.stringify(avatars, null, 2), 'utf-8');

  // 2. Read theme data
  let themeData = JSON.parse(fs.readFileSync(themeDataPath, 'utf-8'));

  // 3. Construct theme-08 data
  const themeId = "theme-08";
  const newTheme = {
    id: themeId,
    title: "畢業季 - 畢業快樂!",
    coverImg: "img/theme/graduation.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PL0GKCkSU2vniKufOPiKZAcabz26r1KmMO", // Default playlist url
    tag: "#GRADUATION SELECTION",
    review: "不知不覺<br>又到了鳳凰花開的時候(?<br>不論你是準備<br>邁向職場，正在迷惘<br>或是準備進入高中大學<br>都予以準備邁向人生下一階段的你一段祝福！<br><br>畢業季都聽什麼歌呢？<br>或是你想到了誰<br>想讓他知道<br>都歡迎在底下留言分享",
    songs: songsToImport.map(song => ({
      no: song.no,
      name: song.name.normalize('NFC'),
      artist: song.artist.normalize('NFC'),
      ytId: song.ytId,
      desc: song.desc.normalize('NFC')
    }))
  };

  // Reorder themeData so theme-08 is first, then theme-07, and then the rest
  delete themeData[themeId];
  
  const orderedThemeData = {
    [themeId]: newTheme,
    ...themeData
  };

  fs.writeFileSync(themeDataPath, JSON.stringify(orderedThemeData, null, 2), 'utf-8');
  console.log(`\n已成功將主題「畢業季 - 畢業快樂!」寫入 ${themeDataPath} 並排在最前面！`);

  // 4. Run build
  console.log('\n重新編譯網頁中...');
  try {
    execSync('node tools/build.js', { stdio: 'inherit' });
    console.log('\n畢業歌單已編譯完成！');
  } catch (err) {
    console.error('編譯失敗，請手動執行 npm run build');
  }
}

run().catch(console.error);
