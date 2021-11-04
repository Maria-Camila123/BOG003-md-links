const {getAbsolute, getMdFile, getObjLinks, mdLinks} = require('../mdLinks.js');
const path = require('path')


const absolutePath = '/Users/mariacamila/Documents/LABORATORIA/MDlinks/BOG003-md-links/README-prueba.md';
const relativePath = './prueba.md';


describe('getAbsolute', () => {

  it('is a function', () => {
    expect(typeof getAbsolute).toBe('function')
  })

  it('should return an absolute path', () => {
    expect(getAbsolute(absolutePath)).toBe(absolutePath)
  })
  it('should return relative to absolute path', () => {
    expect(getAbsolute(relativePath)).toBe(absolutePath)
  })

});

/*describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

});*/
