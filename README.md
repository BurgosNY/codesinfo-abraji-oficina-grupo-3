# Fonte Certa

Diretório de fontes acadêmicas para jornalistas que trabalham com checagem de informação, fake news e desinformação.

**Demo:** [codesinfo-abraji-oficina-grupo-3.burgos.chatgpt.site](https://codesinfo-abraji-oficina-grupo-3.burgos.chatgpt.site/)

O projeto nasceu no Grupo 3 de uma oficina da Abraji. A proposta é reduzir o tempo entre receber uma pauta e encontrar pessoas reais, com vínculo acadêmico verificável, que possam ajudar a avaliar uma alegação, um conteúdo ou uma fonte.

## O que o projeto faz

- Reúne uma base inicial de **30 pessoas reais**, com 10 perfis de cada universidade: UFMG, Unicamp e USP.
- Mantém nome, afiliação, área, especialidades e bio editorial, além de links para uma página institucional e uma reportagem de referência.
- Recebe uma pergunta escrita em linguagem natural e compara a necessidade da pauta com o catálogo fechado de pesquisadores.
- Usa o **GPT-5.6 Luna** para fazer o match semântico e explicar por que cada pessoa foi sugerida.
- Exibe níveis editoriais de aderência — alta, média ou exploratória — em vez de uma falsa porcentagem de precisão.
- Volta automaticamente para uma busca lexical quando o modelo não está configurado ou não responde.
- Oferece uma área de curadoria para editar universidades, perfis e pessoas autorizadas a manter a base.

O Fonte Certa é uma ferramenta de descoberta. A sugestão não substitui a avaliação jornalística, a conferência do vínculo institucional nem a apuração com a fonte.

## Como o match funciona

1. A pergunta e o filtro de universidade chegam ao endpoint `POST /api/match`.
2. O servidor carrega apenas os perfis publicados na base curada.
3. O Luna recebe uma versão compacta desses perfis e devolve, em JSON estruturado, até 10 sugestões com nível de aderência, justificativa e sinais utilizados.
4. O servidor aceita somente IDs existentes no catálogo, remove duplicatas e descarta respostas fora do contrato.
5. Se a API não estiver disponível, o site usa o ranking lexical determinístico como fallback.

A pergunta é processada com `store: false`. A chave da OpenAI fica exclusivamente no servidor e nunca é enviada ao navegador.

## Rotas principais

| Rota | Função |
| --- | --- |
| `/` | Busca pública e perfis das fontes |
| `/curadoria` | Administração da base por pessoas autorizadas |
| `GET /api/catalog` | Catálogo público de universidades e perfis publicados |
| `POST /api/match` | Match semântico com fallback lexical |
| `GET/POST /api/admin/catalog` | Leitura e manutenção autenticada da curadoria |

## Tecnologias

- Next.js 16 e React 19
- TypeScript
- Vinext e Cloudflare Workers
- Cloudflare D1 e Drizzle ORM
- OpenAI Responses API com `gpt-5.6-luna`
- Sites e Sign in with ChatGPT para hospedagem e identidade da curadoria

## Como rodar localmente

### Requisitos

- Node.js `>= 22.13.0`
- npm
- Uma chave da OpenAI é opcional: sem ela, a busca continua funcionando no modo lexical.

### Instalação

```bash
git clone https://github.com/BurgosNY/codesinfo-abraji-oficina-grupo-3.git
cd codesinfo-abraji-oficina-grupo-3
npm install
cp .env.example .env.local
```

Para habilitar o match semântico, preencha a variável abaixo em `.env.local`:

```dotenv
OPENAI_API_KEY=
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Na primeira requisição, o banco D1 local é preparado e recebe a base inicial automaticamente.

> A busca pública funciona localmente. A autenticação da curadoria depende dos cabeçalhos de identidade injetados pelo Sites no ambiente hospedado.

## Validação

```bash
npm test
npm run build
```

`npm test` executa o build e verifica a experiência pública, a presença dos 30 perfis reais, a proteção da curadoria e o contrato do motor Luna.

## Estrutura resumida

```text
app/                  páginas e endpoints do site
app/api/match/        motor de match semântico
app/curadoria/        interface de manutenção da base
db/                   acesso e schema do D1
lib/catalog.ts        inicialização, leitura e escrita do catálogo
lib/search.ts         ranking lexical de fallback
lib/seed-data.ts      universidades e perfis iniciais
tests/                verificações automatizadas
```

## Roadmap possível

O roadmap abaixo é uma lista de possibilidades, não um compromisso fechado.

### Qualidade editorial e transparência

- Criar um conjunto de pautas avaliadas por jornalistas para medir precisão e utilidade do ranking.
- Mostrar quais campos do perfil sustentaram cada justificativa do match.
- Versionar prompts e comparar Luna, busca lexical e outros modelos com os mesmos casos.
- Permitir que a curadoria fixe, rebaixe ou exclua uma sugestão para determinados temas.

### Base e curadoria

- Incluir novas universidades conforme a disponibilidade de diretórios públicos estruturados.
- Adicionar múltiplas reportagens de referência e histórico de verificação por perfil.
- Criar alertas para vínculos ou páginas institucionais que deixaram de responder.
- Oferecer um fluxo de correção, atualização ou remoção solicitado pela própria pessoa cadastrada.
- Registrar trilha de auditoria das edições feitas pela curadoria.

### Fluxo de trabalho jornalístico

- Salvar uma lista curta de fontes por pauta.
- Gerar um link compartilhável ou exportar uma ficha de contatos para a redação.
- Adicionar filtros por tema, instituição, localização e tipo de contribuição esperada.
- Sugerir perguntas iniciais para a entrevista com base na pauta e no perfil selecionado.
- Incluir contatos públicos somente quando houver origem verificável.

### Operação e escala

- Adicionar limite de requisições, orçamento por período e monitoramento de custo da API.
- Criar cache seguro para consultas recorrentes sem armazenar pautas sensíveis indevidamente.
- Medir latência, uso do fallback e taxa de seleção das fontes sugeridas.
- Melhorar acessibilidade, desempenho móvel e tratamento de conexões lentas.

## Princípios do projeto

1. **Pessoas reais antes de volume:** nenhum perfil fictício na demo.
2. **Disponibilidade antes de prestígio:** priorizar universidades com dados públicos que possam ser mantidos.
3. **Catálogo fechado:** o modelo pode ordenar e explicar, mas não inventar fontes.
4. **Lastro verificável:** cada perfil precisa apontar para origem institucional e referência editorial.
5. **Decisão humana:** o match apoia a pauta; não decide sozinho quem é a fonte correta.
