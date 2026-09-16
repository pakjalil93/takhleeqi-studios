import { mkdir, writeFile } from 'node:fs/promises';
const entries = [
['gI9_NmugF2E','Kalim Siddiqui — A Conversation','CINEMATIC INTERVIEW'],
['pUcVhmC5jRY','Interwood — The Recliner','PRODUCT FILM'],
['w9faKG4TxqE','Interwood — Furniture in Focus','PRODUCT FILM'],
['y7jI5ovXGEs','Atlantis Towers','ARCHITECTURAL VISUALIZATION'],
['JIV9O8kKSH8','I-Mobile — Product Film 01','PRODUCT VISUALIZATION'],
['RuyFlKGc4F4','I-Mobile — Product Film 02','PRODUCT VISUALIZATION'],
['FZCDjcarSwI','Glod Street','PRODUCT VISUALIZATION'],
['W5IRhMphQAY','COVID Policy Formation','INFOGRAPHICS'],
['J48KUxQ0wBo','CCP','2D ANIMATION'],
['7ppMfJZds-E','Safari View Heights — Elevation Reveal','ARCHITECTURAL VISUALIZATION'],
['xW3PpmESYa8','Safari View Heights','ARCHITECTURAL VISUALIZATION'],
['aFctmGQfWTQ','Spaces & Structures — Project Reel','ARCHITECTURAL VISUALIZATION'],
['05RbZEaEAhg','5 Towers','ARCHITECTURAL VISUALIZATION'],
['ikgotXduz2Q','Takhleeqi — Editing Reel','EDITING & POST-PRODUCTION'],
['X1XgnavTm7o','PEGUSD','MOTION GRAPHICS'],
['TlC3EysakOw','Khaira Gali, Murree','LOCATION FILM'],
['tGMARjTmvwE','Pakistan — A Land to Know','TYPOGRAPHY'],
];
await mkdir('assets/work/references',{recursive:true});
const records=[];
for(const [id,title,category] of entries){
 const url=`https://www.youtube.com/watch?v=${id}`;
 const response=await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
 if(!response.ok){records.push({id,title,category,url,available:false,status:response.status});console.log(id,'unavailable',response.status);continue;}
 const meta=await response.json();
 const img=await fetch(meta.thumbnail_url);
 if(!img.ok)throw Error(`${id}: thumbnail ${img.status}`);
 await writeFile(`assets/work/references/${id}.jpg`,Buffer.from(await img.arrayBuffer()));
 records.push({id,title,category,url,originalTitle:meta.title,author:meta.author_name,reference:meta.thumbnail_url});
 console.log(id,meta.title);
}
await writeFile('assets/work/projects.json',JSON.stringify(records,null,2));
