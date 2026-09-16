import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
const all=JSON.parse(await readFile('assets/work/projects.json','utf8'));
const available=all.filter(p=>p.available!==false);
const batches=[];
for(let i=0;i<available.length;i+=4){
 const group=available.slice(i,i+4),inputs=[];
 for(const [j,p] of group.entries()){
  inputs.push({input:await sharp(`assets/work/references/${p.id}.jpg`).resize(768,432,{fit:'cover'}).png().toBuffer(),left:j%2*768,top:Math.floor(j/2)*432});
 }
 const file=`assets/work/reference-board-${batches.length+1}.png`;
 await sharp({create:{width:1536,height:864,channels:3,background:'#05101d'}}).composite(inputs).png().toFile(file);
 batches.push({file,projects:group.map(p=>({id:p.id,title:p.title,category:p.category}))});
}
await writeFile('assets/work/batches.json',JSON.stringify(batches,null,2));
console.log(JSON.stringify(batches,null,2));
