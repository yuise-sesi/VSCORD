document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // 1. ヘッダーのスマート・スクロールエフェクト
    // --------------------------------------------------------
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        // 50px以上スクロールしたら「scrolled」クラスを付与
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --------------------------------------------------------
    // 2. 上品なスクロールフェードイン (Intersection Observer)
    // --------------------------------------------------------
    const observerOptions = {
        root: null,          // ビューポート（画面）を基準にする
        rootMargin: '0px',   // 画面にぴったり入ったタイミング
        threshold: 0.1       // 要素が10%見えたら実行
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面内に入ったら表示用のクラスを付与
                entry.target.classList.add('is-visible');
                // 一度表示されたら監視を解除して負荷を減らす
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // アニメーションさせたい要素をまとめて指定
    const fadeElements = document.querySelectorAll('.hero, .products h2, .product-item');
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in-target'); // あらかじめ初期状態用のクラスを付与
        fadeInObserver.observe(el);         // 監視を開始
    });
});