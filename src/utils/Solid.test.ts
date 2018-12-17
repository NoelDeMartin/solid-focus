import Faker from 'faker';

import Str from '@/utils/Str';
import Arr from '@/utils/Arr';
import Solid from '@/utils/Solid';

describe('Solid', () => {

    it('creates containers', async () => {
        const baseUrl = Faker.internet.url();
        const containerUrl = baseUrl + '/' + Str.slug(Faker.random.word());
        const name = Faker.random.word();
        const location = '/' + Str.slug(Faker.random.word());
        const types = Arr
            .make(Faker.random.number({min: 2, max: 4}))
            .map(() => Faker.random.word());

        const RDFMock = require('rdflib');

        RDFMock.__addWebOperationResult({ Location: location });

        const container = await Solid.createContainer(containerUrl, name, types);

        expect(container.url).toBe(baseUrl + location);
        expect(container.name).toBe(name);
        expect(container.types).toBe(types);
        // TODO validate graph

        expect(RDFMock.Fetcher).toHaveBeenCalledTimes(1);

        const FetcherMock = RDFMock.Fetcher.mock.instances[0];

        expect(FetcherMock.webOperation).toHaveBeenCalledWith(
            'POST',
            containerUrl,
            // TODO validate body
            expect.anything()
        );
    });

});
