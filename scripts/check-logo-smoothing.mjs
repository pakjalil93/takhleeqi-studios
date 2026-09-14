import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { drawSmoothLogoContour } from '../src/logoContours.ts';
const {shapes}=JSON.parse(await readFile('src/assets/logo-shapes.json','utf8'));
let maximumDeviation=0,sourceArea=0,smoothArea=0;
const area=points=>Math.abs(points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p.x*q.y-q.x*p.y;},0)/2);
for(const shape of shapes)for(const [index,contour] of [shape.outline,...shape.holes].entries()){
  const path=new THREE.Path();drawSmoothLogoContour(path,contour,0,0,1);
  const samples=path.getPoints(3);
  const original=contour.map(([x,y])=>new THREE.Vector2(x,-y));
  for(const point of samples){
    assert(Number.isFinite(point.x)&&Number.isFinite(point.y));
    let closest=Infinity;
    for(let i=0;i<original.length;i++){
      const a=original[i],b=original[(i+1)%original.length],ab=b.clone().sub(a);
      const t=THREE.MathUtils.clamp(point.clone().sub(a).dot(ab)/ab.lengthSq(),0,1);
      closest=Math.min(closest,point.distanceTo(a.clone().addScaledVector(ab,t)));
    }
    maximumDeviation=Math.max(maximumDeviation,closest);
  }
  const sign=index===0?1:-1;
  sourceArea+=sign*area(original);smoothArea+=sign*area(samples);
}
const relativeAreaChange=Math.abs(smoothArea-sourceArea)/sourceArea;
assert(maximumDeviation<1.75,'Smoothing moved too far from the supplied mark');
assert(relativeAreaChange<.015,'Smoothing changed the logo proportions');
const result={maximumDeviationInSourcePixels:maximumDeviation,relativeAreaChange,components:shapes.length,holes:shapes.reduce((n,s)=>n+s.holes.length,0)};
await writeFile('assets/logo-smoothing-check.json',JSON.stringify(result,null,2));
console.log(result);
