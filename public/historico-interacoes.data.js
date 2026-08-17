window.HISTORY = {
  group: 3,
  dateLabel: "31 de julho de 2026",
  collectedLabel: "17 de agosto de 2026",
  phases: {
    abertura: "Conversas iniciais",
    brief: "Definição do produto",
    ajuste: "Ajuste de escopo",
    entrega: "Construção e publicação",
  },
  decisions: [
    "Produto interno para jornalistas encontrarem docentes e especialistas de universidades públicas.",
    "Consulta por perguntas em texto livre, com instituição, área, especialidades e contatos profissionais públicos.",
    "Cobertura nacional de universidades federais e estaduais, construída por lotes a partir de um piloto verificado.",
    "Acesso restrito a usuários autenticados, com o Slack apontado como interface desejada.",
    "A ferramenta localiza e exibe fontes; não faz contato automático com pesquisadores.",
    "A demonstração pública simula a conversa no Slack e usa registros claramente identificados como exemplo.",
    "Integração real com Slack e base acadêmica nacional ficaram para uma etapa posterior.",
  ],
  status: {
    title: "SITE PUBLICADO",
    text: "A versão abe92985, Fonte Certa — simulador do bot, foi publicada como demonstração pública de consulta a fontes acadêmicas para jornalistas.",
  },
  messages: [
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "Pedro Burgos", time: "07:01:57", datetime: "2026-07-31T07:01:57-03:00",
      body: "@Oficina Codex teste de roteamento. Responda somente: grupo-3 pronto.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785492117040149",
    },
    {
      phase: "abertura", kind: "conversa", role: "app", author: "Oficina Codex", time: "07:02:04", datetime: "2026-07-31T07:02:04-03:00", edited: true,
      body: "grupo-3 pronto.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785492124361209",
    },
    {
      phase: "abertura", kind: "status", role: "sistema", author: "Sistema da oficina", time: "11:24:47", datetime: "2026-07-31T11:24:47-03:00",
      body: "Pedro Burgos tornou o canal público. Qualquer membro do workspace pode vê-lo e entrar nele.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785507887310879",
    },
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "Fernanda", time: "11:31:21", datetime: "2026-07-31T11:31:21-03:00",
      body: "oi",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785508281298429",
    },
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "Ígor", time: "11:31:50", datetime: "2026-07-31T11:31:50-03:00",
      body: "Opa",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785508310265039",
    },
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "Marina", time: "11:31:54", datetime: "2026-07-31T11:31:54-03:00",
      body: "oi",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785508314464979",
    },
    {
      phase: "abertura", kind: "conversa", role: "pessoa", author: "lidia", time: "11:32:20", datetime: "2026-07-31T11:32:20-03:00",
      body: "Bom diaaaa",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785508340561999",
    },
    {
      phase: "brief", kind: "projeto", role: "pessoa", author: "Marina", time: "11:33:35", datetime: "2026-07-31T11:33:35-03:00",
      body: "@Oficina Codex quero criar um app",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785508415186239",
    },
    {
      phase: "brief", kind: "projeto", role: "app", author: "Oficina Codex", time: "11:33:42", datetime: "2026-07-31T11:33:42-03:00", edited: true,
      body: `Bora. Antes de construir, precisamos fechar um MVP pequeno e testável. Me contem:
• Qual problema o app resolve?
• Para quem?
• Qual é a ação principal que a pessoa precisa conseguir realizar?
• Que dados ou conteúdo entram no app?
• Como saberemos que a primeira versão funcionou?

Com isso, organizo o BRIEF.md e devolvo o escopo para aprovação.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785508422126289",
    },
    {
      phase: "brief", kind: "conversa", role: "pessoa", author: "lidia", time: "11:33:48", datetime: "2026-07-31T11:33:48-03:00",
      body: "@Oficina Codex",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785508428087119",
    },
    {
      phase: "brief", kind: "conversa", role: "app", author: "Oficina Codex", time: "11:33:54", datetime: "2026-07-31T11:33:54-03:00", edited: true,
      body: "Oi! Estamos definindo o app do grupo. Conta qual problema vocês querem resolver e para quem?",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785508434774609",
    },
    {
      phase: "brief", kind: "projeto", role: "pessoa", author: "Ígor", time: "11:49:39", datetime: "2026-07-31T11:49:39-03:00",
      body: "@Oficina Codex Quero criar um chatbox interno da minha redação que busque banco de fontes em universidades, com foco em professores e especialistas, listando instituição, nome do docente, área, temas de especialização, e-mail e telefone.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785509379248439",
    },
    {
      phase: "brief", kind: "projeto", role: "app", author: "Oficina Codex", time: "11:49:49", datetime: "2026-07-31T11:49:49-03:00", edited: true,
      body: `Entendi: um chatbot interno para a redação consultar docentes e especialistas, com instituição, nome, área, temas de especialização e contatos.

Para fechar o MVP, precisamos decidir: perguntas em texto livre ou filtros; quais universidades entram primeiro; de onde vêm os dados; se serão exibidos apenas contatos profissionais públicos; quem terá acesso; e se a ferramenta apenas localiza e exibe a fonte ou também inicia contato.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785509389376579",
    },
    {
      phase: "brief", kind: "projeto", role: "pessoa", author: "Fernanda", time: "11:52:25", datetime: "2026-07-31T11:52:25-03:00",
      body: `Perguntas em texto livre. Universidades federais e estaduais do Brasil. Os dados podem vir de raspagem pública dos sites das universidades. Exibir somente e-mail e telefone profissionais, públicos ou autorizados. O acesso deve ser para usuários logados — pode ser um bot no Slack? A ferramenta apenas localiza e exibe as fontes.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785509545893689",
    },
    {
      phase: "brief", kind: "status", role: "app", author: "Oficina Codex", time: "11:53:29", datetime: "2026-07-31T11:53:29-03:00", edited: true,
      body: `Um bot no Slack funciona para esse uso. O brief foi consolidado como BRIEF_READY, com construção e publicação ainda desativadas.

Como a cobertura nacional é grande, a proposta é construir em lotes, começando por um piloto verificado. Aguardamos a liberação do facilitador.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785509609828269",
    },
    {
      phase: "ajuste", kind: "projeto", role: "pessoa", author: "Pedro Burgos", time: "11:54:39", datetime: "2026-07-31T11:54:39-03:00",
      body: "<@U0BM2MVJ69L> Ajuste operacional do brief: mantenha todo o conteúdo e renomeie a seção final para exatamente '## Fora do escopo'. Depois registre novamente STATE=BRIEF_READY.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785509679488589",
    },
    {
      phase: "ajuste", kind: "status", role: "app", author: "Oficina Codex", time: "11:55:22", datetime: "2026-07-31T11:55:22-03:00", edited: true,
      body: "Ajuste concluído. O conteúdo foi preservado, a seção final foi renomeada para '## Fora do escopo' e o estado voltou a BRIEF_READY, ainda sem construção ou publicação.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785509722629229",
    },
    {
      phase: "entrega", kind: "status", role: "sistema", author: "Sistema da oficina", time: "11:57:40", datetime: "2026-07-31T11:57:40-03:00",
      body: "O facilitador aprovou o brief abe92985. A primeira versão entrou em construção.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785509860062439",
    },
    {
      phase: "entrega", kind: "status", role: "app", author: "Oficina Codex", time: "12:20:19", datetime: "2026-07-31T12:20:19-03:00",
      body: `REVISÃO NECESSÁRIA — versão abe92985

O artefato aprovado é um bot interno autenticado no Slack, enquanto a fila de Sites publica páginas abertas. Ela não consegue entregar autenticação do workspace, o fluxo real do bot nem uma base acadêmica nacional verificada. Nada foi publicado nessa etapa. Era necessário consolidar como a demonstração pública representaria o produto.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785511219476739",
    },
    {
      phase: "entrega", kind: "status", role: "app", author: "Oficina Codex", time: "12:33:26", datetime: "2026-07-31T12:33:26-03:00",
      body: `VAMOS CONSTRUIR UMA PRIMEIRA VERSÃO — uma demonstração pública e interativa que simula uma pergunta e uma resposta no Slack, usando um pequeno conjunto de especialistas de exemplo. A integração real com Slack e a base nacional ficam para uma etapa posterior. Registros simulados serão identificados claramente.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785512006497709",
    },
    {
      phase: "entrega", kind: "status", role: "sistema", author: "Sistema da oficina", time: "12:33:37", datetime: "2026-07-31T12:33:37-03:00",
      body: "ATUALIZAÇÃO — o MVP continua na fila de construção e publicação. Não é necessário reenviar o brief. O canal será avisado quando houver uma versão pública ou alguma decisão for necessária.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785512017725769",
    },
    {
      phase: "entrega", kind: "status", role: "app", author: "Oficina Codex", time: "12:38:47", datetime: "2026-07-31T12:38:47-03:00",
      body: "ATUALIZAÇÃO — o MVP continua na fila de construção e publicação. Não é necessário reenviar o brief. O canal será avisado quando houver uma versão pública ou alguma decisão for necessária.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785512327296019",
    },
    {
      phase: "entrega", kind: "status", role: "app", author: "Oficina Codex", time: "12:43:56", datetime: "2026-07-31T12:43:56-03:00",
      body: "ATUALIZAÇÃO — o MVP continua na fila de construção e publicação. Não é necessário reenviar o brief. O canal será avisado quando houver uma versão pública ou alguma decisão for necessária.",
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785512636975419",
    },
    {
      phase: "entrega", kind: "status", role: "sistema", author: "Sistema da oficina", time: "12:46:43", datetime: "2026-07-31T12:46:43-03:00",
      body: `SITE PUBLICADO — https://codesinfo-abraji-oficina-grupo-3.burgos.chatgpt.site

Esta é a versão abe92985. Enviem as revisões neste canal.

Fonte Certa — simulador do bot
Demonstração pública de consulta a fontes acadêmicas para jornalistas.`,
      url: "https://codesinfo-abraji.slack.com/archives/C0BLZ8R6BB7/p1785512803624439",
    },
  ],
};
