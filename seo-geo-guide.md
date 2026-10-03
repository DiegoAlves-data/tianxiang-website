# Manual de Desenvolvimento Orientado a SEO e Local SEO (GEO)

**Projeto:** Site Institucional e de Alta Conversão
**Marca:** Tianxiang Acupuntura
**Localização Alvo:** Campinas, SP
**Objetivo Principal:** Ocupar a primeira página do Google para "acupuntura em campinas", tratamentos de "dores crônicas" e serviços correlatos.

> Nota (out/2026): a v1 do site é **página única**. As URLs da seção 1 viram âncoras (`#acupuntura-em-campinas`, etc.). Quando o site virar multipágina, seguir a estrutura de rotas abaixo.

## 1. Arquitetura de URLs e Estrutura do Site

O domínio principal foca na marca (Tianxiang); as URLs internas fazem o rankeamento de palavras-chave.

- `/` — Home: autoridade, marca e destaque para tratamento de dores crônicas
- `/acupuntura-em-campinas` — landing pilar de alta conversão, otimizada para a palavra-chave exata
- `/tratamentos-dores-cronicas` — página dedicada à maior dor do público-alvo
- `/massoterapia` — agregadora de massagens
- `/quick-massage-empresas` — foco B2B (eventos e corporativo)
- `/terapias-complementares` — Auriculoterapia, Ventosaterapia, Dietoterapia e Laserterapia

## 2. SEO Técnico (obrigatório em todo o código)

- **HTML semântico:** `<header>`, `<main>`, `<article>`, `<section>`, `<footer>`.
- **Headings:** apenas UM `<h1>` por página, com palavra-chave principal + localidade (ex.: "Especialistas em Acupuntura em Campinas e Medicina Tradicional Chinesa"). `<h2>` para serviços, `<h3>` para detalhamentos.
- **Performance (Core Web Vitals):** imagens em WebP, `loading="lazy"` (exceto hero/first fold).
- **Meta tags:** `<title>` ≤ 60 caracteres; `<meta name="description">` ≤ 155 caracteres, focada em CTR.
- **Mobile-first:** impecável em smartphone (>70% das buscas locais).

## 3. Estratégia de Conteúdo e Componentização (UI/UX)

### A. Foco em Dores Crônicas
Em toda a copy (especialmente Home e Acupuntura), links contextuais ligando serviços ao "Tratamento de Dores Crônicas" (lombalgia, enxaqueca, fibromialgia etc.). Cards de destaque mostrando especialidade em alívio da dor.

### B. Catálogo de Massoterapia
Listar todas as massagens **sem preços** e sem poluir a página: componente **Accordion** ou **Grid de Cards com Modal**. O usuário vê só os nomes; ao clicar, expande benefícios e indicação de forma concisa.

### C. Serviços Secundários
Auriculoterapia, Ventosaterapia, Dietoterapia Chinesa ("cura pela alimentação") e Laserterapia/Fotobiomodulação em seções modulares, com ícone SVG minimalista + parágrafo curto com palavras-chave de cauda longa (ex.: "Sessões de Ventosaterapia em Campinas para liberação miofascial").

## 4. Local SEO (GEO) e Dados Estruturados

- **Schema JSON-LD `LocalBusiness`** (`MedicalClinic` ou `HealthAndBeautyBusiness`) no `<head>` da home e da página de contato: nome "Tianxiang Acupuntura", endereço (Campinas, SP), telefone, horário, URL.
- **Consistência NAP (Name, Address, Phone):** footer global com endereço em Campinas, WhatsApp e horário em TODAS as páginas.
- **Mapa:** iframe do Google Maps (carregamento otimizado/lazy) apontando para o endereço exato.

## 5. Ordem de execução

Estrutura base (layout, header, footer) → Home, com marcação semântica e espaço para copy focada em Dores Crônicas e Acupuntura em Campinas.
