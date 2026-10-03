import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = fileURLToPath(new URL('..', import.meta.url));
const postsDir = join(root, 'blog/posts');
const SITE = 'https://tianxiangacupuntura.com.br';
const CLINICA_ID = `${SITE}/#clinica`;
const WHATS = '5511988322921';
const LOGO = `${SITE}/brand_assets/logo-mark-tinta.webp`;
const CTA_MARCADOR = '<!-- cta -->';
const AUTORES = {
  diego: { nome: 'Diego Rodrigues', cargo: 'Acupunturista e terapeuta em Medicina Tradicional Chinesa', bio: 'Acupunturista e terapeuta em Medicina Tradicional Chinesa. Fundador da TianXiang, no Jardim Aurélia, em Campinas.', foto: '/brand_assets/avatar-diego.webp' },
  monica: { nome: 'Mônica Rodrigues', cargo: 'Acupunturista, terapeuta e massoterapeuta', bio: 'Acupunturista, terapeuta e massoterapeuta da TianXiang, especialista em massagens relaxantes e terapêuticas.', foto: '/brand_assets/avatar-monica.webp' },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');
const zap = (texto) => `https://wa.me/${WHATS}?text=${encodeURIComponent(texto)}`;
const dataBR = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const textoPuro = (md) => md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`>#]/g, '').replace(/\s+/g, ' ').trim();

function lerPost(bruto, arquivo) {
  const m = bruto.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${arquivo}: frontmatter ausente`);
  const meta = Object.fromEntries(m[1].split('\n').filter(Boolean).map((l) => {
    const i = l.indexOf(':');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"(.*)"$/, '$1')];
  }));
  for (const k of ['slug', 'title', 'seoTitle', 'description', 'category', 'categorySlug', 'date', 'condition']) {
    if (!meta[k]) throw new Error(`${arquivo}: campo "${k}" ausente`);
  }
  if (meta.seoTitle.length > 60) throw new Error(`${arquivo}: seoTitle com ${meta.seoTitle.length} caracteres (máx 60)`);
  if (meta.description.length > 155) throw new Error(`${arquivo}: description com ${meta.description.length} caracteres (máx 155)`);
  const corpo = m[2].trim();
  if (meta.draft === 'true') return null;
  const autor = AUTORES[meta.author || 'diego'];
  if (!autor) throw new Error(`${arquivo}: autor "${meta.author}" desconhecido`);
  return { ...meta, arquivo, autor, updated: meta.updated || meta.date, corpo, palavras: corpo.split(/\s+/).length };
}

function extrairFaq(md) {
  const i = md.search(/^## Perguntas frequentes/m);
  if (i < 0) return [];
  const bloco = md.slice(i).split(/\n## /)[0];
  return [...bloco.matchAll(/^### (.+)\n+([\s\S]+?)(?=\n### |\s*$)/gm)].map(([, q, a]) => ({ q: q.trim(), a: textoPuro(a) }));
}

const cabecalho = `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="container">
    <a class="marca" href="/" aria-label="TianXiang Acupuntura, início">
      <img src="/brand_assets/logo-mark-tinta-96.webp" alt="" width="48" height="48">
      <span>TianXiang<small>Acupuntura e Terapias Naturais</small></span>
    </a>
    <nav class="menu" aria-label="Principal">
      <a href="/#acupuntura-em-campinas">Acupuntura</a>
      <a href="/#tratamentos-dores-cronicas">Dores crônicas</a>
      <a href="/#terapias-complementares">Terapias</a>
      <a href="/#massoterapia">Massoterapia</a>
      <a href="/#quick-massage-empresas">Empresas</a>
      <a href="/blog/">Blog</a>
      <a href="/#contato">Contato</a>
    </nav>
    <a class="btn btn-selo" href="${zap('Olá! Gostaria de agendar uma avaliação na TianXiang.')}" target="_blank" rel="noopener">Agendar pelo WhatsApp</a>
  </div>
</header>`;

const rodape = `<footer class="rodape">
  <div class="container">
    <div>
      <img class="logo-claro" src="/brand_assets/logo-mark-papel-96.webp" alt="TianXiang" width="72" height="72" loading="lazy">
      <p style="margin-top: var(--s2); max-width: 36ch;">TianXiang Acupuntura e Terapias Naturais. Acupuntura, massoterapia e Medicina Tradicional Chinesa em Campinas.</p>
    </div>
    <div>
      <h2>Onde estamos</h2>
      <address>
        Av. Nossa Senhora da Consolação, 431, sala 4<br>
        Jardim Aurélia, Campinas-SP, 13033-140<br>
        Segunda a sábado, manhã e tarde<br>
        <a href="https://wa.me/${WHATS}" target="_blank" rel="noopener">WhatsApp (11) 98832-2921</a>
      </address>
    </div>
    <div>
      <h2>Navegue</h2>
      <ul>
        <li><a href="/#acupuntura-em-campinas">Acupuntura em Campinas</a></li>
        <li><a href="/#tratamentos-dores-cronicas">Tratamento de dores crônicas</a></li>
        <li><a href="/#massoterapia">Massoterapia</a></li>
        <li><a href="/#quick-massage-empresas">Quick massage para empresas</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="https://www.instagram.com/acupuntura_tianxiang/" target="_blank" rel="noopener">Instagram @acupuntura_tianxiang</a></li>
      </ul>
    </div>
    <p class="base">© ${new Date().getFullYear()} TianXiang Acupuntura e Terapias Naturais. As terapias complementam e não substituem o acompanhamento médico.</p>
  </div>
</footer>
<a class="btn btn-selo zap-fixo" href="${zap('Olá! Gostaria de agendar uma avaliação na TianXiang.')}" target="_blank" rel="noopener">Agendar pelo WhatsApp</a>`;

function cta(post, variante) {
  const textos = {
    meio: ['Quer saber se o seu caso responde bem a esse tratamento?', 'A avaliação inicial mapeia a origem da dor e define o plano de sessões.'],
    fim: ['Comece pela avaliação.', 'Conte pelo WhatsApp o que você sente. Respondemos com os horários disponíveis no Jardim Aurélia.'],
  }[variante];
  return `<aside class="cta" aria-label="Agendar avaliação">
  <div>
    <p class="cta-titulo">${textos[0]}</p>
    <p>${textos[1]}</p>
  </div>
  <a class="btn btn-selo" href="${zap(`Olá! Li o artigo "${post.title}" e gostaria de agendar uma avaliação.`)}" target="_blank" rel="noopener">Agende sua Avaliação em Campinas</a>
</aside>`;
}

function head({ titulo, descricao, url, tipo, ld, extraCss = true }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NST2R6LC');</script>
<!-- End Google Tag Manager -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="geo.region" content="BR-SP">
<meta name="geo.placename" content="Campinas">
<meta name="theme-color" content="#F6F1E7">
<meta property="og:type" content="${tipo}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="TianXiang Acupuntura">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${LOGO}">
<link rel="icon" type="image/png" href="/brand_assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
${extraCss ? '<link rel="stylesheet" href="/assets/blog.css">' : ''}
${ld ? `<script type="application/ld+json">\n${jsonLd(ld)}\n</script>` : ''}
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NST2R6LC"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}

function paginaPost(post, todos) {
  const url = `${SITE}/blog/${post.slug}/`;
  const faq = extrairFaq(post.corpo);
  let html = marked.parse(post.corpo);
  if (!html.includes(CTA_MARCADOR)) throw new Error(`${post.slug}: falta o marcador ${CTA_MARCADOR} no meio do texto`);
  html = html.replace(CTA_MARCADOR, cta(post, 'meio'));
  html = html.replace('<h2>Perguntas frequentes</h2>', '<h2 id="perguntas-frequentes">Perguntas frequentes</h2>');
  const minutos = Math.max(1, Math.round(post.palavras / 200));

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
          { '@type': 'ListItem', position: 3, name: post.category, item: `${SITE}/blog/#${post.categorySlug}` },
          { '@type': 'ListItem', position: 4, name: post.title, item: url },
        ],
      },
      {
        '@type': 'Article',
        '@id': `${url}#artigo`,
        headline: post.title,
        description: post.description,
        inLanguage: 'pt-BR',
        datePublished: post.date,
        dateModified: post.updated,
        wordCount: post.palavras,
        image: LOGO,
        mainEntityOfPage: { '@id': `${url}#pagina` },
        author: { '@type': 'Person', name: post.autor.nome, jobTitle: post.autor.cargo, worksFor: { '@id': CLINICA_ID } },
        publisher: { '@type': 'Organization', '@id': CLINICA_ID, name: 'TianXiang Acupuntura e Terapias Naturais', logo: { '@type': 'ImageObject', url: LOGO } },
      },
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#pagina`,
        url,
        name: post.seoTitle,
        inLanguage: 'pt-BR',
        about: { '@type': 'MedicalCondition', name: post.condition },
        audience: { '@type': 'Patient' },
        lastReviewed: post.updated,
        reviewedBy: { '@type': 'Person', name: post.autor.nome },
        isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#site` },
      },
      ...(faq.length ? [{
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }] : []),
    ],
  };

  const outros = todos.filter((p) => p.slug !== post.slug)
    .sort((a, b) => (b.categorySlug === post.categorySlug) - (a.categorySlug === post.categorySlug))
    .slice(0, 4);
  return `${head({ titulo: post.seoTitle, descricao: post.description, url, tipo: 'article', ld })}
${cabecalho}
<main id="conteudo">
  <div class="container">
    <nav class="migalhas" aria-label="Você está em">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/blog/#${post.categorySlug}">${esc(post.category)}</a></li>
        <li><span aria-current="page">${esc(post.title)}</span></li>
      </ol>
    </nav>
  </div>
  <article>
    <header class="artigo-topo">
      <div class="container">
        <a class="categoria" href="/blog/#${post.categorySlug}">${esc(post.category)}</a>
        <h1>${esc(post.title)}</h1>
        <p class="resumo">${esc(post.description)}</p>
        <div class="artigo-meta">
          <span>Por <strong>${post.autor.nome}</strong></span>
          <span>Publicado em <time datetime="${post.date}">${dataBR(post.date)}</time></span>
          <span>${minutos} min de leitura</span>
        </div>
      </div>
    </header>
    <div class="artigo-corpo">
      <div class="container">
        <div class="prosa">
${html}
${cta(post, 'fim')}
        </div>
        <p class="aviso-saude"><strong>Aviso:</strong> este conteúdo é informativo e não substitui consulta médica. As terapias da Medicina Chinesa complementam o acompanhamento médico. Não interrompa medicamentos sem orientação do seu médico.</p>
        <div class="autor">
          <img src="${post.autor.foto}" alt="" width="72" height="72" loading="lazy">
          <div><strong>${post.autor.nome}</strong><span>${post.autor.bio}</span></div>
        </div>
      </div>
    </div>
  </article>
  ${outros.length ? `<section class="relacionados" aria-labelledby="t-relacionados">
    <div class="container">
      <h2 id="t-relacionados">Continue lendo</h2>
      <ul class="lista-artigos">
${outros.map(cartao).join('\n')}
      </ul>
    </div>
  </section>` : ''}
</main>
${rodape}
</body>
</html>
`;
}

function cartao(p) {
  return `        <li class="cartao-artigo"><a href="/blog/${p.slug}/"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><span class="ler">Ler artigo</span></a></li>`;
}

function paginaIndice(posts) {
  const url = `${SITE}/blog/`;
  const ordem = ['tratamentos', 'terapias-complementares', 'massoterapia', 'esporte-e-recuperacao', 'para-empresas'];
  const peso = (slug) => (ordem.includes(slug) ? ordem.indexOf(slug) : ordem.length);
  const categorias = [...new Map(posts.map((p) => [p.categorySlug, p.category]))].sort((a, b) => peso(a[0]) - peso(b[0]));
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: url },
      ] },
      { '@type': 'Blog', '@id': `${url}#blog`, url, name: 'Blog da TianXiang Acupuntura', inLanguage: 'pt-BR', publisher: { '@id': CLINICA_ID },
        blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.date })) },
    ],
  };
  return `${head({ titulo: 'Blog sobre Acupuntura e Dor Crônica | TianXiang', descricao: 'Artigos sobre acupuntura, dor crônica, massoterapia e Medicina Tradicional Chinesa, escritos pela equipe da TianXiang, em Campinas.', url, tipo: 'website', ld })}
${cabecalho}
<main id="conteudo">
  <div class="container">
    <nav class="migalhas" aria-label="Você está em">
      <ol><li><a href="/">Home</a></li><li><span aria-current="page">Blog</span></li></ol>
    </nav>
    <header class="blog-topo">
      <h1>Blog da TianXiang</h1>
      <p>Como a Medicina Tradicional Chinesa explica a dor, e o que fazemos no consultório para tratá-la.</p>
    </header>
${categorias.map(([slug, nome]) => `    <section class="categoria-bloco" id="${slug}" aria-labelledby="t-${slug}">
      <h2 id="t-${slug}">${esc(nome)}</h2>
      <ul class="lista-artigos">
${posts.filter((p) => p.categorySlug === slug).map(cartao).join('\n')}
      </ul>
    </section>`).join('\n')}
  </div>
</main>
${rodape}
</body>
</html>
`;
}

function sitemap(posts) {
  const urls = [
    { loc: `${SITE}/`, lastmod: new Date().toISOString().slice(0, 10), prio: '1.0' },
    { loc: `${SITE}/blog/`, lastmod: posts.reduce((m, p) => (p.updated > m ? p.updated : m), '1970-01-01'), prio: '0.8' },
    ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}/`, lastmod: p.updated, prio: '0.7' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.prio}</priority>\n  </url>`).join('\n')}
</urlset>
`;
}

const arquivos = (await readdir(postsDir)).filter((f) => f.endsWith('.md')).sort();
const posts = [];
for (const f of arquivos) {
  const p = lerPost(await readFile(join(postsDir, f), 'utf8'), f);
  if (p) posts.push(p);
}
posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.arquivo.localeCompare(b.arquivo)));

for (const p of posts) {
  await mkdir(join(root, 'blog', p.slug), { recursive: true });
  await writeFile(join(root, 'blog', p.slug, 'index.html'), paginaPost(p, posts));
  console.log(`blog/${p.slug}/  ${p.palavras} palavras, ${extrairFaq(p.corpo).length} FAQs`);
}
await writeFile(join(root, 'blog/index.html'), paginaIndice(posts));
await writeFile(join(root, 'sitemap.xml'), sitemap(posts));
await writeFile(join(root, '404.html'), `${head({ titulo: 'Página não encontrada | TianXiang', descricao: 'Esta página não existe ou mudou de endereço.', url: `${SITE}/404`, tipo: 'website', ld: null, extraCss: true }).replace('index, follow, max-image-preview:large', 'noindex')}
${cabecalho}
<main id="conteudo">
  <div class="container">
    <header class="blog-topo">
      <h1>Página não encontrada</h1>
      <p>Este endereço não existe ou mudou. Volte para o início ou veja os artigos do blog.</p>
      <div style="display: flex; flex-wrap: wrap; gap: var(--s2); margin-top: var(--s4);">
        <a class="btn btn-selo" href="/">Ir para o início</a>
        <a class="btn btn-linha" href="/blog/">Ver o blog</a>
      </div>
    </header>
  </div>
</main>
${rodape}
</body>
</html>
`);
const llmsPath = join(root, 'llms.txt');
const llms = await readFile(llmsPath, 'utf8');
const listaLlms = posts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/)`).join('\n');
await writeFile(llmsPath, llms.replace(/\n## Artigos\n[\s\S]*$/, '') .trimEnd() + `\n\n## Artigos\n${listaLlms}\n`);
console.log(`índice + sitemap + llms.txt: ${posts.length} artigos`);
