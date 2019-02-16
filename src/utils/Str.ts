class Str {

    public slug(text: string): string {
        return text
            .replace(/[^\d\w]/g, '-')
            .replace(/-+/g, '-')
            .toLowerCase();
    }

    public fixUrl(url: string): string {
        const index = url.indexOf('://') + 3;

        return url.substr(0, index) + url.substr(index).replace(/\/\//g, '/');
    }

}

export default new Str();
