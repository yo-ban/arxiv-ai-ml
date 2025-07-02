// arXiv論文解説サイト - メインJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 日付フォーマット
    document.querySelectorAll('time').forEach(time => {
        const datetime = time.getAttribute('datetime');
        if (datetime) {
            const date = new Date(datetime);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            time.textContent = date.toLocaleDateString('ja-JP', options);
        }
    });

    // 数値フォーマット（カンマ区切り）
    document.querySelectorAll('[data-number]').forEach(elem => {
        const number = parseInt(elem.textContent.replace(/,/g, ''));
        if (!isNaN(number)) {
            elem.textContent = number.toLocaleString();
        }
    });
});