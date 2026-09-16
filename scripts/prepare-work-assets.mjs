import sharp from 'sharp';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
const batches=JSON.parse(await readFile('assets/work/batches.json','utf8'));
await mkdir('public/media/work',{recursive:true});
const manifest=[];
for(const [index,batch] of batches.entries()){
 const board=`assets/work/gemini-board-${index+1}.png`;
 const enhanced=await access(board).then(()=>true).catch(()=>false);
 const meta=enhanced?await sharp(board).metadata():null;
 for(const [j,project] of batch.projects.entries()){
  let source=enhanced?sharp(board).extract({left:j%2*Math.floor(meta.width/2),top:Math.floor(j/2)*Math.floor(meta.height/2),width:Math.floor(meta.width/2),height:Math.floor(meta.height/2)}):sharp(`assets/work/references/${project.id}.jpg`);
  await source.resize(960,540,{fit:'cover'}).webp({quality:88}).toFile(`public/media/work/${project.id}.webp`);
  manifest.push({id:project.id,source:enhanced?board:`assets/work/references/${project.id}.jpg`,enhancedWithGemini:enhanced,output:`public/media/work/${project.id}.webp`});
 }
}
await writeFile('assets/work/thumbnail-provenance.json',JSON.stringify(manifest,null,2));
console.log(`Prepared ${manifest.length} thumbnails (${manifest.filter(p=>p.enhancedWithGemini).length} Gemini enhanced).`);
