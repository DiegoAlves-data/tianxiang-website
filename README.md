# TianXiang Acupuntura — site

Site institucional e blog da TianXiang Acupuntura e Terapias Naturais, em Campinas-SP.
Domínio: [tianxiangacupuntura.com.br](https://tianxiangacupuntura.com.br)

HTML estático, sem framework. O Vercel publica os arquivos como estão, sem build no servidor.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Página inicial (página única, com âncoras por serviço) |
| `assets/site.css`, `assets/blog.css` | Estilos compartilhados e do blog |
| `blog/posts/*.md` | Fonte dos artigos, em Markdown |
| `blog/*/index.html`, `blog/index.html`, `404.html` | Gerados pelo build, não editar à mão |
| `sitemap.xml`, `llms.txt` | Gerados pelo build (a lista de artigos do `llms.txt` é reescrita) |
| `brand_assets/` | Logo, fotos e guia de marca |
| `scripts/build-blog.mjs` | Gera o blog, o sitemap e o `llms.txt` |

## Desenvolvimento local

```bash
npm install
npm run dev          # http://localhost:3000
npm run screenshot -- http://localhost:3000 home 390   # captura em "temporary screenshots/"
```

## Publicar um artigo novo

1. Crie `blog/posts/NN-assunto.md` com o frontmatter (veja um post existente). Campos: `slug`, `title`, `seoTitle` (até 60 caracteres), `description` (até 155), `category`, `categorySlug`, `condition`, `date`, e opcionais `author` (`diego` ou `monica`), `updated` e `draft: true`.
2. Coloque `<!-- cta -->` uma vez no meio do texto e termine com `## Perguntas frequentes` e as perguntas em `###`.
3. Rode `npm run build`.
4. Faça commit e push. O Vercel publica sozinho.

## Deploy (Vercel)

Importe o repositório no Vercel com o preset **Other**. O `vercel.json` já define URLs limpas com barra no final, cabeçalhos de segurança e cache dos assets. O `.vercelignore` deixa fora do deploy a fonte em Markdown, os scripts e os arquivos de trabalho.
