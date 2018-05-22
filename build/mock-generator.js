const fs = require('fs');
const path = require('path');
const swagmock = require('swagmock');
const flattenDeep = require('lodash').flattenDeep;

const src = '../design/yaml';
const resolve = (arg) => Promise.resolve(arg);

const getMock = fileName => (
    swagmock(`${src}/${fileName}`)
    .responses({})
    .catch(err => console.log(err))
);

const filterByExt = ext => fileName => {
    const fileExt = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
    return fileExt === ext;
};

const getMockObject = (dir) => (
    fs.readdirSync(dir)
    .filter(filterByExt('.swagger'))
    .map(getMock)
);

const concatMocks = (mocks) => resolve(
    mocks.sort()
    .reduce((s, m) => Object.assign({}, s, m), {})
);

const flat = (sum, e) => (e instanceof Array ? [...sum, ...e.reduce(flat, e)] : [...sum, e]);

const splitMocks = (wholeMock) => resolve(
    flattenDeep(Object.keys(wholeMock)
    .reduce((s, m) => (
        [...s, [...Object.keys(wholeMock[m]).map(method => (
            {
                fileName: `${m.split('/').filter(str => str !== '').join('-')}-${method}`,
                content : wholeMock[m][method]['responses']['200'] || {},
            }
        ))]]
    ), []))
);


const writeFile = mocks => resolve(
    mocks.forEach(mock => {
        fs.writeFileSync(`./mock/generate/${mock.fileName}.json`, JSON.stringify(mock.content, true, 4));
    })
);

Promise.all(getMockObject(src))
.then(concatMocks)
.then(splitMocks)
.then(writeFile)
.then(() => resolve(
    console.log('all done')
))
.catch(err => console.log(err))
