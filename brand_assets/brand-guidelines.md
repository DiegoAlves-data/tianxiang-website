# TianXiang — Brand Guidelines (v1, out/2026)

Versão leve para consulta durante o desenvolvimento do site. Guia visual completo (mockups, swatches): [artifact](https://claude.ai/artifact/LrrTccngFvCwBT31vaqXA7).

## Essência

**Posicionamento:** Medicina Tradicional Chinesa com a precisão de quem pensa em dados e a escuta de quem cuida de gente. Nem mística, nem fria.

**Propósito:** cuidado sério e acompanhado — não sessão isolada. Plano, histórico, terapeuta que entende o que está fazendo e por quê.

**Valores:**
- Precisão clínica — diagnóstico real, plano de tratamento, evolução registrada
- Clareza — sem termos herméticos; se o paciente não entende, não explicamos direito
- Constância — resultado vem do pacote mensal, isso é dito, não escondido
- Presença real — Diego atende, não terceiriza

## Tom de voz

Direto, acolhedor, sem clichê de guru.

**Somos:** frases curtas, explicação de causa/efeito, confiança tranquila, linguagem de quem cuida.

**Não somos:** místicos ("energia universal", "chakras"), corporativos ("sinergia", "soluções em bem-estar"), promessa milagrosa, emoji em excesso.

**Exemplo:** "Dor lombar há 3 meses não se resolve em 1 sessão. O plano é de 8 semanas — e você vai sentir diferença já na segunda."

## Cores

| Nome | Hex | Uso |
|---|---|---|
| Tinta | `#1C1A17` | Texto, fundo escuro, ~90% do peso visual junto com Papel |
| Papel | `#F6F1E7` | Fundo base |
| Papel 2 | `#EFE8D8` | Superfície elevada (cards) |
| Jade | `#4A6B5A` | Acento — ícones, elementos ligados a ervas/natureza |
| Selo | `#B3432B` | Acento de chamada — CTA, botão de agendar. Usar com moderação, nunca como fundo grande |

Regra: nunca default Tailwind (indigo/blue). Tinta + Papel carregam a peça; Jade e Selo só pontuam.

## Tipografia

- **Display/Títulos:** Noto Serif TC — pesos 500 (subtítulos), 600–700 (títulos). Usar com moderação, não para parágrafos longos.
- **Corpo/UI:** Work Sans — pesos 400 (texto), 500–600 (destaques, botões).
- Google Fonts: `family=Noto+Serif+TC:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700`

## Logo

Arquivo: `logo-tianxiang.png` (pincel sumi-e + caracteres 天祥 + "TIANXIANG").

- **Sempre:** espaço de respiro = altura do símbolo; fundo sólido (papel claro ou tinta escura); mínimo 32px tela / 15mm impresso.
- **Nunca:** esticar/distorcer/girar; sobre foto sem área de contraste sólida; recolorir o pincel (é sempre tinta ou papel, nunca jade/selo).

## Guardrails gerais (herdados do CLAUDE.md de frontend)

- Sombras em camadas, nunca `shadow-md` flat
- Animar só `transform`/`opacity`, nunca `transition-all`
- Estados hover/focus-visible/active em todo elemento clicável
- Espaçamento em tokens consistentes, não valores aleatórios
