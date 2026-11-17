// モバイル用ナビゲーション
const menuToggle = document.querySelector('.menu-toggle');
const globalNav = document.querySelector('.global-nav');

if (menuToggle && globalNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = globalNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });
}

// お問い合わせフォームの入力チェック（デモ用）
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
  const successMessage = document.querySelector('#success-message');
  const backButton = document.querySelector('#back-to-form');

  const setError = (id, message) => {
    const element = document.querySelector(`#${id}-error`);
    if (element) element.textContent = message;
  };

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const message = document.querySelector('#message').value.trim();
    const privacy = document.querySelector('#privacy').checked;
    let isValid = true;

    ['name', 'email', 'message', 'privacy'].forEach((id) => setError(id, ''));

    if (!name) {
      setError('name', 'お名前を入力してください。');
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('email', 'メールアドレスを入力してください。');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setError('email', '正しいメールアドレスを入力してください。');
      isValid = false;
    }

    if (!message) {
      setError('message', 'お問い合わせ内容を入力してください。');
      isValid = false;
    }

    if (!privacy) {
      setError('privacy', 'プライバシーポリシーへの同意が必要です。');
      isValid = false;
    }

    if (!isValid) return;

    // 実際のメール送信処理は未接続。公開時はフォームサービス等と連携してください。
    contactForm.hidden = true;
    successMessage.hidden = false;
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  backButton.addEventListener('click', () => {
    successMessage.hidden = true;
    contactForm.hidden = false;
    contactForm.reset();
    contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
