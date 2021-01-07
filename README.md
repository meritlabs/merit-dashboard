# MeritDashboard

Merit Dashboard UI - frontend part of the dashboard project, serving to display basic informattion about Merit blockchain, mining info, wallets.

## Getting started

To work on this project, you need:
- node.js
- yarn

Start with installing dependencies:
```
yarn # install global deps
cd desktop && yarn && cd .. 
```

Check the environment file in `common/environments` folder.

Run the project:
```
yarn start
```

Building bundles for production and development needs:
```
yarn build
yarn build:prod
```

Project iis deployed to firebase, use next command to depoy it:
```
./deploy.sh
```

## Contributing

Please, check out our [Contribution guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

**Code released under [the MIT license](./LICENSE).**

Copyright (C) 2017 - 2021 The Merit Foundation.
