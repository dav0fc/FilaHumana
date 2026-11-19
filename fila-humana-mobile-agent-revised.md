# Fila Humana — Especificação para o agente de desenvolvimento mobile

> **Objetivo:** implementar exclusivamente o aplicativo mobile da Fila Humana, pronto para demonstração e avaliação acadêmica.
>
> **Prioridade máxima:** atender de forma verificável aos seis critérios da disciplina: telas e navegação, consumo de dados, banco de dados, acessibilidade, aderência ao problema e documentação.
>
> **Restrição de escopo:** este documento orienta o desenvolvimento do cliente mobile. Não implemente firmware ESP32, circuito, dashboard web, backend próprio, infraestrutura de nuvem ou modelos de previsão. O aplicativo deve estar preparado para consumir uma API ou, enquanto ela não estiver disponível, um mock realista e claramente identificado.

---

## 1. Contexto do projeto

A Fila Humana ajuda cidadãos — especialmente idosos e pessoas com pouco tempo disponível — a decidir **onde e quando ir** a locais de atendimento como UBS e Poupatempo, reduzindo o tempo perdido em filas.

A jornada principal do cidadão é:

1. Abrir o aplicativo.
2. Visualizar os locais de atendimento disponíveis.
3. Entender rapidamente a situação atual da fila em cada local.
4. Abrir um local para consultar detalhes, histórico ou horários recomendados.
5. Escolher um local/horário mais conveniente.
6. Opcionalmente, favoritar o local ou configurar um alerta para ser avisado quando a fila estiver mais tranquila.

A experiência precisa ser compreensível para alguém que não seja especialista em tecnologia. Não transforme o aplicativo em um painel técnico de sensores.

### Princípio central

O app não deve apenas exibir dados: deve ajudar o cidadão a tomar uma decisão simples. A informação mais importante em cada tela deve responder a perguntas como:

- Qual local está mais tranquilo agora?
- Quanto tempo de espera devo esperar?
- Qual é o melhor horário para ir?
- Os dados são atuais ou estão desatualizados?

Não apresente estimativas como certezas. Sempre diferencie dados medidos, estimativas e dados simulados.

---

## 2. Instrução obrigatória: estudar o projeto anterior antes de codificar

O agente terá acesso local ao repositório do FrutigerChat:

`https://github.com/dav0fc/cp2-mobile-2-semestre-2026`

Antes de implementar qualquer coisa:

1. Inspecione o projeto local, seu `README.md`, `package.json`, configuração Expo, estrutura `src/`, componentes, hooks, contexts, services, types e utils.
2. Inspecione o histórico Git completo disponível localmente:
   - `git log --oneline --decorate --all`
   - `git log --stat --all`
   - Examine commits representativos de cada etapa/prova.
   - Use `git show` e compare versões quando isso ajudar a entender a evolução.
3. Identifique padrões de arquitetura, tipagem, organização, navegação, tratamento de erros, persistência e documentação que foram efetivamente usados no FrutigerChat.
4. Observe especialmente a evolução entre CP1 e CP2: o que foi mantido, melhorado ou adicionado.
5. Analise o README e os prints do projeto para entender o padrão de apresentação e documentação.
6. Produza uma avaliação interna curta antes de codificar: padrões que vale a pena reutilizar, problemas a evitar e adaptações necessárias para a Fila Humana.

**Não afirme ter analisado commits que não conseguiu acessar.** Se o histórico local estiver incompleto, registre essa limitação e trabalhe com os arquivos e commits realmente disponíveis.

### O que aproveitar do FrutigerChat

O CP1 exigia React Native, Expo, TypeScript, hooks com propósito funcional, componentização, Firebase Authentication, Realtime Database, atualização em tempo real, tratamento de erros, loading, tipagem forte e organização modular. O CP2 ampliou a complexidade e reforçou arquitetura, serviços, regras de segurança e notificações.

A Fila Humana não é um chat. Portanto:

- Reutilize padrões arquiteturais e de qualidade, não funcionalidades de chat.
- Não adicione Firebase Authentication, Firestore, Realtime Database ou FCM apenas para imitar o trabalho anterior.
- Use somente tecnologias que façam sentido para os requisitos atuais.
- A tarefa atual permite API **ou mock** e exige persistência em banco. Escolha a solução mais simples, confiável e demonstrável que satisfaça esses requisitos.
- Não implemente um backend próprio como parte deste escopo mobile.

---

## 3. Enunciado atual e critérios de avaliação

O enunciado da disciplina fornecido é:

> “Entregar um app funcional em Expo que resolva a jornada principal do cidadão definida na Ficha. O app deve consumir dados de uma API ou de um mock, salvar informações em banco de dados e ser simples e acessível para quem não é especialista.”

A entrega é um link de repositório GitHub enviado por um integrante no Teams até 19/11, às 23h55. A nota é de 0 a 10 e está distribuída em seis critérios. O resumo recebido cita:

1. Telas e navegação.
2. Consumo de dados.
3. Banco de dados.
4. Acessibilidade.
5. Aderência ao problema.
6. Documentação.

A rubrica completa não foi incluída neste documento de entrada. Não invente pesos nem subcritérios. Desenvolva para demonstrar claramente cada um dos seis critérios e, se a rubrica completa estiver disponível no repositório, nos arquivos do workspace ou for adicionada posteriormente, leia-a e atualize este plano.

### Matriz de rastreabilidade: requisito → implementação → evidência

| Critério | Implementação exigida | Evidência para avaliação |
|---|---|---|
| Telas e navegação | Fluxo completo, navegação consistente, estados de tela e retorno previsível | Prints e demonstração da jornada principal |
| Consumo de dados | Camada de dados para API ou mock, carregamento, atualização, erros e indicação de atualização | Código do service/repository e dados apresentados na interface |
| Banco de dados | Persistência local real de dados úteis ao usuário | Fechar e reabrir o app sem perder favoritos, alertas e preferências |
| Acessibilidade | Interface simples, legível, com alvos de toque adequados e suporte a leitores de tela | Verificação visual e testes manuais de acessibilidade |
| Aderência ao problema | Dados que ajudem a escolher local e horário, sem linguagem técnica | Demonstração da jornada de decisão do cidadão |
| Documentação | README reproduzível, arquitetura, configuração, execução, limitações e evidências | README revisado e prints reais do aplicativo |

---

## 4. Escopo funcional do aplicativo

Implemente a jornada principal com as seguintes telas. Ajuste nomes e quantidade de telas se a arquitetura existente justificar, mas não elimine as capacidades essenciais.

### 4.1. Tela inicial — locais de atendimento

Deve apresentar:

- Lista de locais de atendimento.
- Nome do local e tipo (UBS, Poupatempo ou outra categoria cadastrada).
- Endereço ou região.
- Situação atual da fila, em linguagem simples.
- Estimativa de espera, quando houver dado disponível.
- Horário da última atualização.
- Indicação visual clara para fila tranquila, moderada ou cheia.
- Acesso aos detalhes do local.
- Acesso a favoritos.

A lista deve permitir identificar rapidamente os locais mais tranquilos. Se houver ordenação, ofereça uma ordenação útil e compreensível, sem esconder os demais locais.

### 4.2. Detalhes do local

Exibir:

- Nome, categoria e endereço.
- Situação atual da fila.
- Estimativa de espera, se disponível.
- Quantidade de pessoas, se disponível e confiável.
- Horário da última atualização.
- Histórico ou tendência por horário/dia, caso existam dados suficientes.
- Melhor horário recomendado, se houver dados para calculá-lo.
- Ação para favoritar/desfavoritar.
- Ação para configurar ou cancelar alerta.

Não invente histórico, capacidade, tempo médio ou horário de funcionamento como se fossem dados reais. Quando utilizar mock, deixe isso explícito na interface e na documentação.

### 4.3. Favoritos

Permitir:

- Adicionar e remover locais dos favoritos.
- Consultar os locais favoritos em uma área própria ou filtro.
- Manter os favoritos após fechar e reabrir o aplicativo.

### 4.4. Alertas — “Avisar quando estiver mais tranquilo”

Permitir que o cidadão configure um alerta para um local favorito ou selecionado.

Comportamento mínimo:

- Criar um alerta associado a um local.
- Definir a condição de disparo usando os estados de fila que o app realmente suporta (por exemplo, quando passar para “tranquila”).
- Consultar alertas ativos.
- Cancelar um alerta.
- Persistir os alertas localmente.

**Limitação técnica que deve ser comunicada:** se a aplicação não tiver um backend ou mecanismo remoto executando verificações em segundo plano, não prometa que o usuário será avisado instantaneamente quando o sensor detectar uma mudança. Nesse cenário, implemente notificações locais quando o app receber uma atualização que satisfaça a condição e documente claramente a limitação. Não simule uma notificação remota inexistente.

Se a integração de notificações não puder ser concluída de forma confiável no ambiente disponível, priorize primeiro toda a jornada principal, persistência e estados de interface. Deixe a funcionalidade preparada por uma abstração e documente o que falta, sem apresentar uma funcionalidade falsa como concluída.

### 4.5. Estados obrigatórios de interface

Toda tela que carrega dados deve prever:

- Loading inicial.
- Conteúdo carregado.
- Estado vazio com explicação e ação útil, quando aplicável.
- Erro com mensagem compreensível e opção de tentar novamente.
- Dados desatualizados ou indisponíveis.
- Falha de conectividade, quando aplicável.

Não deixe telas em branco nem use apenas `console.log` como tratamento de erro.

---

## 5. Consumo de dados: API e mock

O app deve consumir uma API ou um mock. A implementação deve permitir trocar o mock pela API sem reescrever as telas.

### 5.1. Arquitetura recomendada

Crie uma interface/contrato de repositório para locais e situação das filas. Separe:

- Tipos e modelos.
- Fonte de dados (mock ou API).
- Repositório/service.
- Hooks de acesso aos dados.
- Componentes e telas.

Exemplo conceitual — adapte ao padrão identificado no FrutigerChat:

```ts
export interface QueueRepository {
  getLocations(): Promise<QueueLocation[]>;
  getLocationById(id: string): Promise<QueueLocation | null>;
  getQueueStatus(locationId: string): Promise<QueueStatus>;
}
```

Pode ser uma interface única ou services menores, desde que a separação de responsabilidades seja clara.

### 5.2. Mock realista

Se a API ainda não estiver disponível:

- Crie dados mockados em arquivos separados da interface.
- Use mais de um local e diferentes estados de fila.
- Inclua timestamps de atualização.
- Inclua casos sem estimativa, indisponíveis ou desatualizados para validar estados.
- Identifique os dados como simulados na interface (por exemplo, “Dados de demonstração”).
- Não use dados hardcoded diretamente dentro dos componentes.
- Não apresente números simulados como medições reais.

O mock deve ser determinístico o suficiente para uma demonstração acadêmica previsível. Se houver simulação de atualização, ela deve ser controlada e identificada como simulação.

### 5.3. Preparação para API real

Não invente URLs, endpoints, autenticação, campos ou contratos de uma API que não foram fornecidos.

- Centralize a URL-base em configuração apropriada.
- Centralize chamadas HTTP em um service.
- Trate timeout, resposta inválida e falha de rede.
- Valide ou normalize os dados recebidos antes de utilizá-los.
- Documente o contrato esperado e os pontos ainda dependentes da equipe de API/IoT.
- Não coloque segredos ou credenciais privadas no aplicativo.

Se o contrato da API for fornecido depois, adapte o repository sem espalhar mudanças pelas telas.

### 5.4. Semântica dos dados

Defina tipos explícitos. Exemplo ilustrativo, não contrato definitivo:

```ts
export type QueueLevel = 'low' | 'moderate' | 'high' | 'unknown';

export interface QueueLocation {
  id: string;
  name: string;
  category: 'ubs' | 'poupatempo' | 'other';
  address: string;
  description?: string;
}

export interface QueueStatus {
  locationId: string;
  level: QueueLevel;
  peopleCount?: number;
  estimatedWaitMinutes?: number;
  updatedAt: string;
  source: 'api' | 'mock';
}
```

Não use `0` para representar dado desconhecido. Diferencie ausência de informação de fila vazia. Evite `any`; prefira `unknown` com validação quando o formato recebido for incerto.

---

## 6. Banco de dados e persistência local

O enunciado exige salvar informações em banco de dados. Use uma solução de banco local compatível com Expo, preferencialmente **SQLite via `expo-sqlite`**, a menos que a inspeção do projeto anterior ou uma restrição técnica concreta recomende outra solução adequada.

Persistir pelo menos:

- Locais favoritados.
- Alertas criados pelo usuário.
- Preferências relevantes (por exemplo, filtro ou ordenação), se fizer sentido.

Não considere `useState`, AsyncStorage isolado ou uma variável em memória como cumprimento do requisito de banco de dados. Se optar por outra tecnologia, justifique no README por que ela atende ao requisito de banco de dados.

### Requisitos de persistência

- Criar e versionar/inicializar o schema de forma segura.
- Separar acesso ao banco em camada própria.
- Tipar os modelos e resultados.
- Tratar falha de inicialização e operações.
- Evitar duplicidade de favoritos e alertas.
- Atualizar a interface após operações de gravação.
- Manter os dados depois de encerrar e reabrir o app.

Não é necessário persistir toda resposta da API se isso não contribuir para a jornada principal. Não implemente um banco remoto ou autenticação sem necessidade expressa.

---

## 7. Acessibilidade e simplicidade

A acessibilidade é um dos seis critérios explícitos. Não a trate como acabamento opcional.

### Requisitos visuais e de interação

- Texto com tamanho confortável; evite textos pequenos.
- Contraste suficiente entre texto, fundo e estados.
- Botões e áreas de toque grandes.
- Não comunique fila tranquila/moderada/cheia apenas por cor: use texto e, se útil, ícone.
- Linguagem cotidiana, sem termos técnicos como “telemetria”, “payload”, “sensor PIR” ou “latência”.
- Hierarquia visual consistente e poucas ações por tela.
- Rótulos claros para ícones; não use ícones sem significado compreensível.
- Formulários curtos e com instruções objetivas.
- Feedback claro após favoritar, criar alerta ou cancelar alerta.

### Acessibilidade para tecnologias assistivas

- Use `accessibilityLabel`, `accessibilityHint` e `accessibilityRole` quando apropriado.
- Garanta ordem de foco coerente.
- Não esconda informação importante apenas em elementos decorativos.
- Respeite configurações de tamanho de fonte sempre que possível.
- Verifique se textos dinâmicos e estados de fila são compreensíveis por leitor de tela.

### Testes manuais

Teste a aplicação com:

- Fonte ampliada.
- Leitor de tela, quando disponível.
- Contraste e legibilidade em telas menores.
- Toque em todos os controles principais.
- Uso sem depender exclusivamente de cores.

---

## 8. Arquitetura, qualidade e padrões de implementação

Use o FrutigerChat como referência de qualidade e organização, mas adapte ao escopo.

### Diretrizes

- React Native + Expo + TypeScript.
- Utilize a versão do Expo compatível com o projeto e as exigências atuais da disciplina; não atualize dependências indiscriminadamente.
- Mantenha navegação consistente. Se o projeto estiver usando Expo Router, preserve-o, salvo justificativa técnica.
- Separe telas, componentes, hooks, services/repositories, tipos, banco de dados e utilitários.
- Utilize Context API apenas para estado realmente global, como preferências ou configuração compartilhada; não crie contextos desnecessários.
- Utilize hooks com propósito real. `useState`, `useEffect`, `useMemo` e `useCallback` devem ser empregados quando fizerem sentido, não apenas para cumprir uma lista.
- Remova listeners/subscriptions corretamente em `useEffect`.
- Evite lógica de negócio extensa dentro de componentes.
- Mantenha atualizações de estado imutáveis.
- Não use `any`.
- Não suprima erros de TypeScript com `@ts-ignore` ou casts indiscriminados.
- Não adicione dependências sem necessidade.
- Evite comentários óbvios ou com aparência artificial; escreva comentários apenas quando explicarem decisões não evidentes.

### Estrutura sugerida

Adapte a estrutura real do projeto, sem criar pastas vazias ou abstrações sem uso:

```text
app/ ou src/
  components/
    LocationCard.tsx
    QueueStatusBadge.tsx
    LoadingState.tsx
    ErrorState.tsx
    EmptyState.tsx
  screens/ ou rotas Expo Router
    HomeScreen.tsx
    LocationDetailsScreen.tsx
    FavoritesScreen.tsx
    AlertsScreen.tsx
  hooks/
    useLocations.ts
    useLocationDetails.ts
    useFavorites.ts
    useAlerts.ts
  services/ ou repositories/
    queueRepository.ts
    mockQueueRepository.ts
    apiQueueRepository.ts
    notificationService.ts
  database/
    database.ts
    migrations.ts
    favoritesRepository.ts
    alertsRepository.ts
  types/
    location.ts
    queue.ts
    alert.ts
  utils/
    formatters.ts
    queueStatus.ts
```

A estrutura final deve refletir o que realmente existe. Não mantenha arquivos redundantes nem duplique tipos.

---

## 9. Interface e identidade visual

A interface deve parecer um produto simples e confiável, não um protótipo técnico.

Direção visual:

- Visual limpo, moderno e acolhedor.
- Hierarquia clara entre nome do local, estado da fila e estimativa.
- Estados “Tranquila”, “Moderada”, “Cheia” e “Sem informação” apresentados com texto explícito.
- Componentes consistentes entre lista, detalhe, favoritos e alertas.
- Evitar excesso de cartões, gráficos ou indicadores que não ajudem na decisão.
- Não usar gráficos se não houver dados históricos reais ou simulados claramente identificados.
- Priorizar a informação prática e ações essenciais.

A aparência não pode prejudicar a acessibilidade. Não use fonte pequena, contraste fraco ou cores como único indicador.

---

## 10. Segurança, privacidade e limites de escopo

- Não solicitar cadastro/login se a jornada não exigir identificação.
- Não coletar dados pessoais desnecessários.
- Não colocar chaves privadas, tokens administrativos ou segredos no bundle mobile.
- Não criar backend, Firebase Functions ou serviço de envio de push neste trabalho.
- Não presumir que o app pode acessar diretamente sensores ou dispositivos IoT.
- Não afirmar que uma fila foi medida em tempo real se os dados vierem de mock.
- Não criar funções de administração de unidades ou sensores: não fazem parte da jornada mobile do cidadão.

---

## 11. Testes e validação

Antes de encerrar, valide o projeto de ponta a ponta.

### Fluxo principal obrigatório

1. Instalar e iniciar o aplicativo seguindo o README.
2. Abrir a tela inicial e visualizar locais.
3. Identificar locais com estados diferentes de fila.
4. Abrir os detalhes de um local.
5. Consultar a última atualização e a estimativa, quando disponíveis.
6. Favoritar um local.
7. Encerrar e reabrir o app e confirmar que o favorito permanece.
8. Criar um alerta.
9. Consultar e cancelar o alerta.
10. Testar loading, erro, estado vazio e dados indisponíveis.
11. Verificar navegação de ida e volta entre telas.
12. Testar legibilidade e controles com fonte ampliada.

### Verificações técnicas

- Executar o verificador TypeScript disponível no projeto.
- Executar lint, se configurado.
- Executar testes automatizados, se houver.
- Corrigir warnings e erros relevantes.
- Verificar inicialização do SQLite em instalação limpa.
- Verificar persistência após reinício.
- Verificar comportamento sem internet, quando aplicável.
- Não declarar um teste como aprovado se ele não foi executado.

Se algum teste não puder ser executado no ambiente do agente, registrar exatamente qual e por quê.

---

## 12. README e documentação obrigatórios

O README deve permitir que professor ou avaliador entenda e execute o aplicativo sem depender de explicações verbais.

Incluir:

1. Nome do projeto e descrição curta.
2. Problema que resolve e público-alvo.
3. Jornada principal do cidadão.
4. Funcionalidades implementadas.
5. Tecnologias e versões relevantes.
6. Pré-requisitos.
7. Instalação e execução passo a passo.
8. Como configurar a fonte de dados.
9. Explicação clara se a demonstração usa mock ou API real.
10. Estrutura de pastas e responsabilidades.
11. Banco de dados: tecnologia, tabelas/estrutura e o que é persistido.
12. Acessibilidade: decisões e recursos implementados.
13. Limitações conhecidas e integrações pendentes.
14. Prints reais das telas.
15. Como executar testes e verificações.
16. Integrantes, se os dados forem fornecidos. Não invente nomes ou identificadores.

Não documente funcionalidades que não existem. Não inclua prints conceituais como se fossem capturas do app final.

---

## 13. Plano de execução recomendado

Siga esta ordem para reduzir risco e garantir os critérios centrais:

### Etapa 1 — Inspeção e planejamento
- Inspecionar FrutigerChat, histórico Git e estrutura do workspace.
- Inspecionar o projeto Fila Humana já existente, se houver.
- Identificar dependências e estado atual.
- Registrar decisões de arquitetura e riscos.

### Etapa 2 — Fundação
- Configurar navegação e estrutura modular.
- Definir modelos e contratos dos dados.
- Criar camada mock funcional.
- Implementar estados de loading, erro e vazio.

### Etapa 3 — Jornada principal
- Implementar lista de locais.
- Implementar detalhes do local.
- Implementar apresentação de fila e atualização.
- Implementar favoritos.

### Etapa 4 — Banco de dados
- Configurar SQLite.
- Persistir favoritos e alertas.
- Testar reinicialização e integridade dos dados.

### Etapa 5 — Alertas e acessibilidade
- Implementar configuração e cancelamento de alertas.
- Implementar notificações apenas até o limite tecnicamente suportado pelo escopo mobile.
- Revisar acessibilidade em todas as telas.

### Etapa 6 — Qualidade e entrega
- Testar jornada completa.
- Corrigir erros de TypeScript e problemas de navegação.
- Revisar interface e estados.
- Produzir prints reais.
- Completar README.
- Verificar que o repositório está pronto para ser enviado.

---

## 14. Critérios de aceite — checklist final

### Telas e navegação
- [ ] A aplicação abre sem erro.
- [ ] A tela inicial lista locais de atendimento.
- [ ] É possível abrir os detalhes de um local.
- [ ] É possível navegar entre início, favoritos e alertas.
- [ ] Voltar e avançar entre telas funciona de forma previsível.
- [ ] Todas as telas têm loading, erro e estado vazio quando necessário.

### Consumo de dados
- [ ] Os dados vêm de API ou mock por uma camada separada.
- [ ] O mock está identificado como simulado.
- [ ] Os estados de fila são apresentados de forma compreensível.
- [ ] A última atualização é exibida.
- [ ] Falhas de rede/dados são tratadas.
- [ ] A interface não apresenta dados desconhecidos como zero ou como fatos.

### Banco de dados
- [ ] Existe banco de dados local funcional.
- [ ] Favoritos são persistidos.
- [ ] Alertas são persistidos.
- [ ] Os dados continuam disponíveis após fechar e reabrir o app.
- [ ] Acesso ao banco está separado da interface.

### Acessibilidade
- [ ] Textos são legíveis.
- [ ] Contraste é adequado.
- [ ] Botões têm áreas de toque confortáveis.
- [ ] Estados não dependem somente de cores.
- [ ] Controles têm rótulos acessíveis.
- [ ] A linguagem é simples e não técnica.

### Aderência ao problema
- [ ] O cidadão consegue descobrir qual local está mais tranquilo.
- [ ] O cidadão consegue consultar detalhes e estimativas disponíveis.
- [ ] O app ajuda a escolher quando ir, sem prometer precisão inexistente.
- [ ] A jornada principal pode ser demonstrada sem explicação técnica.
- [ ] O app deixa claro quando os dados são simulados ou estão desatualizados.

### Documentação
- [ ] README contém descrição e jornada do cidadão.
- [ ] README lista tecnologias e versões.
- [ ] README contém instruções de instalação e execução.
- [ ] README explica API/mock e banco de dados.
- [ ] README documenta arquitetura e acessibilidade.
- [ ] README contém prints reais.
- [ ] README registra limitações e integrações pendentes.
- [ ] Não há instruções inventadas nem funcionalidades documentadas que não existem.

### Qualidade técnica
- [ ] TypeScript sem `any`.
- [ ] Services/repositories separados da UI.
- [ ] Componentes reutilizáveis.
- [ ] Hooks usados com finalidade real.
- [ ] Sem erros relevantes no typecheck.
- [ ] Sem segredos no código.
- [ ] Testes executados e resultados registrados.

---

## 15. Regras finais para o agente

1. **Não amplie o escopo:** implemente somente o aplicativo mobile da Fila Humana.
2. **Não faça apenas telas estáticas:** a jornada deve funcionar.
3. **Não simule persistência:** use banco de dados real no dispositivo.
4. **Não esconda o uso de mock:** identifique-o claramente.
5. **Não invente contrato de API:** mantenha a integração isolada e documente dependências.
6. **Não adicione Firebase por hábito:** o enunciado atual não o exige.
7. **Não sacrifique acessibilidade pelo visual.**
8. **Não copie o chat:** aproveite os padrões de qualidade do FrutigerChat.
9. **Não alegue testes, integrações ou inspeções que não foram realizadas.**
10. **Priorize os seis critérios de avaliação em todas as decisões.**

### Entrega esperada do agente

Ao concluir, apresente um resumo objetivo contendo:

- O que foi implementado.
- Como cada um dos seis critérios foi atendido.
- Arquitetura e tecnologias utilizadas.
- Como executar o aplicativo.
- Testes realmente executados e seus resultados.
- O que ainda depende de API, IoT ou serviço externo.
- Limitações conhecidas.
- Arquivos principais alterados ou criados.

O resultado deve ser um aplicativo demonstrável, acessível, persistente e documentado — não apenas um protótipo visual.
