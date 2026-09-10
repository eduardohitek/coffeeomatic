(function () {
  const torraBank = [
    'torra clara',
    'torra média-clara',
    'torra média',
    'torra média-escura',
    'torra escura',
  ];

  const fermentacaoBank = [
    'processo natural, com secagem em coco',
    'processo lavado',
    'processo honey',
    'fermentação anaeróbica',
    'fermentação estendida em tanques',
    'processo semi-lavado (pulped natural)',
    'dupla fermentação carbônica',
  ];

  const fragranciaBank = [
    'floral, lembrando jasmim e flor de laranjeira',
    'intensamente frutada, com toques de frutas vermelhas',
    'adocicada, lembrando chocolate ao leite',
    'amadeirada e levemente especiada',
    'herbal, com um toque de ervas frescas',
    'convidativa, com toques de cacau torrado',
  ];

  const aromaBank = [
    'aroma envolvente de caramelo e nozes torradas',
    'aroma de mel e baunilha que preenchem o ambiente',
    'aroma frutado, com toques de frutas tropicais maduras',
    'perfil aromático floral intenso e persistente',
    'aromas tostados que remetem a pão fresco e cacau',
    'aroma adocicado de rapadura e especiarias',
  ];

  const acidezBank = [
    'cítrica e vibrante, lembrando limão siciliano',
    'málica, como uma maçã verde crocante',
    'tartárica, brilhante e bem definida',
    'delicada, do tipo vinosa',
    'suave, com toques de framboesa',
  ];

  const docuraBank = [
    'de caramelo, envolvente e persistente',
    'de mel silvestre, suave e equilibrada',
    'de rapadura, marcante do início ao fim',
    'de frutas maduras, generosa na xícara',
    'de açúcar mascavo, aconchegante',
  ];

  const notasBank = [
    'frutas vermelhas',
    'chocolate meio amargo',
    'caramelo',
    'amêndoas torradas',
    'laranja',
    'jasmim',
    'mel',
    'especiarias doces',
    'frutas tropicais',
    'cacau',
    'avelã',
    'baunilha',
    'maçã verde',
    'ameixa',
    'uva passa',
    'rapadura',
    'framboesa',
    'canela',
  ];

  const openerBank = [
    'Um café de',
    'Esta xícara traz',
    'Prova de',
    'Notamos um café com',
    'Um blend com',
    'Destaque para',
  ];

  function pick(bank) {
    return bank[Math.floor(Math.random() * bank.length)];
  }

  function pickUnique(bank, count) {
    const pool = [...bank];
    const result = [];
    for (let i = 0; i < count && pool.length > 0; i++) {
      const index = Math.floor(Math.random() * pool.length);
      result.push(pool.splice(index, 1)[0]);
    }
    return result;
  }

  function joinPortuguese(items) {
    if (items.length === 1) return items[0];
    return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
  }

  const categories = [
    { key: 'torra', fragment: () => pick(torraBank) },
    { key: 'fermentacao', fragment: () => pick(fermentacaoBank) },
    { key: 'fragrancia', fragment: () => `fragrância ${pick(fragranciaBank)}` },
    { key: 'aroma', fragment: () => pick(aromaBank) },
    {
      key: 'acidezDocura',
      fragment: () =>
        Math.random() < 0.5 ? `acidez ${pick(acidezBank)}` : `doçura ${pick(docuraBank)}`,
    },
    { key: 'notas', fragment: () => `notas de ${joinPortuguese(pickUnique(notasBank, 2))}` },
  ];

  function generateReview() {
    const subsetSize = 4 + Math.round(Math.random());
    const fragments = pickUnique(categories, subsetSize).map((category) => category.fragment());
    return `${pick(openerBank)} ${joinPortuguese(fragments)}.`;
  }

  const reviewText = document.getElementById('reviewText');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const themeSwatches = document.querySelectorAll('.theme-swatch');

  const THEMES = ['torrado', 'espresso', 'cappuccino'];
  const THEME_STORAGE_KEY = 'coffeeomatic-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeSwatches.forEach((swatch) => {
      swatch.setAttribute('aria-pressed', String(swatch.dataset.themeOption === theme));
    });
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
      // localStorage indisponível (modo privado, etc.) — tema simplesmente não persiste
    }
  }

  function initTheme() {
    let stored = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch (err) {
      stored = null;
    }
    applyTheme(THEMES.includes(stored) ? stored : 'torrado');
  }

  themeSwatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const theme = swatch.dataset.themeOption;
      applyTheme(theme);
      storeTheme(theme);
    });
  });

  function renderNewReview() {
    reviewText.textContent = generateReview();
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }

  function showCopiedFeedback() {
    const original = copyBtn.textContent;
    copyBtn.textContent = 'Copiado!';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 2000);
  }

  async function copyReview() {
    const text = reviewText.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
      showCopiedFeedback();
    } catch (err) {
      fallbackCopy(text);
      showCopiedFeedback();
    }
  }

  generateBtn.addEventListener('click', renderNewReview);
  copyBtn.addEventListener('click', copyReview);

  initTheme();

  document.addEventListener('DOMContentLoaded', renderNewReview);
  if (document.readyState !== 'loading') {
    renderNewReview();
  }
})();
