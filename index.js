#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const {mdLinks} = require('./mdLinks.js');
const path = process.argv[2];

//opciones
const firstOption = process.argv[3] //=== '--validate' || '--stats' || '--validate --stats' && '--stats --validate' //? true : false 
const secondOption = process.argv[4] //=== '--stats' ? true : false


mdLinks(path, { validate: true })
.then((response)=>{
  if (firstOption === undefined){
    let extLinks = ''
    response.forEach(element => {
      extLinks += `
      ${chalk.rgb(234, 255, 124)(element.file)}
      ${chalk.rgb(0, 255, 255)(element.href)} 
      ${chalk.rgb(242, 153, 184)(element.text)} 
      `
    })
    console.log(extLinks)
  }else if (firstOption === '--validate' && secondOption === undefined){
    let extLinks = ''
    response.forEach(element => {
      extLinks += `
      ${chalk.rgb(0, 255, 255)(element.file)} 
      ${chalk.rgb(242, 153, 184)(element.href)} 
      ${element.statusOk === 'OK' ? chalk.rgb(128, 255, 115)(element.statusOk) : chalk.yellow(element.statusOk)} ${element.status < 400 ? chalk.rgb(128, 255, 115)(element.status) : chalk.yellow(element.status)}
      ${chalk.rgb(0, 255, 255)(element.text)} 
      `
    })
    console.log(extLinks)
  } else if (firstOption === '--stats' && secondOption === undefined){
    console.log(chalk.rgb(128, 255, 115)(statsOption(response)))
  }else if (firstOption === '--validate' && secondOption === '--stats'){
    console.log(`${chalk.rgb(128, 255, 115)(statsOption(response))}\n${chalk.yellow(brokenStats(response))}`)
  } else if (firstOption === '--help'){
    console.log(chalk.rgb(234, 255, 124)(figlet.textSync(' - MD Links -'))
    + chalk.rgb(242, 153, 184)`
    Herramienta que lee y analiza archivos con formato Markdown, para
    verificar los links que contengan y reportar algunas estadísticas.\n`
    + chalk.rgb(0, 255, 255)`
     ---------------------------  Options    -------------------------\n
    |                                                                 |
    |  --validate :  Lista de links del archivo con su estado HTTP    |
    |                                                                 |
    |  --stats    :  Total de links del archivo md                    |
    |                                                                 |
    |  --validate --stats  :  Total de links + total de links rotos   |                                  
    |                                                                 |
     -----------------------------------------------------------------
  `);
  }
})

const statsOption = (linksRes) => {
  let stat = ''
  let href = linksRes.map((element) => element.href)
  stat += `Total: ${linksRes.length}\nUnique: ${new Set(href).size}`
  return stat
};

const brokenStats = (linksRes) => {
  const broken = linksRes.filter(((link) => link.status > 400 ));
  return `Broken: ${broken.length}`;
};

  

