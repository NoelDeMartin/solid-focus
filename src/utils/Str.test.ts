import Str from './Str';

describe('Str', () => {

    it('creates slug', () => {
        expect(Str.slug('Foo Bar')).toBe('foo-bar');
    });

});
