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
| `npm run build`   | Checa os tipos (`tsc -b`) e gera a versão de produção em `dist/`   |
| `npm run preview` | Serve o conteúdo de `dist/` localmente, igual ao que vai pra Vercel |
| `npm run lint`    | Roda o linter (oxlint) procurando problemas no código              |

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

## Estrutura de arquivos

```
├── index.html            # Página HTML base. Tem um <div id="root"> onde o React é montado
├── src/
│   ├── main.tsx          # Ponto de entrada: pega o #root e renderiza o <App />
│   ├── App.tsx           # Componente principal (hoje é a página de exemplo do Vite)
│   ├── App.css           # Estilos da página de exemplo (vai sumir quando a gente trocar a página)
│   ├── index.css         # CSS global. A 1ª linha `@import "tailwindcss";` liga o Tailwind
│   └── assets/           # Imagens importadas pelo código (passam pelo build do Vite)
├── public/               # Arquivos servidos como estão, na raiz do site (ex.: /favicon.svg)
├── vite.config.ts        # Config do Vite: plugins do React e do Tailwind
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

## Deploy

O deploy é feito pela integração GitHub ↔ Vercel: todo push na `main` gera um deploy de
produção, e pushes em outras branches/PRs geram deploys de preview. A Vercel detecta o Vite
automaticamente (build: `npm run build`, saída: `dist/`), então não é preciso `vercel.json`.
