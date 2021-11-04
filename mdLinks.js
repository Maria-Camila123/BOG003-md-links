const fs = require('fs')
const path = require('path')
const fsp = require('fs').promises
const colors = require('colors')
const markdownLinkExtractor = require('markdown-link-extractor')
const axios = require('axios')
//const marked = require('marked')

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
const isFile = (route) => fs.statSync(route).isFile()
//itsFile(userRoute)


//promesa para leer el archivo
const readFile = (file) => fs.readFileSync(file, 'utf-8')


//leer el directorio, con la ruta pasada
const readDirectory = (route) => fs.readdirSync(route)

//Obtener los links md del archivo o directorio
const getMdFile = (route) => {
  let mdFiles = [];
  const makeRoute = getAbsolute(route);
  //console.log('making a route'.magenta, makeRoute)

  if (isFile(makeRoute) === true) {
    if (mdExt(route) === true) {
      mdFiles.push(makeRoute);
    }
  } else {
    readDirectory(route).forEach((file) => {
      const unitRoute = path.join(route, file);//une la ruta con el archivo o carpeta 
      //console.log('soy completeRoute'.yellow, unitRoute)
      const addMdFiles = getMdFile(unitRoute);//agrega al array de archivos md
      //console.log('soy addMdFiles'.cyan , addMdFiles)
      mdFiles = mdFiles.concat(addMdFiles);//une los links de archivos al leer dir o arch
    });
  }
  //console.log('mdfiles'.magenta, mdFiles)
  return mdFiles;
};
getMdFile(userRoute)

//extraer los links
const getObjLinks = (mdroute) =>{

 const arrObjLinks = []

  getMdFile(mdroute).forEach((file)=>{
   const details = markdownLinkExtractor(readFile(file), true)
    details.forEach((link)=>{
      if (link.href.includes('https' || 'http')){
        arrObjLinks.push({
         href: link.href,
         text: link.text,
         file: file
        })
      }
    })
  })
  //console.log('aqui estoy', arrObjLinks)
  return arrObjLinks
}

//getObjLinks(userRoute)

//obtener estado de links
const validateLinks = (links)=>{

  const arrStatus = links.map((link) => axios.get(link.href)
    .then(response =>({...link, statusOk: 'OK', status: response.status }))
    .catch(error=>({...link, statusOk: 'FAIL', status: error.response.status}))
  )
  return Promise.all(arrStatus)
}
//validateLinks(getObjLinks(userRoute))


const mdLinks = (route, options) =>{
  
  const allLinks = getObjLinks(route)
  return new Promise ((resolve, reject)=>{
      const statusLinks = validateLinks(allLinks)
      return statusLinks 
      .then((validLinks)=>{
        if (options.validate === true){

        //console.log(validLinks)
        resolve(validLinks)
        }else{
          //console.log(allLinks)
        resolve(allLinks)
          }
      })
      .catch((error) => {
        reject('fail', error)
      })
      //console.log('hola',statusLinks)
      
  })
}
//mdLinks(userRoute, { validate: true } )

module.exports = {
  getAbsolute,
  getMdFile,
  getObjLinks,
  mdLinks,

}
/**desde aquiiiii ******************/
//obtener links http
/*
const readFile = (route) => { 
  return new Promise ((resolve, reject) => {
    
   //promesa de node que me permite leer el archivo
  fsp.readFile(route, { encoding: 'utf8' })
 
  .then(content => {
    if (mdExt(route) === true){
      //console.log(content.blue);
    resolve (content)
    /
  } else {
    reject('put a valid file'.red)
    }
  }) 
  .catch((error) => {
    reject('fail', error)
  })
})
}



const extractObjLinks = (mdroute)=>{

  let arrObjLinks = []

  return new Promise ((resolve, reject) => {

     getMdFile(mdroute).forEach((file) =>{
  
   readFile(file)
   
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
    //console.log('arreglo de objetos',arrObjLinks)
    resolve(arrObjLinks)
   })
   .catch((error)=>{
     reject (error);
   })
   //console.log('leyendo el archivo de la ruta'.magenta, markdown)
   })
  })
}
//extractObjLinks(userRoute)*/

/*const response = (links)=>{

  extractObjLinks(links)
  .then((res)=>{
    console.log('aqui',res);
  })

}

response(userRoute)*/

/*const validateLinks = (route) => {
 
  const arrValidt = []
  //eturn new Promise ((resolve,reject)=>{
 
  //console.log('soy la funcion extraer'.cyan ,extractObjLinks(route))
  extractObjLinks(route)

    .then((links) => {
      links.map((link)=>{
       arrValidt.push(axios.get(link.href))
       //arrValidt.push(axios.get(link.href))
       .then((response)=>{
         //console.log('hola'.magenta, response)
         //console.log('aqui estoy', {...link, statusOk: 'ok', status: response.status })

         const obj = {...link, statusOk: 'ok', status: response.status }
         return obj
       })
       .catch((error)=>{
        return ({...link, statusOk: 'fail', status: error.response.status})
         //console.log({...link, statusOk: 'fail', status: error.response.status})
       })
      })
      return Promise.all(arrValidt)
    })
  //})
}
validateLinks(userRoute)*/

/*const response = (links)=>{

  validateLinks(links)
  .then((res)=>{
    console.log('aqui',res);
  })

}

response(userRoute)*/
///Users/mariacamila/Documents/LABORATORIA/Dataloversv1/BOG003-data-lovers/README.md
///Users/mariacamila/Documents/Platzi/FundamentosdeJS/clase1/app.js*/
//node md-links.js ./package.json
// node md-links.js ./README-prueba.md
///Users/mariacamila/Documents/pruebaMdlinks/primer-archivo.md