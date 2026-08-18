# Fonte Certa

Protótipo do Grupo 3 da oficina de construção com IA do Hackaton Codesinfo, realizado no 21º Congresso da Abraji.

O projeto simula um bot interno para ajudar jornalistas a localizar docentes e especialistas de universidades públicas a partir do tema de uma pauta. A experiência pública reproduz uma conversa no Slack e explica por que cada perfil poderia ser relevante.

## O que o protótipo faz

- recebe perguntas em texto livre sobre um tema jornalístico;
- demonstra consultas sobre desinformação, clima e inteligência artificial;
- lista área, instituição, temas de pesquisa e aderência de cada perfil;
- explica o motivo da correspondência entre a pergunta e o especialista;
- permite abrir um painel com mais detalhes do perfil;
- apresenta estado vazio e sugestões quando não há correspondência;
- reforça que o contato deve acontecer fora do sistema e após conferência humana.

## Estado atual

Todos os nomes, instituições, contatos e índices de aderência são fictícios. Os domínios `.invalid` impedem o uso acidental dos endereços de demonstração. A versão publicada ainda não possui catálogo acadêmico real, integração com Slack nem autenticação da redação.

- [Abrir a demonstração](https://codesinfo-abraji-oficina-grupo-3.burgos.chatgpt.site)
- [Ler o registro das interações no Slack](public/historico-interacoes.html)

## Como rodar localmente

### Pré-requisitos

- Node.js 22.13 ou mais recente;
- npm.

### Instalação e desenvolvimento

```bash
npm ci
npm run dev
```

Abra no navegador o endereço informado pelo terminal.

### Validação e execução de produção

```bash
npm test
npm run build
npm run start
```

A simulação está em `app/page.tsx`; os estilos ficam em `app/globals.css`.

## Roadmap possível

- [ ] Criar um catálogo real a partir de páginas institucionais públicas e autorizadas.
- [ ] Registrar a URL de origem, a data de verificação e a cobertura de cada universidade.
- [ ] Disponibilizar uma área de curadoria para revisar, corrigir, mesclar e desativar perfis.
- [ ] Implementar busca semântica com critérios de aderência visíveis e auditáveis.
- [ ] Integrar um bot privado ao Slack com autenticação e controle de acesso da redação.
- [ ] Expandir a cobertura nacional por lotes verificados de universidades federais e estaduais.
- [ ] Atualizar contatos profissionais periodicamente e oferecer mecanismo de correção ou remoção.
- [ ] Deduplicar pesquisadores, instituições, áreas e variações de nomes.
- [ ] Medir cobertura, atualização e qualidade do catálogo sem ranquear pessoas por prestígio.

## Princípios editoriais e de privacidade

- Somente contatos profissionais públicos ou autorizados devem ser exibidos.
- Toda recomendação precisa indicar origem e motivo da correspondência.
- A ferramenta localiza fontes; não inicia contato automaticamente.
- O jornalista deve confirmar identidade, vínculo atual e pertinência antes da entrevista.
