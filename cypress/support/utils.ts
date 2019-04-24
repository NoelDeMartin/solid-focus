export const getRuntime = () => cy.window().its('Runtime').then(runtime => runtime!);

export const getApp = () => getRuntime().then(runtime => runtime.instance);
