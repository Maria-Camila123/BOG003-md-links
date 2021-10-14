const fs = require('fs')
const path = require('path')
const fsp = require('fs').promises
const colors = require('colors')
const markdownLinkExtractor = require('markdown-link-extractor');

//contiene la ruta pasada como argumento
const userRoute = process.argv[2]
//console.log(route)


// Convierte la ruta a absoluta (si es necesario)
const getAbsolute = (route) => {
  if (path.isAbsolute(route) === true) {
    //console.log('is absolute'.cyan, route)
    return route
  } else {
    //console.log('resolve'.cyan, path.resolve(route))
    return path.resolve(route)
  }
}
//getAbsolute(userRoute)


//función que me permite saber si el archivo tiene extensión md
const mdExt = (route) => path.extname(route) === '.md' ? true : false



//me permite saber si la ruta pasada es un archivo
const isFile = (route) => fs.statSync(route).isFile();
//itsFile(userRoute)


//promesa para leer el archivo
const readFile = (route) => { 
  return new Promise ((resolve, reject) => {
    
   //promesa de node que me permite leer el archivo
  fsp.readFile(route, { encoding: 'utf8' })
 
  .then(content => {
    if (mdExt(route) === true){
      //console.log(content.blue);
    resolve (content)
    /**/
    } else {
    reject('put a valid file'.red)
    }
  }) 
  .catch((error) => {
    reject('fail', error)
  })
})
}

//readFile(userRoute)

//leer el directorio, con la ruta pasada
const readDirectory = (route) => fs.readdirSync(route)

//Obtener los links md del archivo o directorio
const getMdFile = (route) => {
  let mdFiles = [];
  const makeRoute = getAbsolute(route);
  console.log('making a route'.magenta, makeRoute)
  
  if (isFile(makeRoute) === true) {
    if (mdExt(route) === true) {
      mdFiles.push(makeRoute);
    }
  } else {
    readDirectory(route).forEach((file) => {
      const unitRoute = path.join(route, file);//une la ruta con el archivo o carpeta 
      console.log('soy completeRoute'.yellow, unitRoute)
      const addMdFiles = getMdFile(unitRoute);//agrega al array de archivos md
      //console.log('soy addMdFiles'.cyan , addMdFiles)
      mdFiles = mdFiles.concat(addMdFiles);//une los links de archivos al leer dir o arch
    });
  }
  //console.log('mdfiles'.magenta, mdFiles)
  return mdFiles;
};
//getMdFile(userRoute)

//obtener links http
const extractObjLinks = (mdroute)=>{

  let arrObjLinks = []

 getMdFile(mdroute).forEach((file) =>{
  
   const markdown = readFile(file)

   .then((response)=>{
     //console.log('soy response'.cyan, response);
    const details = markdownLinkExtractor(response, true);
    
    details.forEach((link)=>{
      
      link.file = file
      const getLink = link.href
      const getText = link.text;
      
      const objLink = {
        href: getLink,
        text: getText,
        file: file
      }
      if (getLink.includes('https' || 'http')){
      arrObjLinks.push(objLink)
      }
    })
    console.log(arrObjLinks);
    return arrObjLinks
    //console.log('links extraidos'.magenta, details)
   })
   .catch((error)=>{
     console.error(error.cyan);
   })
   //console.log('leyendo el archivo de la ruta'.magenta, markdown)
   
 })

}
extractObjLinks(userRoute)


//función que me permite saber si es un archivo
/*const itsFile = (fileRoute) => fsp.stat(fileRoute)
  .then((stats) => {
    if (stats.isFile()) {
      //return fileExt(fileRoute)//console.log('aqui debe ir funcion para leer archivo') //
      console.log('fileExt dentro de promesa', fileExt(fileRoute))//console.log('aqui debe ir funcion para leer archivo') // 
      return fileExt(fileRoute)
    }
  })
  .catch((error) => {
    console.error('fail', error)
  })*/

//leer el directorio
/*const readDir = (route) =>{
//leer directorio
 fsp.readdir(route)
   
  
  .then(filenames => {
  
    let mdFiles = []

    //if (un)

      for (let filename of filenames) {
        //console.log('estoy leyendo el directorio', filename)  
          if (mdExt(filename) === true){
            console.log('dentro del for',filename);
            mdFiles.push(filename)
          //return mdFiles
          } /*else {
            
            //se une la ruta absoluta con el siguiente archivo o carpeta
            const newRoute = path.join(route, filename)
            console.log('me uno a la ruta absoluta', newRoute);
            //relee la carpeta con la nueva ruta pasada
            const reReadDir = readDir(newRoute)
            console.log('soy undefined', reReadDir)
            mdFiles = mdFiles.concat(reReadDir)
            console.log('soy mdFiles'.cyan, mdFiles)
          }
      }
      console.log(mdFiles)
      return mdFiles
      //se obtienen los links 
  })
  // If promise is rejected
  .catch(err => {
      console.log(err)
  })
}
readDir(userRoute)*/


//extracción de links




///Users/mariacamila/Documents/LABORATORIA/Dataloversv1/BOG003-data-lovers/README.md
///Users/mariacamila/Documents/Platzi/FundamentosdeJS/clase1/app.js*/
//node md-links.js ./package.json
// node md-links.js ./README-prueba.md