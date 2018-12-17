const rdflib = require('rdflib');
const mock = jest.genMockFromModule<any>('rdflib');

mock.Namespace = jest.spyOn(rdflib, 'Namespace');

mock.__webOperationResults = [];
mock.Fetcher = jest.fn(function (this: any) {
    this.webOperation = jest.fn(() => {
        return mock.__webOperationResults.pop();
    });
});

mock.__addWebOperationResult = function (headers: {} = {}) {
    mock.__webOperationResults.push({
        headers: new Headers(headers),
    });
};

module.exports = mock;
