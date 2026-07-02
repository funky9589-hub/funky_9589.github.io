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

// {{ARTIST_AVATAR_DB}}

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
        let firstMonthId = '';
        let firstMonthTitle = '';

        for (const [monthId, data] of Object.entries(monthlyData)) {
            const activeClass = isFirst ? 'active' : '';
            if (isFirst) {
                firstMonthId = monthId;
                firstMonthTitle = data.title;
            }
            
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

        // 初始載入若無 hash，預設載入第一個月份的留言板
        if (!window.location.hash || !window.location.hash.startsWith('#month-')) {
            loadCusdis(firstMonthId, firstMonthTitle);
        }
    }

    // === Cusdis 留言板動態載入邏輯 ===
    function loadCusdis(pageId, pageTitle) {
        const container = document.getElementById('cusdis-container');
        if (!container) return;

        container.innerHTML = `
            <div id="cusdis_thread"
              data-host="https://cusdis.com"
              data-app-id="0c36c1ed-74b8-420e-a0ec-299bd816afe8"
              data-page-id="${pageId}"
              data-page-url="${window.location.origin}${window.location.pathname}#${pageId}"
              data-page-title="${pageTitle}"
              data-theme="dark"
              style="width: 100%; min-height: 150px; margin-top: 20px;"
            ></div>
        `;

        // 如果 Cusdis 腳本已經載入完成，呼叫它的初始化函數重新渲染
        if (window.CUSDIS && typeof window.CUSDIS.initial === 'function') {
            window.CUSDIS.initial();
        }
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

        // 載入該月份的 Cusdis 留言板
        if (typeof monthlyData !== 'undefined' && monthlyData[targetId]) {
            loadCusdis(targetId, monthlyData[targetId].title);
        }

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
            </main>
            
            <!-- 留言交流區 -->
            <div class="comments-section" style="max-width: 1200px; margin: 40px auto; padding: 0 5%; clear: both;">
                <h2 style="font-family: 'Times New Roman', serif, '微軟正黑體'; color: var(--k-gold); border-bottom: 1px solid rgba(197,160,89,0.3); padding-bottom: 10px; margin-bottom: 20px; font-size: 1.5rem;"><i class="far fa-comments"></i> 留言交流區</h2>
                <div id="cusdis-container"></div>
            </div>`;
            
            // 載入該主題的 Cusdis 留言板
            loadCusdis(themeId, data.title);
            
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