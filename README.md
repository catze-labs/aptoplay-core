![image](https://user-images.githubusercontent.com/65929678/216216243-440bcb5c-5052-4946-9cad-47a98842e363.png)

# aptoplay-core

> Effortless Integration, Seamless Experience in Aptos gaming solutions for game builders

## APTOPLAY - Aptos Seoul Hack 2023 Buidle

The goal of this library is to provide a better developer experience (DX) for the integration of Aptos Chain between Game development, and more features will be added through ongoing updates.

If you encounter any bugs or areas that need improvement about server, please [create an issue](https://github.com/catze-labs/aptoplay-core/issues/new).  
We will do our best to assist with your issue reporting.

## Installation

```bash
npm install aptoplay-core

# OR

yarn add aptoplay-core
```

## How to use

> Notice : We test and use in backend (server).

First step to use, Import library in your code.

You can see more [example](https://aptoplay-web.vercel.app)

```ts
import { AptoPlay } from 'aptoplay-core';

//...

const AptoPlay = new AptoPlay(
  'your playfab title id',
  'your title x-secret-key'
);
```

## Library Dependencies

- TypeScript >= 4.x
- Axios
