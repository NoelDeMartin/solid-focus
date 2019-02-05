const SolidAuthClientMock = jest.genMockFromModule<any>('solid-auth-client');

SolidAuthClientMock.__fetchResults = [];

SolidAuthClientMock.fetch = jest.fn(async () =>
    new Response(SolidAuthClientMock.__fetchResults.shift())
);

SolidAuthClientMock.__addFetchResult = function (data: any = null) {
    SolidAuthClientMock.__fetchResults.push(data);
};

module.exports = SolidAuthClientMock;
