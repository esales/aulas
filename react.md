# React básico: exibindo dados de uma API

## Objetivo

Criar uma página React que consulta um endpoint HTTP e apresenta os dados recebidos em uma lista.

Ao final, você deverá compreender:
- O que é um componente React e JSX.
- Como armazenar dados com `useState`.
- Como executar uma consulta com `useEffect`.
- Como consumir um endpoint com `fetch`.
- Como apresentar carregamento, erro e lista vazia.

## 1. O que é React?

React é uma biblioteca JavaScript utilizada para construir interfaces de usuário. 
Em vez de desenvolver uma página inteira como um único bloco de HTML, dividimos a interface em pequenas partes chamadas componentes.
Cada um dos componentes são partes independentes e reutilizáveis da página.

Por exemplo, em uma aplicação de filmes:
- App: componente principal.
- ListaFilmes: Componente que apresenta a lista de filmes. Está dentro do componente App.
- ItemFilme: Componente que apresenta um filme. Está dentro do componente ListaFilmes.

Obs: ListaFilmes contem uma coleção de ItemFilme.

Um componente é geralmente uma função JavaScript que retorna JSX:

```js
function App() {
  return <h1>Minha aplicação</h1>;
}

export default App;
```

## 2. JSX

JSX é uma sintaxe que permite escrever estruturas semelhantes a HTML dentro do JavaScript.

```jsx
function App() {
  const nome = 'React';

  return (
    <div>
      <h1>Aprendendo {nome}</h1>
      <p>Minha primeira aplicação.</p>
    </div>
  );
}
```

Observe:
- O componente retorna uma estrutura JSX.
- JavaScript pode ser utilizado dentro de {}.
- A estrutura retornada deve ter um elemento principal.
- A sintaxe é semelhante a HTML, mas possui algumas diferenças.

Por exemplo, em JSX usamos className em vez de class:

```js
<div className="container">
  Conteúdo
</div>
```

## 3. Props: dados entre componentes
Props são informações enviadas de um componente para outro. Permitem que um componente seja reutilizado com dados diferentes.

Imagine um componente que apresenta um filme:

```js
function ItemFilme({ titulo, ano }) {
  return (
    <div>
      <h2>{titulo}</h2>
      <p>{ano}</p>
    </div>
  );
}
```

Podemos utilizá-lo assim:
```js
function App() {
  return (
    <div>
      <ItemFilme titulo="Matrix" ano={1999} />
      <ItemFilme titulo="Interestelar" ano={2014} />
    </div>
  );
}
```
O mesmo componente apresenta filmes diferentes conforme as propriedades recebidas.

Diferença importante:
- Props: dados recebidos de outro componente.
- State: dados controlados pelo próprio componente.

## 4. Estado: useState
O estado representa informações que podem mudar durante a execução da aplicação.

Por exemplo:
- Uma lista de filmes recebida da API.
- O nome digitado em um formulário.
- A quantidade de produtos no carrinho.
- Se um menu está aberto ou fechado.

O hook useState permite criar e atualizar um estado.

```js
import { useState } from 'react';

function App() {
  const [contador, setContador] = useState(0);

  return (
    <div>
      <p>Contador: {contador}</p>

      <button onClick={() => setContador(contador + 1)}>
        Incrementar
      </button>
    </div>
  );
}

export default App;
```

Entendendo a declaração:

```js
const [contador, setContador] = useState(0);
```


| Elemento | Significado |
| :--- | :--- |
| `useState(0)` | Cria um estado com valor inicial 0 |
| `contador` | Valor atual do estado |
| `setContador` | Função para atualizar o estado |


Quando chamamos setContador, o React atualiza o estado e renderiza novamente o componente para apresentar o novo valor.

Uma regra fundamental: não altere diretamente o valor do estado. Utilize a função de atualização.

Incorreto:
```js
contador = contador + 1;
```

Correto:
```js
setContador(contador + 1);
```

## 5. Renderização
Renderizar significa produzir a interface que será apresentada na tela.

Quando o componente é executado, o React utiliza o JSX retornado para atualizar a interface.

Quando um estado muda, o React renderiza novamente o componente, refletindo os novos valores.

Isso evita que o programador precise manipular manualmente o HTML para atualizar cada informação.

## 6. Listas e map
É comum receber um array de dados de uma API e precisar apresentar cada registro na tela.

O método map permite percorrer um array e produzir elementos JSX:
```js
const filmes = [
  { id: 1, titulo: 'Matrix' },
  { id: 2, titulo: 'Interestelar' }
];

function App() {
  return (
    <ul>
      {filmes.map((filme) => (
        <li key={filme.id}>
          {filme.titulo}
        </li>
      ))}
    </ul>
  );
}
```

A propriedade key identifica cada elemento da lista. Deve ser única e estável entre os itens.

## 7.Eventos
O React permite responder às ações do usuário, como cliques, digitação e envio de formulários.

Exemplo:
```js
function App() {
  function mostrarMensagem() {
    alert('Botão clicado!');
  }

  return (
    <button onClick={mostrarMensagem}>
      Clique aqui
    </button>
  );
}
```

Observe que usamos onClick para tratar o clique.

Eventos também podem atualizar estados:
```js
<button onClick={() => setContador(contador + 1)}>
  Incrementar
</button>
```

## 8. useEffect
O useEffect permite executar operações relacionadas ao ciclo de vida do componente, como consultar uma API.

```js
import { useEffect } from 'react';

useEffect(() => {
  // Executa após a renderização inicial
}, []);
```

O array vazio indica que o efeito deve ser executado na montagem do componente.

No nosso tutorial, ele será utilizado para consultar o endpoint quando a página for carregada.