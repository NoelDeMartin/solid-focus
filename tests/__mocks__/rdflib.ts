const rdflib = require('rdflib');
const RDFMock = jest.genMockFromModule<any>('rdflib');

const spies = ['Namespace', 'graph', 'parse', 'sym'];
for (const spy of spies) {
    RDFMock[spy] = jest.spyOn(rdflib, spy);
}

const original = ['NamedNode'];
for (const originalMember of original) {
    RDFMock[originalMember] = rdflib[originalMember];
}

RDFMock.__webOperationResults = [];

RDFMock.Fetcher = jest.fn(function (this: any) {
    this.webOperation = jest.fn(() => RDFMock.__webOperationResults.shift());
});

RDFMock.__addWebOperationResult = function (headers: {} = {}) {
    RDFMock.__webOperationResults.push({
        headers: new Headers(headers),
    });
};

module.exports = RDFMock;
