# Landing Page Simulator

Mostra, em tempo real, uma demo de landing page montada a partir dos inputs do cliente
(header, body e footer), e permite baixar o resultado como HTML + CSS puro.

Stack: **React + TypeScript + Tailwind CSS + Vite**, com deploy na **Vercel**.

## Como rodar

```bash
nvm use          # usa a versão do Node definida em .nvmrc (24)
npm install      # instala as dependências
npm run dev      # servidor de desenvolvimento em http://localhost:5173
```

Outros scripts:

| Comando           | O que faz                                                         |
| ----------------- | ----------------------------------------------------------------- |
| `npm run build`   | Roda os testes, checa os tipos (`tsc -b`) e gera a versão de produção em `dist/`. Se um teste falhar, o build (e o deploy na Vercel) para |
| `npm run preview` | Serve o conteúdo de `dist/` localmente, igual ao que vai pra Vercel |
| `npm run lint`    | Roda o linter (oxlint) procurando problemas no código              |
| `npm test`        | Roda os testes em modo *watch* (re-executa ao salvar um arquivo)   |
| `npm run test:run`| Roda os testes uma vez e sai (bom para CI)                         |

## O papel de cada tecnologia

- **Vite** — ferramenta de build e servidor de desenvolvimento. Em dev, serve os arquivos
  direto pro navegador e aplica mudanças instantaneamente (HMR = Hot Module Replacement).
  No build, junta e minifica tudo em `dist/`.
- **React** — biblioteca para construir a interface em *componentes* (funções que retornam
  JSX, um "HTML dentro do JS"). Quando o *estado* muda, o React re-renderiza só o que precisa.
  É isso que vai permitir a demo atualizar enquanto o cliente edita o formulário.
- **TypeScript** — JavaScript com tipos. Pega erros antes de rodar (ex.: passar um número onde
  se esperava uma cor). Arquivos `.ts` / `.tsx` (`.tsx` = TypeScript + JSX).
- **Tailwind CSS** — CSS por classes utilitárias direto no JSX
  (`className="rounded-full bg-emerald-500 px-3"`), em vez de escrever arquivos `.css` separados.
  Só as classes usadas entram no CSS final.

## Testes

- **Vitest** — o test runner. Feito para Vite, então reaproveita a mesma config
  (plugins, TypeScript, JSX) sem setup extra. API parecida com a do Jest
  (`describe`, `it`, `expect`).
- **jsdom** — simula um navegador (DOM) dentro do Node, para os componentes terem onde renderizar.
- **React Testing Library** — renderiza componentes e busca elementos *como um usuário faria*
  (pelo texto, pelo papel — `button`, `heading` — ou pelo label), em vez de por classes CSS.
  Assim os testes não quebram quando você só muda o visual.
- **user-event** — simula interações reais (clicar, digitar) disparando os mesmos eventos do navegador.
- **jest-dom** — adiciona matchers legíveis como `toBeInTheDocument()` e `toHaveTextContent()`.

Convenção: o teste fica ao lado do componente, com o sufixo `.test.tsx`
(ex.: `App.tsx` → `App.test.tsx`). O Vitest encontra esses arquivos sozinho.

Um teste segue o padrão **Arrange → Act → Assert**:

```tsx
render(<App />)                                     // Arrange: monta o componente
await user.click(screen.getByRole('button'))        // Act: interage como usuário
expect(screen.getByRole('button')).toHaveTextContent('Count is 1') // Assert: confere o resultado
```

## Estrutura de arquivos

```
├── index.html            # Página HTML base. Tem um <div id="root"> onde o React é montado
├── src/
│   ├── main.tsx          # Ponto de entrada: pega o #root e renderiza o <App />
│   ├── App.tsx           # Componente principal: guarda o estado (config), gera o HTML e monta o layout
│   ├── App.test.tsx      # Testes de integração do App
│   ├── types.ts          # Tipos TypeScript da configuração da landing page
│   ├── defaultConfig.ts  # Valores iniciais do formulário e lista de fontes
│   ├── generateHtml.ts   # Gera o HTML + CSS puro da landing page a partir do config
│   ├── generateHtml.test.ts
│   ├── download.ts       # Baixa o HTML como arquivo (Blob + <a download>) e gera o nome do arquivo
│   ├── download.test.ts
│   ├── index.css         # CSS global. Só tem `@import "tailwindcss";`, que liga o Tailwind
│   ├── components/
│   │   ├── LandingPageForm.tsx       # Formulário com as seções Header, Body e Footer
│   │   ├── LandingPageForm.test.tsx  # Testes do formulário
│   │   ├── Preview.tsx               # Mostra o HTML gerado dentro de um <iframe>
│   │   └── fields.tsx                # Campos reutilizáveis (texto, cor, select, fundo…)
│   └── test/setup.ts     # Roda antes dos testes: carrega os matchers do jest-dom e limpa o DOM
├── public/               # Arquivos servidos como estão, na raiz do site (ex.: /favicon.svg)
├── vite.config.ts        # Config do Vite (plugins do React e do Tailwind) e do Vitest (bloco `test`)
├── tsconfig*.json        # Config do TypeScript (app = código do navegador, node = vite.config)
├── .oxlintrc.json        # Config do linter
├── .nvmrc                # Versão do Node do projeto (lida pelo `nvm use`)
└── package.json          # Dependências, scripts e versão do Node (`engines`, lida pela Vercel)
```

### Fluxo de uma requisição

1. O navegador abre `index.html`.
2. O `index.html` carrega `src/main.tsx`.
3. `main.tsx` importa o CSS global (com o Tailwind) e renderiza `<App />` dentro de `#root`.
4. Tudo que aparece na tela vem de `App.tsx` e dos componentes que ele usar.

### Fluxo dos dados

```
App  ── config ──▶  LandingPageForm  ── value ──▶  campos (TextField, ColorField…)
 │▲                       │                               │
 │└──── setConfig ◀── onChange(config novo) ◀── onChange(valor novo)
 │
 └─── html = generateHtml(config) ──┬──▶  Preview  ──▶  <iframe srcDoc={html}>
                                   └──▶  botão "Baixar HTML"  ──▶  downloadHtml(html, "titulo.html")
```

O estado (`config`) mora no `App`. O formulário e os campos são *controlados*: só mostram o
valor que recebem por props e avisam mudanças via `onChange`. O `App` atualiza o estado e o
React re-renderiza tudo com o valor novo, inclusive a preview.

### Preview = arquivo baixado

`generateHtml(config)` monta a landing page como um texto HTML com CSS puro embutido. A preview
mostra esse texto num `<iframe>`, e o botão "Baixar HTML" salva o mesmo texto num arquivo, então o
que o cliente vê é exatamente o que ele baixa. O iframe é um documento isolado: o Tailwind do
app não interfere na landing page e vice-versa.

O download acontece todo no navegador, sem servidor: o texto vira um `Blob` (arquivo em memória),
ganha uma URL temporária (`blob:...`) e um link `<a download="nome.html">` invisível é clicado.

Como o texto do cliente vai parar dentro do HTML, ele é *escapado* (`<` vira `&lt;` etc.),
cores e fontes são validadas, e o iframe roda com `sandbox` (sem scripts).

## Deploy

O deploy é feito pela integração GitHub ↔ Vercel: todo push na `main` gera um deploy de
produção, e pushes em outras branches/PRs geram deploys de preview. A Vercel detecta o Vite
automaticamente (build: `npm run build`, saída: `dist/`), então não é preciso `vercel.json`.
