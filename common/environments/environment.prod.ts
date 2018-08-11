// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.dev.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  dashboardApi: 'https://cors-now.herokuapp.com/http://167.99.179.33:8301/',
  mwsApiUrl: 'https://mws.merit.me/bws/api/v1/',
  coreAddress: 'MGgAma9epMrSipSm9Y2YjCWGGSt7gJWzM7',
  nPowTargetTimeSpan: 1140,
};

export { environment as ENV };
