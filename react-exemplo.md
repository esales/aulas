## 1. Criando o projeto

Utilize Vite para criar o projeto:

```bash
npm create vite@latest lista -- --template react
cd lista
npm install
npm run dev
```

O Vite inicia o servidor de desenvolvimento e informa o endereço local para acessar a aplicação.

## 2. Estado com useState

A aplicação precisa armazenar os dados recebidos do endpoint:

```js
const [itens, setItens] = useState([]);
```

- `itens`: valor atual do estado.
- `setItens`: função utilizada para atualizar o estado.
- `[]`: valor inicial, uma lista vazia.

Quando o estado é atualizado, o React renderiza novamente o componente.

## 4. Efeito com useEffect

A consulta deve acontecer quando a página for carregada:

```js
useEffect(() => {
  // Código executado após a renderização
}, []);
```

O array vazio indica que o efeito deve ser executado na montagem do componente.

## 5. Consultando um endpoint

A função `fetch` realiza uma requisição HTTP:

```javascript
const resposta = await fetch('http://localhost:3000/api/itens');
const dados = await resposta.json();
```

## 6. Exibindo uma lista

O método `map` transforma cada elemento de um array em um elemento JSX:

```js
<ul>
  {itens.map((item) => (
    <li key={item.id}>{item.nome}</li>
  ))}
</ul>
```

A propriedade `key` deve ser estável e única entre os elementos da lista.

## 7. Formato esperado da resposta

Neste tutorial, o endpoint retorna um array JSON:

```json
[
  { "id": 1, "nome": "Item 1" },
  { "id": 2, "nome": "Item 2" },
  { "id": 3, "nome": "Item 3" }
]
```

## 8. API

Essa aplicação irá receber os dados da aplicação de filmes.
Para isso, iremos criar mais um endpoint nessa aplicação:

```js
router.get('/api/filmes', async (req, res) => {
    try{
        const filmes = await Filme.findAll({raw: true});
        res.json(filmes);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao consultar filmes' });
    }
});
```

## 9. Execução
Abrir um terminal e executar a aplicação Filmes:
```bash
node --watch app.js
```

Em outro terminal, executar a aplicação react Lista:
```bash
npm run dev
```


