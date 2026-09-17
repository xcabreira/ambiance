# Ambiance — catálogo editorial

Landing page completa em **HTML5, CSS3 e JavaScript Vanilla**, sem frameworks, npm, Node.js, backend, dependências de execução ou compilação. Abra `index.html` diretamente. Os caminhos relativos também funcionam em subpastas do GitHub Pages.

## Situação desta entrega

A interface está funcional. Como não foram fornecidos telefone, endereço, horários, fotografias ou um inventário confirmado, a entrega usa **placeholders gráficos identificados** e **seis registros demonstrativos**. Eles não representam produtos da Ambiance. O Instagram informado não pôde ser consultado para extrair fotos ou identidade visual.

Não existem avaliações fictícias, disponibilidade inventada, preços, carrinho, checkout, cadastro, pagamento ou pedidos. Os textos de apresentação são propostas editoriais, a validar pela marca. A tipografia utiliza Georgia e Arial, fontes de sistema, evitando requisições externas.

**Sem o telefone configurado, os botões de contato abrem o Instagram.** O modal informa explicitamente esse destino. Nenhuma mensagem é enviada automaticamente. Com um telefone válido, os links passam a abrir o WhatsApp com a mensagem preenchida.

## Executar

1. Extraia o ZIP.
2. Abra `ambiance/index.html` no navegador.
3. Não é necessário instalar nenhum programa para executar o site.

Para editar, use um editor de texto. Depois de salvar, atualize o navegador. O script é clássico (`defer`), não usa módulos nem `fetch`, para funcionar também com `file://`.

## Estrutura

```text
ambiance/
├── index.html
├── README.md
├── VERIFICACAO.md
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── images/
    │   ├── hero/
    │   ├── products/
    │   ├── environments/
    │   ├── instagram/
    │   └── about/
    ├── icons/
    │   ├── arrow-up-right.svg
    │   ├── arrow-left.svg
    │   ├── arrow-right.svg
    │   ├── close.svg
    │   └── chat.svg
    └── favicon/
        └── favicon.svg
```

As pastas de imagens já contêm todos os placeholders utilizados; não há links de imagens pendentes. Os ícones podem ser reutilizados. O contato flutuante usa SVG inline para herdar a cor. Setas e sinais de fechar são caracteres nativos com nomes acessíveis nos controles.

## Configurar o WhatsApp

No início de `js/script.js`, altere:

```js
const WHATSAPP_NUMBER = 'INSERIR_NUMERO';
```

Coloque o telefone real, somente dígitos: DDI `55`, DDD e número. Não use `+`, espaços, parênteses ou hífens. A validação é de formato; confirme que o número pertence à Ambiance e recebe WhatsApp.

A função `createWhatsAppLink(message)` usa `encodeURIComponent`, preservando acentos, espaços e caracteres especiais.

Mensagem geral:

> Olá! Conheci a Ambiance pelo site e gostaria de conhecer melhor os produtos.

Para produto real (`demonstrativo: false`):

> Olá! Vi o produto [nome] no catálogo da Ambiance e gostaria de mais informações.

Itens demonstrativos usam uma mensagem genérica para conhecer as peças reais, sem sugerir que o exemplo pertence ao acervo.

## Alterar Instagram e contato

Edite `CONFIG` no início de `js/script.js`:

```js
const CONFIG = {
  instagram: 'URL_REAL_DO_INSTAGRAM',
  siteUrl: '',
  address: '',
  hours: '',
  phoneLabel: '',
  mapsUrl: '',
};
```

- `instagram`: perfil oficial. O JavaScript atualiza todos os links com `data-instagram`.
- **Atualize também os links do Instagram no HTML** para manter o endereço correto sem JavaScript. Use localizar/substituir para `https://www.instagram.com/lojaambiance/`.
- `address`: endereço real. Campo vazio permanece oculto.
- `hours`: horários reais; `\n` insere quebra de linha.
- `phoneLabel`: número formatado, opcional. O destino continua baseado em `WHATSAPP_NUMBER`.
- `mapsUrl`: URL HTTPS real do Google Maps. É um link, sem iframe, cookies de mapa ou carregamento pesado.
- `siteUrl`: endereço público completo, com `/` ao final. A aplicação insere o canonical quando configurado. Inclua também a versão estática no HTML para mecanismos que não executam JavaScript.

## Substituir as imagens

Use apenas fotos da loja ou imagens autorizadas. Os placeholders **não devem ser apresentados como fotografias reais**.

1. Coloque a foto na pasta correspondente em `assets/images/`.
2. Prefira nomes minúsculos, sem espaços nem acentos, como `sala-principal.webp`.
3. No HTML ou no objeto de produto, altere o caminho para a nova foto.
4. Atualize o texto `alt` para descrever a foto real.
5. Ajuste `width` e `height` aos valores reais do arquivo. O CSS conserva a proporção do espaço visual com `aspect-ratio` e recorta usando `object-fit: cover`.
6. Quando necessário, ajuste `object-position`, por exemplo `center 40%`, na imagem ou em uma classe própria.
7. Remova a indicação “ESPAÇO PARA FOTOGRAFIA REAL”, “Imagem a inserir” ou “FOTO A INSERIR” somente daquele espaço já substituído.

### Mapeamento dos principais espaços

| Seção | Arquivo inicial | Proporção visual aproximada |
|---|---|---|
| Hero | `assets/images/hero/hero-placeholder.svg` | Adaptada à viewport; foto ampla, assunto central |
| Curadoria | `assets/images/environments/curadoria-placeholder.svg` | 4:5 |
| Detalhe sobreposto | `assets/images/products/detalhe-placeholder.svg` | 4:5 |
| Sala | `assets/images/environments/sala-placeholder.svg` | Vertical |
| Jantar | `assets/images/environments/jantar-placeholder.svg` | Horizontal |
| Detalhes | `assets/images/environments/detalhes-placeholder.svg` | Horizontal |
| Editorial | `assets/images/environments/editorial-placeholder.svg` | 6:5 |
| Campanha | `assets/images/hero/campanha-placeholder.svg` | Horizontal |
| Sobre | `assets/images/about/loja-placeholder.svg` | 12:13 |
| Instagram | `assets/images/instagram/instagram-01-placeholder.svg` até `06` | 6:7 |
| Produtos | Arquivos em `assets/images/products/` | 4:5 nos cards |

As seis imagens da seção Instagram são manuais. Não há API, scraping, feed automático ou dependência de login. Os links levam ao perfil oficial, não a publicações fictícias.

### Otimização

- Hero: exporte WebP/AVIF ou JPEG otimizado, aproximadamente 1600–1920 px de largura, procurando manter até 250–350 KB sem perda visível.
- Produto: aproximadamente 800–1000 px de largura, preferencialmente abaixo de 150 KB.
- Instagram: 500–600 px de largura costuma bastar.
- O hero já tem `fetchpriority="high"`. As imagens abaixo dele usam `loading="lazy"`.
- Para variantes por largura, adicione `srcset` e `sizes` com os arquivos que realmente existem. Não foram incluídos caminhos fictícios.
- Uma imagem de produto inexistente recebe um placeholder e um `alt` explicando a indisponibilidade.

## Adicionar produtos

Todos os produtos ficam no array `produtos` de `js/script.js`. Não crie cards manualmente no HTML. Duplique um objeto e preencha **dados reais**, seguindo este esquema:

```js
{
  id: 'identificador-unico',
  nome: 'NOME REAL DA PEÇA',
  categoria: 'CATEGORIA REAL',
  imagem: 'assets/images/products/foto-real.webp',
  galeria: [
    'assets/images/products/foto-real.webp',
    'assets/images/products/foto-real-detalhe.webp'
  ],
  descricao: 'DESCRIÇÃO APROVADA PELA LOJA',
  material: 'MATERIAL REAL OU Consultar',
  medidas: 'MEDIDAS REAIS OU Consultar',
  destaque: true,
  demonstrativo: false
}
```

Este bloco é apenas a documentação do formato. Use arquivos existentes e informações confirmadas. Separe os objetos por vírgula e mantenha IDs únicos. Não use a categoria reservada `Todos` como categoria de produto.

- A imagem principal também integra a galeria automaticamente; duplicatas são removidas.
- Com apenas uma foto, controles e miniaturas são ocultados automaticamente.
- O modal aceita mouse, teclado e gestos horizontais na imagem.
- `destaque: true` inclui a peça em “Escolhas Ambiance”; o limite visual é de oito peças. Selecione quatro a oito para o layout proposto.
- `demonstrativo: true` mantém rótulos explícitos e a mensagem de consulta genérica.
- A ordem no array define a ordem dos cards.

## Remover produtos

Apague o objeto completo, ajustando as vírgulas. Filtros, catálogo e destaques serão recalculados. Se não houver produtos, aparece um estado vazio com orientação de contato. Se não houver destaques, a seção correspondente é ocultada.

## Adicionar ou remover categorias

Basta usar um novo valor em `categoria`. Os botões são gerados automaticamente a partir dos produtos, sem editar HTML. Uma categoria desaparece quando nenhum produto a utiliza. Use a mesma grafia e capitalização para não criar categorias duplicadas.

## Ajustar identidade visual

As variáveis estão no início de `css/style.css`:

```css
:root {
  --color-background: #f5f1eb;
  --color-text: #292721;
  --color-accent: #98836b;
  --color-dark: #252923;
  --font-title: Georgia, 'Times New Roman', serif;
  --font-body: Arial, Helvetica, sans-serif;
  --container-width: 1320px;
}
```

O logotipo é uma assinatura tipográfica provisória, não uma reprodução do logotipo oficial. Substitua por um SVG autorizado se houver. Para usar Cormorant Garamond/Inter ou outra combinação, acrescente arquivos WOFF2 licenciados localmente, declare `@font-face` com `font-display: swap` e atualize as variáveis. O projeto atual não depende de Google Fonts ou qualquer serviço externo.

## Depoimentos

A seção `#depoimentos` está com `hidden` e vazia por intenção. Depois de obter um depoimento real e autorizado, insira um `figure` com `blockquote` e `figcaption` em `#testimonials` e retire `hidden` da seção. Não há avaliação fictícia visível nem dados estruturados de avaliação.

## Comportamentos implementados

- Header transparente que recebe fundo ao rolar.
- Menu móvel em tela cheia, fechamento por botão, item e Escape; bloqueio do scroll e foco contido por `dialog` nativo.
- Filtros por categoria, contagem acessível e cards gerados pelo array.
- Modal de produto com galeria, miniaturas, setas, swipe e retorno de foco.
- Fechamento por X, Escape e clique no fundo externo do modal.
- Destaques com scroll-snap, controles, teclado e toque nativo.
- Links dinâmicos para WhatsApp, fallback para Instagram e mensagens por produto real.
- Animações leves com CSS e `IntersectionObserver`; respeito a movimento reduzido.
- Ano dinâmico, navegação por âncoras, foco visível, skip link, HTML semântico.
- Textos principais, navegação, seções editoriais e contato legíveis sem JavaScript. O catálogo dinâmico usa um aviso `noscript` com acesso direto ao Instagram.

## Publicar no GitHub Pages

Estas etapas são manuais na sua conta. Nenhum repositório foi criado ou publicado por esta entrega.

1. Crie um repositório no GitHub, por exemplo `ambiance`.
2. Envie **o conteúdo** da pasta `ambiance/` para a raiz do repositório: `index.html`, `css/`, `js/`, `assets/` e os arquivos de documentação.
3. Não envie somente o ZIP; o GitHub Pages precisa dos arquivos extraídos.
4. Em **Settings → Pages**, escolha publicação por branch (**Deploy from a branch**).
5. Selecione a branch `main` e a pasta `/ (root)`, depois salve.
6. Aguarde a publicação. O endereço de um repositório de projeto costuma seguir `https://SEU_USUARIO.github.io/ambiance/`. Use o endereço exibido pelo próprio GitHub.
7. Configure `CONFIG.siteUrl` e o `<link rel="canonical">` estático com esse endereço real.
8. Inclua `og:url` e `og:image` no `<head>` com URLs absolutas reais. Para `og:image`, use uma foto ou composição autorizada da marca, idealmente 1200 × 630.
9. Depois de substituir todo conteúdo demonstrativo e revisar os dados reais, altere a meta `robots` de `noindex, follow` para `index, follow`.
10. Abra a URL no celular, confirme o destinatário do WhatsApp e faça a revisão visual das fotografias reais.

Referência: [Documentação oficial do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Os nomes e a posição dos controles no GitHub podem variar. Os arquivos não exigem build, GitHub Actions personalizado ou servidor próprio.

## Antes de usar publicamente como site oficial

- Configure o número real e confira manualmente quem recebe o contato.
- Substitua fotos, inventário e assinatura visual provisórios.
- Complete endereço e horários, se a empresa desejar divulgá-los.
- Valide o texto institucional com a loja.
- Remova `.demo-note` e os avisos `.catalog-note` de demonstração **somente quando os respectivos dados estiverem reais**. Alguns `.catalog-note` descrevem a seção Instagram; adapte-os separadamente.
- Configure canonical, Open Graph e indexação com o domínio final.
- Teste a página depois de adicionar as fotos. Arquivos grandes podem reduzir desempenho.

## Verificação e limites

Consulte `VERIFICACAO.md` para os resultados da revisão desta entrega. As metas Lighthouse 90+ são objetivos, não notas prometidas. A medição definitiva depende das fotografias reais, do host e da rede. O site usa recursos nativos de navegadores modernos, incluindo `dialog`, `IntersectionObserver`, `svh/dvh`, Grid e Flexbox.
