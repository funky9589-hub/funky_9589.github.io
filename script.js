/* =========================================
   音樂幽浮 - 核心互動控制 JS
   功能：星空生成、打字機開場、漢堡選單、按鈕開關、捲動穿梭特效
   ========================================= */

// --- 1. 打字機效果：讓標題一個一個字跳出來 ---
function typeWriterEffect() {
    const textElement = document.getElementById('typewriter-text');
    const fullText = "歡迎你來到J-POP的世界"; // 想要顯示的完整文字
    let index = 0;
    const speed = 150; // 打字速度 (毫秒)，數字越大越慢

    function type() {
        if (index < fullText.length) {
            // 將文字一個一個填入標籤中
            textElement.innerHTML += fullText.charAt(index);
            index++;
            // 設定下一個字出現的時間
            setTimeout(type, speed);
        }
    }

    if (textElement) {
        type(); // 啟動打字
    }
}

// --- 2. 背景工廠：生成動態星空、流星與音符 ---
function createComplexBackground() {
    const container = document.querySelector('.stars-container');
    if (!container) return; 

    const starCount = 200;    
    const meteorCount = 10;   
    const noteCount = 40;     
    const colors = ['#fff', '#f0d597', '#c5a059', '#fdf5e6'];
    const notesPool = ['♪', '♫', '∮', '⚛', '✦']; 

    // 生成靜態星星
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'particle star';
        const size = Math.random() * 3; 
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        if (Math.random() > 0.8) {
            star.style.borderRadius = '0'; 
            star.style.boxShadow = '0 0 5px #fff'; 
        } else {
            star.style.borderRadius = '50%';
        }
        star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        star.style.top = Math.random() * window.innerHeight + 'px';
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite alternate`;
        container.appendChild(star);
    }

    // 生成流星 (右上進場)
    for (let i = 0; i < meteorCount; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'particle meteor';
        meteor.style.width = Math.random() * 300 + 100 + 'px';
        meteor.style.height = '1px';
        meteor.style.background = `linear-gradient(to right, ${colors[1]}, ${colors[2]}, transparent)`;
        meteor.style.top = Math.random() * 50 + 'vh';
        meteor.style.left = '100vw'; 
        meteor.style.animation = `meteorFlow ${Math.random() * 2 + 2}s infinite linear`;
        meteor.style.animationDelay = Math.random() * 20 + 's';
        container.appendChild(meteor);
    }

    // 生成音符 (左側進場)
    for (let i = 0; i < noteCount; i++) {
        const note = document.createElement('div');
        note.className = 'particle j-music-note';
        note.innerHTML = notesPool[Math.floor(Math.random() * notesPool.length)];
        note.style.color = Math.random() > 0.5 ? colors[1] : colors[2];
        note.style.fontSize = Math.random() * 15 + 12 + 'px';
        note.style.left = '-10vw'; 
        note.style.top = Math.random() * window.innerHeight + 'px';
        note.style.animation = `noteFlow ${Math.random() * 20 + 15}s infinite linear`;
        note.style.animationDelay = Math.random() * 15 + 's';
        container.appendChild(note);
    }
}

// --- 歌手頭貼資料庫：集中管理，避免每次重複輸入網址 ---
const artistAvatarDB = {
    "ヨルシカ": "https://yt3.googleusercontent.com/ytc/AIdro_kVKEa-EG-3DL3jnIwzZ13S4zo8G57by8Gq-nJLBOcuqg=s160-c-k-c0x00ffffff-no-rj",
    "ユイカ": "https://yt3.googleusercontent.com/Gep-rfN9XHPQ9Sxwn7FQ--_HT3DxhNv-TocxfUeMBgb26BxfBx8TSLUlNDOmvZuLdfj24vGMR5Q=s160-c-k-c0x00ffffff-no-rj",
    "ロクデナシ": "https://yt3.googleusercontent.com/r997eUN3Xv-Ytf4qvI4QOJxdEZS0UMjJnccQdLvMtleGBtwRMp3tI15iw2-IxlP9zffSm4MJzA=s160-c-k-c0x00ffffff-no-rj",
    "ロクデナシ": "https://yt3.googleusercontent.com/r997eUN3Xv-Ytf4qvI4QOJxdEZS0UMjJnccQdLvMtleGBtwRMp3tI15iw2-IxlP9zffSm4MJzA=s160-c-k-c0x00ffffff-no-rj", // 相容日文濁音分離編碼
    "星街すいせい": "https://yt3.googleusercontent.com/ytc/AIdro_kLDBK5ksSvk5-XJ6S8e0kWfjy7mVl3jyUkgDeMQ7rlCpU=s160-c-k-c0x00ffffff-no-rj",
    "Eve": "https://yt3.googleusercontent.com/xa-X79VJeydvn8QKb-bhkfoO0ZZ-ClwExN4LR6A_z5i3hPNdG3Q5OoC5dk8OGJHejag1_rjT4g=s160-c-k-c0x00ffffff-no-rj",
    "Eve feat. suis": "https://yt3.googleusercontent.com/xa-X79VJeydvn8QKb-bhkfoO0ZZ-ClwExN4LR6A_z5i3hPNdG3Q5OoC5dk8OGJHejag1_rjT4g=s160-c-k-c0x00ffffff-no-rj",
    "tuki.(17)": "https://yt3.googleusercontent.com/56pJ8Rhb9L2wXD6sXgkOkFFSp29OfgvVK3GjkpuqSKv0e0bHi5p-p4S6hZbMhyaECRubkdfO0A=s160-c-k-c0x00ffffff-no-rj",
    "tuki.": "https://yt3.googleusercontent.com/56pJ8Rhb9L2wXD6sXgkOkFFSp29OfgvVK3GjkpuqSKv0e0bHi5p-p4S6hZbMhyaECRubkdfO0A=s160-c-k-c0x00ffffff-no-rj",
    "キタニタツヤ": "https://yt3.googleusercontent.com/A4RF46l8LFRVFCBARJdwDXez9XQKfn7FWsMO-D7d05OWB7EFL8cVUdgds3ATQHj3tdjkgrNRWg=s160-c-k-c0x00ffffff-no-rj",
    "Leina": "https://yt3.googleusercontent.com/1mJMIBnl9FtYt6wkcn4VpOPjFgEAhQ70zvLKkygjbnGXNd-98Yqh43hNM46TGir34qW7BVAIuw=s160-c-k-c0x00ffffff-no-rj",
    "Daitch feat.汐菜": "https://yt3.googleusercontent.com/bR3cEtLPwmlWr1AVV5IxCpS80QnDz-6TAUDZ9vU2fWqoSkCuq5ee5Xy36nM0DtSfmVmBx5FBADs=s160-c-k-c0x00ffffff-no-rj",
    "みなとん": "https://yt3.googleusercontent.com/jcUXGFPCToubnmGv3tDEbmZG1I4LsHoiN9Xo0UYPkCl7ziKxIQZxUlzBcfG0rpyF4cIuuPoR=s160-c-k-c0x00ffffff-no-rj",
    "ZUTOMAYO": "https://yt3.googleusercontent.com/ytc/AIdro_k65c3FqRpwfe066estQZsGjy_sBu1Y0sV_6_C23VXUlho=s160-c-k-c0x00ffffff-no-rj",
    "東京真中feat. 重音テト": "https://yt3.ggpht.com/DoOc1VSDlzxv7kRuQtacW55CXK7kzmHtx00ha1YAkFXyM42EzLMYoBsBPd8H-3YGDggIkNCk3w=s48-c-k-c0x00ffffff-no-rj",
    "9Lana cover": "https://yt3.googleusercontent.com/S52UznA_cIepfv6vTXYQy4SDWPJ5dSExjk3Jyjo_jzk2cdTI2Vp3Z6uNgqEqpjb--8IlGcmY=s160-c-k-c0x00ffffff-no-rj",
    "柿崎ユウタ": "https://yt3.googleusercontent.com/cay0B1jZIhnXESba0qIhF_pU7qlcwhQwUTdqtA1qQmhoKFt14LmBxWudh0QZ-PE1HrywO3-Cfw=s160-c-k-c0x00ffffff-no-rj",
    "えんぷてい": "https://yt3.googleusercontent.com/fArmYot0vZ-sPKyWN_18GMvL_MlkGjP00CpBJAF5S9uoHlB5jAEioxnIDkfSSpRh6iOR2L9ueA=s160-c-k-c0x00ffffff-no-rj",
    "BellyJay": "https://yt3.googleusercontent.com/ytc/AIdro_n5K6vI196f-KJwW7hjXuMVaysQbPIGBuqces2sruHTZQ=s160-c-k-c0x00ffffff-no-rj",
    "King Gnu": "https://yt3.googleusercontent.com/4AHghFBQs4RfJ16vtgceDtOCVbAn61Xzr4U7EJhljHYSSWAOx2M4u6nsn0yRaQX5GeADifcigA=s160-c-k-c0x00ffffff-no-rj",
    "jo0ji": "https://yt3.googleusercontent.com/n9yAywgMS3EaQyvNg7MKxuTk4-XcQIw1lk1HDUPcqNZgN0lqPMcxRDb1F9bDA16c7j28KR6lOw=s160-c-k-c0x00ffffff-no-rj",
    "Yuuri": "https://yt3.googleusercontent.com/2j-yd5HnUHfzfbaptBikd2RVnGbzG6aQIycm8bT4RIz-beNCkwJsN2HVTQreEds014WOMrM5=s160-c-k-c0x00ffffff-no-rj",
    "YOASOBI": "https://yt3.googleusercontent.com/WrZt7XVfe0ZoFRtYCxbOM0gSWp2baxrwxw4o1HQIPJZvamwJXHj6dLjbtJmn369lnl8GdY1k=s160-c-k-c0x00ffffff-no-rj",
    "なとり": "https://yt3.googleusercontent.com/J6_BVxjxCBt3kslrm9NmcQZDnlg9H-kJn6bznelnDNSfNzw-fXFHbXKKo-wnKIHzh72IDlfrFA=s120-c-k-c0x00ffffff-no-rj",
    "정용화×優里": "https://yt3.googleusercontent.com/CI2JL6tLJI-mWcC6MQDgSQbFtu7vLlVOkVNBvNKEofuCNiw1o6r3M2xstj3BA5ZOgfAWojZBFA=s160-c-k-c0x00ffffff-no-rj",
    "ZICOxikura": "https://yt3.googleusercontent.com/tQHyy6KcPHgXYWdF_bs40_VLNC5GFVdeKS9mI4xrQEozNTpAkYUow9qmAOHa4FJcoQpHmwuM=s160-c-k-c0x00ffffff-no-rj",
    "優里": "https://yt3.googleusercontent.com/2j-yd5HnUHfzfbaptBikd2RVnGbzG6aQIycm8bT4RIz-beNCkwJsN2HVTQreEds014WOMrM5=s160-c-k-c0x00ffffff-no-rj",
    "RADWIMPS cover by.ヨルシカ": "https://yt3.googleusercontent.com/ytc/AIdro_kVKEa-EG-3DL3jnIwzZ13S4zo8G57by8Gq-nJLBOcuqg=s160-c-k-c0x00ffffff-no-rj",
    "MIMI feat. saewool": "https://yt3.googleusercontent.com/ytc/AIdro_l4OX9vLQEk_TYhJhkefP5QVN38gYAsC0RW7tjXR2ayJn0=s160-c-k-c0x00ffffff-no-rj",
    "TOMOO": "https://yt3.googleusercontent.com/cfht6sE5jb-2cNeKsbmZeqaLVJiJ8YhUpZVrAVLXfUqEOairpbViXOakg7z_8oy_c1bq3FE9-w=s120-c-k-c0x00ffffff-no-rj",
    "yama": "https://yt3.googleusercontent.com/XVtv72Ah0GZu20K5JfXkWae6uesmmlj14QIPisMiZsg1G9JJxX4GOyYvyhqGtx4L20yPcDHLGwY=s160-c-k-c0x00ffffff-no-rj",
    "米津玄師": "https://yt3.googleusercontent.com/KxdCea1UfP3_mqg0YpOfK2ucrK7G0aDGEvn1i1VFmbp_aMk6Ftn46_DK6RfrYvi3f6rOajr9=s160-c-k-c0x00ffffff-no-rj",
    "幾田りら": "https://yt3.googleusercontent.com/8ISmpsmgQbVkzPviRJ1C8e78AwLI68ZJvLmFiqRyyMdnUXhZg1IKPUGNV1T_DUw2F-gWK-1RQQ=s160-c-k-c0x00ffffff-no-rj",
    "Myuk cover.": "https://yt3.googleusercontent.com/fpmIemwlGcWCrIQHJvrWakZd2DML4D3V6DixIJ0aAUocmBQcarPUkxs38V4ELCmzvpR92qdl=s120-c-k-c0x00ffffff-no-rj",
    "コバソロfeat. 由 -iu-": "https://yt3.googleusercontent.com/ytc/AIdro_l2Ct30OyvxG3NA-y_3rn79eJG0sygrJ66vTBxQb0J71xo=s160-c-k-c0x00ffffff-no-rj",
    "星街彗星feat. 花譜": "https://yt3.googleusercontent.com/v_xRCh0hSJZ2PtedQFYl6cw3LiFDgumn2pSAEC2iYl_E7oLkyomC-_TdqcR_h_PBj11Xotm5oA=s160-c-k-c0x00ffffff-no-rj",
    "Shiori Shinomiya": "https://yt3.googleusercontent.com/0uEIN4u6ft5WuZrVVSwSlqt5b4Z7uyEWfc3VnkK5OI1UfjZ0rkDnF7wF9PbuH-77TEFNFw4a=s160-c-k-c0x00ffffff-no-rj",
    "水曜日のカンパネラ": "https://yt3.googleusercontent.com/sD4gtEfv1GJDMMQ4Q7Rnl47Rk_LKDy15OD86bktN4yvC8c9TL9SuA6MgmiBC1pTmLIy6oMSK2g=s120-c-k-c0x00ffffff-no-rj",
    "ねぐせ。feat. 汐れいら": "https://yt3.googleusercontent.com/373lUovXQGMhoEBsv5sYnt6IdLyGY0-qsGO0XwUy1yXcpyNQkoFq60q_6uolhJUeM_AKCprStWI=s160-c-k-c0x00ffffff-no-rj",
    "miolly": "https://yt3.googleusercontent.com/vbjPrzw4ebQekJQRzmp3grVrXspTgKxvlbcPPUSEjf0-V9O40J_8EtcWRILnMWobLF6F-csJ=s160-c-k-c0x00ffffff-no-rj",
    "slept.": "https://yt3.googleusercontent.com/-eixzFlQiROuOW1GhampiTusR0CeRy7MJ7s-3fSp5IWUNwOqxDTHlAou_PY4G99Y-vE0x8l2Pw=s160-c-k-c0x00ffffff-no-rj",
    "Aimer": "https://yt3.googleusercontent.com/qCeZ61pVeoPXtSPAJSi2FhZvvekiQGvcI7cFfu-E5QmD-tOuzSjIgv1Z_ihDJfa3cXaMgOyfwNE=s160-c-k-c0x00ffffff-no-rj",
    "Mrs. GREEN APPLE": "https://yt3.googleusercontent.com/ixsKC8Mksd0R6lfouSrbFN1rAR4364efb9mmdBrsVvWv5Vj7n9fadA9HsCAUa4xSY5aLtfes=s160-c-k-c0x00ffffff-no-rj",
    "若山詩音cover": "https://yt3.googleusercontent.com/23-XWySxwPFMX6uuGpchWbPM08dHI-i4pOkUhvwRIuKKVzbj14Z-4HpXPeUlICmwr0fGz3Znxzo=s160-c-k-c0x00ffffff-no-rj",
    "7co": "https://yt3.googleusercontent.com/9LlYGiXW2-0X8HCRt9K6PzIVDPLNfj85wAGcm4Rb1MZsz7t6LNW3k0sHb2m7Ml9VcDM6G854=s160-c-k-c0x00ffffff-no-rj",
    "アイナ・ジ・エンド": "https://yt3.googleusercontent.com/mFG0RIcvTKBVW1sSsxUFLp3hp08L8N6lgagXkuKGta0X2bF0DxriwUe-DlFXdY-GSCYSrnOG=s160-c-k-c0x00ffffff-no-rj",
    "須田景凪": "https://yt3.googleusercontent.com/HvYYnhTZghzbdS3BG_9fER8yzu4ViVKfJ6B6EOJavcOa0c34jiZSrmZ75gmz4wOQ7aUQscywRw=s160-c-k-c0x00ffffff-no-rj",
    "琳子": "https://yt3.googleusercontent.com/bzKdpadakthUAYWNyJxCzl6h5quRXRaycahXitRD57uo9RxFTLvUGR2KXxn0bQlymKnOfe-FnQ=s160-c-k-c0x00ffffff-no-rj",
    "ano": "https://yt3.googleusercontent.com/4l7w-WGfTAX3xrT5ZW78pVmKjCEWlHi7sh0iqF9L1J4NUiQak-4dEmJErKNGIqBhBlA-Nr7ruQ=s160-c-k-c0x00ffffff-no-rj",
    "AKASAKI": "https://yt3.ggpht.com/4wNuhE0vMNzQvPteCcwdva6z1oqTG-GzvwKw6zzWd2FxQraM-mfDP6vV-ZWEM1Mkcd3I-5mHZcc=s48-c-k-c0x00ffffff-no-rj",
    "NOMELON NOLEMON": "https://yt3.googleusercontent.com/lCWxMo9c-jhjPch84HaQICU96NT58mXttOVo5WdgqIeEgRveZpviQebDeRlKYPG3j2P6FS53vZE=s160-c-k-c0x00ffffff-no-rj",
    "Fujii Kaze": "https://yt3.googleusercontent.com/VSJBk4QVzFUWNKryDVvVfWosYeg0NNHf1dlEJqgF65MslOdDAbIN2CVPHxV51bnTYARDWyMMewo=s160-c-k-c0x00ffffff-no-rj",
    "Awesome City Club": "https://yt3.googleusercontent.com/FMl4LJuxGG9U_1L9ZuFmeSqWkVXDXgKJWrrtpunhKukSmBLVeq50qF65-tvPsGv03sKGEDLGdw=s160-c-k-c0x00ffffff-no-rj",
    "esoragoto": "https://yt3.googleusercontent.com/K98-P0HwVVyZydOoeeaRh5lZ0tkp9qyIGK-QYwXoUXPOFJ96GyLtaQRFHr5TIZhH8-emo6Yt2w=s160-c-k-c0x00ffffff-no-rj",
    "ずっと真夜中でいいのに": "https://yt3.googleusercontent.com/ytc/AIdro_k65c3FqRpwfe066estQZsGjy_sBu1Y0sV_6_C23VXUlho=s160-c-k-c0x00ffffff-no-rj",
    "星街すいせい/": "https://yt3.googleusercontent.com/ytc/AIdro_kLDBK5ksSvk5-XJ6S8e0kWfjy7mVl3jyUkgDeMQ7rlCpU=s160-c-k-c0x00ffffff-no-rj",
    "星期三的康帕內拉": "https://yt3.googleusercontent.com/sD4gtEfv1GJDMMQ4Q7Rnl47Rk_LKDy15OD86bktN4yvC8c9TL9SuA6MgmiBC1pTmLIy6oMSK2g=s120-c-k-c0x00ffffff-no-rj",
    "サカナクション": "https://yt3.googleusercontent.com/4WpIWt1a2GWvn_J4ZzFUAmEfjCk7X8_-GURuRol0kr5gfslFDD7DkY3yyRaKygSrLLKg9NPe_ew=s160-c-k-c0x00ffffff-no-rj",
    "eill": "https://yt3.googleusercontent.com/vQX7L4hlT517EDTblWgc21lN8_1-ABdB0W4fZNfI0Wj4sjNuZL3teMsWfd0AGYm9qvLbtVWNvg=s160-c-k-c0x00ffffff-no-rj",
    "SUPERBEAVER": "https://yt3.googleusercontent.com/tGJeGfd2d6jkV73ETQg38KiV3W3ZrZ7m_j9rQBx39CinLnnOPjPIObXDkWsm3s8uznINq_grpg=s160-c-k-c0x00ffffff-no-rj",
    "Chevon": "https://yt3.googleusercontent.com/erRZ_-vlA6ZY7yjVkBP50Oocph0KxWKTzm5f8uPOAv87k688YKQx1hf7RXMqBMqY-wZOl4HM=s160-c-k-c0x00ffffff-no-rj",
    "yama✕WurtS": "https://yt3.googleusercontent.com/gPlnR1luCJOw4lzOYHUi3hGOf7lnd4h-KzBljCywpF6TQT_87Xdzisn25htWkEHPt93HTv2v_w=s120-c-k-c0x00ffffff-no-rj",
    "星野源": "https://yt3.googleusercontent.com/-VWSeEPw96gcVG14L4oYfuq-0veCaNz5RdTGeJV3vs9cDvvjNBCYwnXXMAdki5Exne9gMUZFUA=s160-c-k-c0x00ffffff-no-rj",
    "indigo la Endfeat.にしな": "https://yt3.googleusercontent.com/ytc/AIdro_l9MUVXu_P02IPN7TzOLd2VZRbpNwdu3cCjIEbOiLxujVg=s160-c-k-c0x00ffffff-no-rj",
    "シド": "https://yt3.googleusercontent.com/ytc/AIdro_lvgt98jmJ3doZcTAKmgT8be1XiouEm8Y1sVIU6B1jLHg=s120-c-k-c0x00ffffff-no-rj"
    // 未來只要把新發現的愛用歌手網址存到這裡即可！
};

// --- 3. 主要初始化邏輯 ---
document.addEventListener('DOMContentLoaded', () => {
    
    createComplexBackground(); // 啟動星空
    typeWriterEffect();        // 啟動打字機

    // 漢堡選單控制
    const menu = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('#nav-list');
    if (menu && navLinks) {
        menu.addEventListener('click', () => {
            menu.classList.toggle('is-active');
            navLinks.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', (e) => {
            if (n.id === 'monthly-menu-toggle') return; // 點擊展開次選單時不關閉整個選單
            menu.classList.remove('is-active');
            navLinks.classList.remove('active');
        }));
    }

    // === 漢堡選單的「每月推薦」下拉選單邏輯 ===
    const monthlyMenuToggle = document.getElementById('monthly-menu-toggle');
    const monthlySubmenu = document.getElementById('monthly-submenu');
    if (monthlyMenuToggle && monthlySubmenu) {
        monthlyMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            monthlySubmenu.classList.toggle('active');
            const icon = monthlyMenuToggle.querySelector('i');
            if (icon) {
                if (monthlySubmenu.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    }

    // === 動態渲染每月推薦資料 (Data-Driven) ===
    const contentContainer = document.getElementById('dynamic-content-container');
    const tabsContainer = document.getElementById('month-tabs-container');

    if (contentContainer && tabsContainer && typeof monthlyData !== 'undefined') {
        let tabsHtml = '';
        let contentsHtml = '';
        let isFirst = true; // 第一個月預設開啟

        for (const [monthId, data] of Object.entries(monthlyData)) {
            const activeClass = isFirst ? 'active' : '';
            
            // 生成上方標籤
            tabsHtml += `<a href="#${monthId}" class="month-tab ${activeClass}" data-target="${monthId}">${data.title}</a>`;

            // 生成右側歌曲列表
            let songsHtml = '';
            data.songs.forEach(song => {
                // 自動配對頭貼：如果沒有指定 avatar (或是出現預設的'請替換')，就從字典裡找。若都沒有則給預設圖。
                const avatarUrl = (song.avatar && !song.avatar.includes("請替換")) ? song.avatar : (artistAvatarDB[song.artist] || 'img/default-avatar.jpg');

                songsHtml += `
                <section class="song-block">
                    <span class="song-no">${song.no}</span>
                    <div class="song-header-row">
                        <div class="song-title-group">
                            <h2 class="song-name">${song.name}</h2>
                            <h3 class="artist-name">${song.artist}</h3>
                        </div>
                        <img src="${avatarUrl}" alt="${song.artist}" class="artist-avatar" loading="lazy">
                    </div>
                    <a href="https://youtu.be/${song.ytId}" target="_blank" class="yt-mv-link">
                        <img src="https://img.youtube.com/vi/${song.ytId}/maxresdefault.jpg" alt="${song.name} MV" loading="lazy">
                        <div class="play-overlay"><i class="fab fa-youtube"></i> 前往 YouTube 觀看 MV</div>
                    </a>
                    <p class="song-desc">${song.desc}</p>
                    <div class="song-info-row"><span>上架日期：${song.date}</span></div>
                </section>`;
            });

            // 生成該月份的完整版面
            contentsHtml += `
            <div id="${monthId}" class="month-content ${activeClass}">
                <main class="monthly-split-layout">
                    <div class="vertical-title">今月の推薦</div>
                    <aside class="left-visual">
                        <div class="sticky-wrapper">
                            <div class="gold-ring"></div>
                            <figure class="hero-figure">
                                <img src="${data.coverImg}" alt="${data.title}推薦封面" class="fixed-cover" decoding="async">
                                <figcaption class="visual-footer">
                                    <p class="theme-tag">${data.tag}</p>
                                    <p class="monthly-review">${data.review}</p>
                                </figcaption>
                            </figure>
                        </div>
                    </aside>
                    <article class="right-content">
                        ${songsHtml}
                        <div class="playlist-link-section">
                            <p>探索完整歌單</p>
                            <a href="https://www.youtube.com/@%E9%9F%B3%E6%A8%82%E5%B9%BD%E6%B5%AE" target="_blank" class="yt-button">
                                <i class="fab fa-youtube"></i>
                                <span>LISTEN ON YOUTUBE</span>
                            </a>
                        </div>
                    </article>
                </main>
            </div>`;
            isFirst = false;
        }
        
        tabsContainer.innerHTML = tabsHtml;
        contentContainer.innerHTML = contentsHtml;
    }

    // === 每月推薦頁面的「月份無縫切換」邏輯 ===
    function switchMonth(targetId) {
        if (!document.getElementById(targetId)) return;
        
        // 因為是動態生成的，所以要在點擊時重新抓取 DOM 元素
        const monthContents = document.querySelectorAll('.month-content');
        const monthTabs = document.querySelectorAll('.month-tab');

        // 隱藏所有內容，移除所有 active 樣式
        monthContents.forEach(content => content.classList.remove('active'));
        monthTabs.forEach(tab => tab.classList.remove('active'));

        // 顯示目標並加亮 tab
        document.getElementById(targetId).classList.add('active');
        document.querySelectorAll(`.month-tab[data-target="${targetId}"]`).forEach(tab => {
            tab.classList.add('active');
        });

        // 切換後回到頂端
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // === 主題歌單渲染與切換邏輯 ===
    const themeGridContainer = document.getElementById('theme-grid-container');
    const themeDetailContainer = document.getElementById('theme-detail-container');
    const themePlaylistsSection = document.getElementById('theme-playlists');

    if (themeGridContainer && typeof themeData !== 'undefined') {
        // 1. 動態渲染首頁 3排1個 的 Grid 卡片
        let gridHtml = '';
        for (const [themeId, data] of Object.entries(themeData)) {
            gridHtml += `
                <a href="#${themeId}" class="theme-card">
                    <div class="theme-img-wrapper">
                        <img src="${data.coverImg}" alt="${data.title}" loading="lazy">
                        <div class="theme-hover-overlay"></div>
                    </div>
                    <h3 class="theme-card-title">${data.title}</h3>
                </a>
            `;
        }
        themeGridContainer.innerHTML = gridHtml;

        // 2. 渲染並切換到主題詳細內容 (無影片版)
        function switchTheme(hash) {
            const themeId = hash.substring(1);
            
            // 如果回到空 Hash，顯示卡片總覽，隱藏詳細內容
            if (!themeId || !themeData[themeId]) {
                themePlaylistsSection.style.display = 'block';
                themeDetailContainer.style.display = 'none';
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // 隱藏卡片總覽，顯示詳細內容
            themePlaylistsSection.style.display = 'none';
            themeDetailContainer.style.display = 'block';
            
            const data = themeData[themeId];
            let songsHtml = '';
            
            data.songs.forEach(song => {
                // 若有 ytId 則抓取 YouTube 預覽圖，否則退回使用頭貼
                const coverUrl = song.ytId ? `https://img.youtube.com/vi/${song.ytId}/hqdefault.jpg` : ((song.avatar && !song.avatar.includes("請替換")) ? song.avatar : (artistAvatarDB[song.artist] || 'img/default-avatar.jpg'));
                songsHtml += `
                <section class="song-block">
                    <span class="song-no">${song.no}</span>
                    <div class="song-header-row">
                        <div class="song-title-group">
                            <h2 class="song-name">${song.name}</h2>
                            <h3 class="artist-name">${song.artist}</h3>
                        </div>
                        <img src="${coverUrl}" alt="${song.name}" class="song-preview-cover" loading="lazy">
                    </div>
                    <p class="song-desc" style="margin-top: 15px;">${song.desc}</p>
                </section>`;
            });

            // 組合出跟「每月推薦」一樣的版型，但上面多一個「返回按鈕」
            themeDetailContainer.innerHTML = `
            <div style="padding: 0 8%; margin-top: 2rem;">
                <a href="#" class="yt-button" style="border-color: var(--k-gold); color: var(--k-gold); padding: 10px 20px; display: inline-block;">
                    <i class="fas fa-arrow-left"></i> 返回主題列表
                </a>
            </div>
            <main class="monthly-split-layout" style="padding-top: 2rem;">
                <div class="vertical-title">主題推薦</div>
                <aside class="left-visual">
                    <div class="sticky-wrapper" style="top: calc(var(--nav-height) + 20px);">
                        <div class="gold-ring"></div>
                        <figure class="hero-figure">
                            <img src="${data.coverImg}" alt="${data.title}" class="fixed-cover" decoding="async">
                            <figcaption class="visual-footer">
                                <p class="theme-tag">${data.tag}</p>
                                <p class="monthly-review">${data.review}</p>
                            </figcaption>
                        </figure>
                    </div>
                </aside>
                <article class="right-content">
                    ${songsHtml}
                    <div class="playlist-link-section">
                        <p>探索完整歌單</p>
                        <a href="${data.playlistUrl || 'https://www.youtube.com/@%E9%9F%B3%E6%A8%82%E5%B9%BD%E6%B5%AE'}" target="_blank" class="yt-button">
                            <i class="fab fa-youtube"></i>
                            <span>LISTEN ON YOUTUBE</span>
                        </a>
                    </div>
                </article>
            </main>`;
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // 監聽網址 Hash 改變 (點擊選單或標籤列時觸發)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash.startsWith('month-')) switchMonth(hash);
        
        // 主題頁面的 hash 判斷
        if (window.location.pathname.includes('playlist.html')) {
            if (window.location.hash.startsWith('#theme-') || window.location.hash === '') {
                switchTheme(window.location.hash);
            }
        }
    });

    // 初始載入時檢查網址 Hash
    if (window.location.hash && window.location.hash.startsWith('#month-')) {
        switchMonth(window.location.hash.substring(1));
    }
    if (window.location.pathname.includes('playlist.html') && window.location.hash.startsWith('#theme-')) {
        switchTheme(window.location.hash);
    }

    // 啟動按鈕：顯示 2x2 選單
    const startBtn = document.getElementById('start-btn');
    const heroSection = document.querySelector('.hero');
    if (startBtn && heroSection) {
        startBtn.addEventListener('click', () => {
            heroSection.classList.add('show-menu');
        });
    }

    // 捲動特效：Logo 變淡 + 外框擴散消失
    const bgLogo = document.getElementById('bg-logo');
    const zoomFrame = document.getElementById('zoom-frame');

    window.addEventListener('scroll', () => {
        let scrollPos = window.scrollY;

        // 1. 背景大幽浮漸漸消失
        if (bgLogo) {
            let logoOpacity = 0.3 - (scrollPos / 500); 
            bgLogo.style.opacity = logoOpacity >= 0 ? logoOpacity : 0;
        }

        // 2. 金色外框往四周擴散放大並變透明
        if (zoomFrame) {
            let scaleValue = 1 + (scrollPos / 200);   // 放大係數
            let frameOpacity = 1 - (scrollPos / 400); // 消失速度
            if (frameOpacity >= 0) {
                // translate(-50%, -50%) 是為了維持 CSS 裡的絕對置中
                zoomFrame.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;
                zoomFrame.style.opacity = frameOpacity;
            } else {
                zoomFrame.style.opacity = 0;
            }
        }
    });
});