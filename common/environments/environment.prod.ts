// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.dev.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  dashboardApi: 'https://dashboard-api.merit.me/',
  mwsApiUrl: 'https://mws.merit.me/bws/api/v1/',
  coreAddress: 'MGgAma9epMrSipSm9Y2YjCWGGSt7gJWzM7',
  nPowTargetTimeSpan: 300,
};

export { environment as ENV };
