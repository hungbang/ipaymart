# IpayMart

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
=======
# ipaymart


## Deploy project to ipfs

1. Start Ipfs daemon to create a node

`ipfs daemon`
2. To get your peers that will share content

`ipfs swarm peers`
3. To add your `dist` folder to the network. This will generate a long hash for you.

`ipfs add -r dist/`

You'll see like this: 

```added QmVm7xwJj8PnS1ysNYoh3KnwPfjQmqtd51nnMAX6FSpetr dist/static/ckeditor/skins/moono-lisa
  added QmQZsFrE61EQm7QikWBxRX1GLRx4sLevdH3ShTR14sYz2B dist/static/ckeditor/skins
  added QmcrL4BkiUruMkTZaur6esvsRUVXmwJ4RfMn2Ddt2WYTDE dist/static/ckeditor
  added QmaGhEcNmo1mwTVvJDtF3dvBwASN7vQoYGxQXcLPj28a4B dist/static
  added QmTSBEi5BXtCZw7krCr9mreSpw6WZuaGWnMpucasY1tt4j dist
```

4. To publish, copy last hash and execute: 

`ipfs name publish QmTSBEi5BXtCZw7krCr9mreSpw6WZuaGWnMpucasY1tt4j`

You'll get something like this: 

```
Published to QmbHpf6y6hVQ3wzk3A5rV4cPhtJNbai69hsLU8ssbPdcCc: /ipfs/QmTSBEi5BXtCZw7krCr9mreSpw6WZuaGWnMpucasY1tt4j
```

* It will take a sometime to load. Then check your app: https://ipfs.infura.io/ipfs/QmTSBEi5BXtCZw7krCr9mreSpw6WZuaGWnMpucasY1tt4j

* [Public IPFS Gateways](https://ipfs.github.io/public-gateway-checker/)

* [Resize image lib](https://alligator.io/angular/resizing-images-in-browser-ng2-img-max/)


## Latest deploy hash :

`Published to Qmf53cHS9HWP2pJK8gkf66iP4srM9qhXkG5FCh3ZYFUV1i: /ipfs/QmSw2HTJuTVKx3gMAzFipu9Lkhk66pqxSGzjdNRWbUPD1S
`
