import Vue from 'vue';

import marked from 'marked';

const renderer = new marked.Renderer;

renderer.link = function (href, title, text) {
    const link = marked.Renderer.prototype.link.apply(this, [href, title, text]);

    return link.replace('<a', '<a target="_blank"');
};

function markdown(value: string): string {
    if (!value)
        return '';

    return marked(value, { renderer });
}

Vue.filter('markdown', markdown);
