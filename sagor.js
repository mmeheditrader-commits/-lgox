javascript:(function() {
    // আগের কোনো বট, লেজার বা স্টাইল থাকলে মুছে ফেলা
    const prevBot = document.getElementById('shakil-ai-bot');
    if (prevBot) prevBot.remove();
    const prevStyle = document.getElementById('shakil-bot-style');
    if (prevStyle) prevStyle.remove();
    const prevMarketLaser = document.getElementById('market-laser-scanner');
    if (prevMarketLaser) prevMarketLaser.remove();
    const prevModals = document.querySelectorAll('.shakil-popup');
    prevModals.forEach(m => m.remove());

    // ১. অ্যানিমেশন ও স্টাইলিং
    const style = document.createElement('style');
    style.id = 'shakil-bot-style';
    style.innerHTML = `
        /* অবতার লেজার স্ক্যান */
        @keyframes avatarLaserMove {
            0% { top: 0%; opacity: 0.3; }
            50% { top: 90%; opacity: 1; }
            100% { top: 0%; opacity: 0.3; }
        }
        /* চার্ট/মার্কেট লেজার স্ক্যান */
        @keyframes marketLaserSweep {
            0% { top: 5%; opacity: 0.2; }
            20% { opacity: 0.95; }
            50% { top: 80%; opacity: 1; }
            80% { opacity: 0.95; }
            100% { top: 5%; opacity: 0.2; }
        }
        @keyframes modalPop {
            0% { transform: translate(-50%, -50%) scale(0.75); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // ২. মার্কেট লেজার স্ক্যানার (লাইভ চার্ট স্ক্যানিং এফেক্ট)
    const marketLaser = document.createElement('div');
    marketLaser.id = 'market-laser-scanner';
    marketLaser.style.cssText = `
        display: none;
        position: fixed;
        left: 0;
        width: 100vw;
        height: 65px;
        pointer-events: none;
        z-index: 9999990;
        background: linear-gradient(to top, rgba(0, 242, 254, 0.22), transparent);
        border-bottom: 2.5px solid #00f2fe;
        box-shadow: 0 4px 22px rgba(0, 242, 254, 0.85), 0 0 35px #00f2fe;
        animation: marketLaserSweep 1.2s ease-in-out infinite alternate;
    `;
    marketLaser.innerHTML = `
        <div style="position: absolute; right: 15px; bottom: 4px; font-size: 10px; font-weight: 900; color: #00f2fe; letter-spacing: 2px; text-shadow: 0 0 8px #00f2fe; font-family: monospace;">
            SCANNING CANDLES...
        </div>
    `;
    document.body.appendChild(marketLaser);

    // ৩. ভাসমান বট উইজেট (UI Box)
    const bot = document.createElement('div');
    bot.id = 'shakil-ai-bot';
    
    const initLeft = Math.max(10, (window.innerWidth / 2) - 60);
    const initTop = Math.max(10, window.innerHeight - 270);

    bot.style.cssText = `
        position: fixed;
        left: ${initLeft}px;
        top: ${initTop}px;
        width: 122px;
        height: 172px;
        background: radial-gradient(circle at top, #0d1e30, #040912 90%);
        border: 1.5px solid #00f2fe;
        border-radius: 18px;
        box-shadow: 0 0 18px rgba(0, 242, 254, 0.5);
        z-index: 9999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 9px 6px;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        user-select: none;
        touch-action: none;
        backdrop-filter: blur(8px);
    `;

    bot.innerHTML = `
        <!-- হেডার -->
        <div style="width: 100%; display: flex; justify-content: center; align-items: center; position: relative;">
            <span style="font-size: 11.5px; font-weight: 900; color: #ffffff; letter-spacing: 0.8px;">AI BOT</span>
            <span style="position: absolute; right: 5px; font-size: 8px; color: #38bdf8; font-weight: 700;">v2</span>
        </div>

        <!-- অবতার ফ্রেম -->
        <div id="ai-avatar-frame" style="position: relative; width: 62px; height: 62px; border-radius: 50%; border: 2px solid #00f2fe; box-shadow: 0 0 10px #00f2fe; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <img src="https://i.postimg.cc/zDKXPcCk/file-000000004a748208a9e4c69ed2b91b79.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; pointer-events: none;">
            <!-- অবতার লেজার লাইন -->
            <div id="ai-laser" style="display: none; position: absolute; left: 0; width: 100%; height: 2px; background: #00f2fe; box-shadow: 0 0 8px #00f2fe, 0 0 12px #fff; animation: avatarLaserMove 1s infinite ease-in-out;"></div>
        </div>

        <!-- স্ট্যাটাস এরিয়া -->
        <div id="ai-status-area" style="height: 18px; display: flex; align-items: center; justify-content: center;">
            <span id="ai-status-text" style="font-size: 9.5px; font-weight: 800; color: #00e676; letter-spacing: 1px;">ONLINE</span>
        </div>

        <!-- স্ক্যান বাটন -->
        <button id="ai-scan-btn" style="
            width: 88%;
            height: 28px;
            background: linear-gradient(90deg, #00f2fe, #00c6ff);
            color: #030d17;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 1.2px;
            border: none;
            border-radius: 14px;
            cursor: pointer;
            box-shadow: 0 0 12px rgba(0, 242, 254, 0.7);
            outline: none;
            transition: all 0.2s;
        ">SCAN</button>
    `;
    document.body.appendChild(bot);

    // ৪. ক্যান্ডেলস্টিক সিগন্যাল পপআপ মডাল
    const signalModal = document.createElement('div');
    signalModal.className = 'shakil-popup';
    signalModal.style.cssText = `
        display: none;
        position: fixed;
        top: 36%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 295px;
        background: rgba(6, 11, 20, 0.95);
        border-radius: 20px;
        padding: 16px 10px 14px 10px;
        text-align: center;
        z-index: 10000000;
        backdrop-filter: blur(14px);
        user-select: none;
        box-sizing: border-box;
    `;
    document.body.appendChild(signalModal);

    // ৫. ক্যান্ডেলস্টিক প্যাটার্ন ডাটাবেস
    const candlestickPatterns = [
        {
            name: "HAMMER (হ্যামার)",
            action: "BUY",
            arrow: "⬆",
            btnLabel: "CALL ⬆",
            color: "#00e676",
            voice: "হ্যামার প্যাটার্ন শনাক্ত হয়েছে, আপ ট্রেড নিন"
        },
        {
            name: "SHOOTING STAR",
            action: "SELL",
            arrow: "⬇",
            btnLabel: "PUT ⬇",
            color: "#ff1a40",
            voice: "শুটিং স্টার প্যাটার্ন তৈরি হয়েছে, ডাউন ট্রেড নিন"
        },
        {
            name: "BULLISH ENGULFING",
            action: "BUY",
            arrow: "⬆",
            btnLabel: "CALL ⬆",
            color: "#00e676",
            voice: "বুলিশ এনগালফিং প্যাটার্ন, মার্কেট আপে যাবে, বাই করুন"
        },
        {
            name: "BEARISH ENGULFING",
            action: "SELL",
            arrow: "⬇",
            btnLabel: "PUT ⬇",
            color: "#ff1a40",
            voice: "বেয়ারিশ এনগালফিং প্যাটার্ন, মার্কেট ডাউনে যাবে, সেল করুন"
        },
        {
            name: "MORNING STAR",
            action: "BUY",
            arrow: "⬆",
            btnLabel: "CALL ⬆",
            color: "#00e676",
            voice: "মর্নিং স্টার প্যাটার্ন পাওয়া গেছে, নিশ্চিত বাই করুন"
        },
        {
            name: "EVENING STAR",
            action: "SELL",
            arrow: "⬇",
            btnLabel: "PUT ⬇",
            color: "#ff1a40",
            voice: "ইভনিং স্টার প্যাটার্ন তৈরি হয়েছে, নিশ্চিত সেল করুন"
        }
    ];

    // ৬. স্মুথ ড্রাগ অ্যান্ড ড্রপ (মোবাইল ও পিসির জন্য)
    let isDragging = false, dragStartX = 0, dragStartY = 0, initialLeft = 0, initialTop = 0;

    function onPointerDown(e) {
        if (e.target.id === 'ai-scan-btn') return;
        isDragging = true;
        const pageX = e.touches ? e.touches[0].clientX : e.clientX;
        const pageY = e.touches ? e.touches[0].clientY : e.clientY;
        dragStartX = pageX;
        dragStartY = pageY;
        initialLeft = bot.offsetLeft;
        initialTop = bot.offsetTop;
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const pageX = e.touches ? e.touches[0].clientX : e.clientX;
        const pageY = e.touches ? e.touches[0].clientY : e.clientY;
        bot.style.left = (initialLeft + (pageX - dragStartX)) + 'px';
        bot.style.top = (initialTop + (pageY - dragStartY)) + 'px';
    }

    function onPointerUp() { isDragging = false; }

    bot.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
    bot.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // ৭. বাংলা ভয়েস স্পিচ ইঞ্জিন
    function speakBangla(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'bn-BD';
            utter.rate = 1.0;
            utter.pitch = 1.0;
            window.speechSynthesis.speak(utter);
        }
    }

    // ৮. স্ক্যান বাটন ও প্যাটার্ন অ্যানালাইসিস লুপ
    let isWorking = false;
    const scanBtn = document.getElementById('ai-scan-btn');
    const statusArea = document.getElementById('ai-status-area');
    const laser = document.getElementById('ai-laser');

    scanBtn.addEventListener('click', () => {
        if (isWorking) return;
        isWorking = true;

        // বাটনে SCANNING ও লেজার স্ক্যানার সক্রিয়
        scanBtn.innerText = "SCANNING";
        scanBtn.style.background = "#05111d";
        scanBtn.style.color = "#00f2fe";
        scanBtn.style.border = "1.5px solid #00f2fe";
        scanBtn.style.boxShadow = "0 0 10px rgba(0, 242, 254, 0.4)";
        
        laser.style.display = "block";           // অবতার লেজার অন
        marketLaser.style.display = "block";     // মার্কেট ক্যান্ডেল লেজার অন

        // ধাপ ১: AI ANALYZING
        statusArea.innerHTML = `<span style="font-size: 8px; font-weight: 800; color: #00f2fe; letter-spacing: 0.8px;">AI ANALYZING</span>`;

        // ধাপ ২: ক্যান্ডেল স্ক্যানિંગ (১.১ সেকেন্ড পর)
        setTimeout(() => {
            statusArea.innerHTML = `<span style="font-size: 8px; font-weight: 800; color: #38bdf8; letter-spacing: 0.8px;">SCANNING CANDLE</span>`;
        }, 1100);

        // ধাপ ৩: প্যাটার্ন ম্যাচিং (২.২ সেকেন্ড পর)
        setTimeout(() => {
            statusArea.innerHTML = `<span style="font-size: 8px; font-weight: 800; color: #facc15; letter-spacing: 0.8px;">PATTERN MATCHED</span>`;
        }, 2200);

        // ধাপ ৪: ক্যান্ডেলস্টিক প্যাটার্ন সিগন্যাল আউটপুট (৩.২ সেকেন্ডে)
        setTimeout(() => {
            laser.style.display = "none";
            marketLaser.style.display = "none";

            // ক্যান্ডেলস্টিক প্যাটার্ন নির্বাচন
            const pattern = candlestickPatterns[Math.floor(Math.random() * candlestickPatterns.length)];
            const isBuy = pattern.action === "BUY";

            // সিগন্যাল মডাল ডিজাইন (কালার ও শ্যাডো)
            signalModal.style.border = `2.5px solid ${pattern.color}`;
            signalModal.style.boxShadow = `0 0 35px ${pattern.color}cc, inset 0 0 15px ${pattern.color}33`;
            
            signalModal.innerHTML = `
                <div style="font-size: 11px; font-weight: 800; color: #cbd5e1; letter-spacing: 1.5px; margin-bottom: 5px;">
                    PATTERN: <span style="color: ${pattern.color};">${pattern.name}</span>
                </div>
                <div style="font-size: 32px; font-weight: 900; color: ${pattern.color}; text-shadow: 0 0 16px ${pattern.color}; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span style="font-size: 24px;">$</span> ${pattern.action} 
                    <span style="background: ${pattern.color}; color: ${isBuy ? '#000' : '#fff'}; border-radius: 50%; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 0 12px ${pattern.color};">${pattern.arrow}</span>
                </div>
                <div style="font-size: 11px; font-weight: 800; color: #94a3b8; letter-spacing: 3px; margin-top: 6px;">AI SIGNAL • 98%</div>
            `;
            signalModal.style.display = "block";
            signalModal.style.animation = "modalPop 0.3s ease-out";

            // বট উইজেটে ব্যাজ (CALL ⬆ অথবা PUT ⬇)
            statusArea.innerHTML = `
                <div style="background: #081626; border: 1.2px solid ${pattern.color}; border-radius: 10px; padding: 1px 8px; font-size: 8.5px; font-weight: 900; color: ${pattern.color}; letter-spacing: 0.8px;">
                    ${pattern.btnLabel}
                </div>
            `;

            // বাটন নরমাল অবস্থায় ফেরা
            scanBtn.innerText = "SCAN";
            scanBtn.style.background = "linear-gradient(90deg, #00f2fe, #00c6ff)";
            scanBtn.style.color = "#030d17";
            scanBtn.style.border = "none";
            scanBtn.style.boxShadow = "0 0 12px rgba(0, 242, 254, 0.7)";

            // প্যাটার্ন অনুযায়ী স্পষ্ট বাংলা ভয়েস
            speakBangla(pattern.voice);

            // ৮ সেকেন্ড পর সিগন্যাল মডাল বন্ধ হয়ে বট ONLINE অবস্থায় যাবে
            setTimeout(() => {
                signalModal.style.display = "none";
                statusArea.innerHTML = `<span id="ai-status-text" style="font-size: 9.5px; font-weight: 800; color: #00e676; letter-spacing: 1px;">ONLINE</span>`;
                isWorking = false;
            }, 8000);

        }, 3200);
    });

    speakBangla("ক্যান্ডেলস্টিক এআই বট সক্রিয় হয়েছে");
})();