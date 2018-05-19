'use strict';
/* eslint-env node */
const fs = require('fs');
const path = require('path');
const babel = require('babel-core');

const files = process.argv.slice(2);

let compress = false;
let es6 = false;

function readFiles(options) {
    return options.map((option) => {
        if (option === '--compress') {
            compress = true;
            return null;
        }

        if (option === '--es6') {
            es6 = true;
            return null;
        }

        let fileContent = '';
        try {
            fileContent = fs.readFileSync(path.resolve('.', option + '.js'), {}).toString();
        } catch(e) {
            console.error(e);
            fileContent = `/* Error reading file ${option} */`;
        }

        return fileContent;
    }).filter((fileContent) => fileContent !== null);
}

function concat(files) {
    let bundle = files.join('\n\n');

    if (compress || es6) {
        const presets = [];
        if (es6) {
            presets.push('env');
        }
        if (compress) {
            presets.push('minify');
        }

        bundle = babel.transform(bundle, {
            presets,
        });
    }

    fs.writeFileSync(path.resolve('./bundle.js'), bundle.code || bundle, {});
}

concat(
    readFiles(
        files
    )
);