# Revisão da entrega — Ambiance

Data: 17/09/2026.

## Verificações concluídas

| Verificação | Resultado |
|---|---|
| HTML: IDs únicos e destinos das âncoras | Aprovado |
| Referências locais no HTML | Todos os arquivos existem |
| Imagens dos seis produtos e suas galerias | Todos os arquivos existem |
| SVGs: imagens reservadas, ícones e favicon | 27 arquivos XML válidos |
| Imagens no HTML | `alt`, `width` e `height` presentes |
| Links estáticos com nova aba | `noopener noreferrer` presentes |
| Hierarquia principal | Um único H1 e idioma `pt-BR` |
| Dependências de execução | Nenhuma biblioteca, framework, npm, Node.js ou build |
| JavaScript completo | Sintaxe aceita por QuickJS |
| Renderização do catálogo | Seis cards gerados |
| Filtro Móveis | Dois cards |
| Filtro Iluminação | Um card |
| Categoria sem resultados | Estado vazio gerado |
| Categorias automáticas | Cinco botões, incluindo Todos |
| Destaques | Quatro cards gerados |
| Telefone não configurado | Retorno ao Instagram oficial |
| Mensagem por produto real | Nome preservado na mensagem |
| Mensagem de item demonstrativo | Consulta genérica às peças reais |
| URL de WhatsApp | Texto codificado com acentos e caracteres especiais |
| Escape de texto nos templates | Caracteres HTML escapados |
| Caminho de imagem inválido | Placeholder seguro retornado |
| Espaço para barra móvel | Acrescentada a área segura inferior ao padding do body |

A lógica foi executada em QuickJS com uma camada mínima de DOM simulada para os testes de geração. Isso valida dados, templates e funções centrais; **não equivale a um teste integrado em navegador**. Um telefone sintético foi usado somente na memória do teste de geração de URL, sem abrir o WhatsApp ou enviar mensagem. O arquivo entregue continua com `INSERIR_NUMERO`.

## Revisão de código

- As colunas principais usam `minmax(0, 1fr)`, layouts fluidos e dimensões relativas.
- O catálogo usa uma coluna em telas pequenas, duas a partir de 600 px e três a partir de 1200 px.
- Os destaques fazem rolagem dentro de seu próprio contêiner.
- Menu e modal usam `dialog` nativo, com bloqueio de scroll e retorno de foco.
- O modal contém tratamento de X, Escape, clique externo, miniaturas, setas e gestos horizontais.
- Animações são dispensadas em `prefers-reduced-motion: reduce`.
- O conteúdo editorial não depende do JavaScript; o catálogo oferece uma alternativa `noscript`.
- Não há afirmações de produtos reais, avaliações falsas, endereço ou telefone inventados.

## Limites da verificação

Não foi possível executar a revisão visual no navegador: o download do navegador local falhou por limitação de rede, e o navegador remoto disponível não permite abrir `localhost`. Assim, **não foram medidos overflow, sobreposição, dimensões renderizadas, comportamento de toque, foco nativo ou notas Lighthouse**.

As larguras solicitadas — 320, 360, 375, 390, 393, 412, 430, 768, 1024, 1280, 1440 e 1920 px — foram consideradas no CSS, mas **não foram testadas em navegador nesta entrega**. Não houve teste em aparelhos físicos iPhone, Android ou tablet.

## Roteiro de conferência no navegador

1. Abra `index.html` e use o modo responsivo nas larguras acima.
2. Confira se a página rola somente na vertical; o carrossel pode rolar horizontalmente em seu próprio espaço.
3. Abra o menu: a página deve parar de rolar; Tab deve ficar dentro do menu. Feche pelo X e por Escape.
4. Abra o menu novamente e selecione uma seção. Confirme a navegação e a liberação do scroll.
5. Selecione cada filtro: Móveis tem dois itens; Decoração, dois; Iluminação, um; Objetos, um.
6. Abra uma peça. Use as setas, as miniaturas e um gesto horizontal na imagem. Feche com X, Escape e pelo fundo externo.
7. Confira o retorno de foco ao botão que abriu o modal.
8. Deslize “Escolhas Ambiance” e experimente seus botões e as setas do teclado com o contêiner focado.
9. Sem telefone configurado, confirme que os links de consulta apontam para o Instagram. Depois de configurar um número real, confira o destinatário e a mensagem antes de enviar qualquer coisa.
10. Teste com JavaScript desativado e com preferência por movimento reduzido.
11. Faça a mesma revisão após trocar os placeholders pelas fotografias reais.
12. Rode Lighthouse na versão hospedada. A entrega não afirma ter alcançado a meta de 90+.
