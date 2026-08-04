import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

import { gsap }
from
"https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";



const canvas=document.querySelector("#webgl");



const scene=new THREE.Scene();

scene.background=
new THREE.Color(0x000000);




const camera=
new THREE.PerspectiveCamera(

45,

innerWidth/innerHeight,

0.1,

100

);


camera.position.z=16;




const renderer=
new THREE.WebGLRenderer({

canvas,

antialias:true

});


renderer.setSize(
innerWidth,
innerHeight
);


renderer.setPixelRatio(
Math.min(devicePixelRatio,2)
);





const group=new THREE.Group();

scene.add(group);







const covers=[

"cover01.jpg",
"cover02.jpg",
"cover03.jpg",
"cover04.jpg",
"cover05.jpg",
"cover06.jpg"

];




// A2双页比例

const ratio=840/594;


const height=3;


const width=
height*ratio;





const loader=
new THREE.TextureLoader();



let posters=[];

let active=null;






covers.forEach(

(file,index)=>{


const texture=
loader.load(
"images/"+file
);



texture.colorSpace=
THREE.SRGBColorSpace;



const geometry=
new THREE.PlaneGeometry(

width,

height

);



const material=
new THREE.MeshBasicMaterial({

map:texture,

side:THREE.DoubleSide

});



const poster=
new THREE.Mesh(

geometry,

material

);





// 队列位置

poster.position.set(

(index-2.5)*3,

0,

-index*0.5

);



poster.rotation.y=-0.25;




poster.userData={

index:index,

homeX:(index-2.5)*3,

homeZ:-index*0.5

};





group.add(poster);

posters.push(poster);



}

);








// 点击检测

const raycaster=
new THREE.Raycaster();


const mouse=
new THREE.Vector2();





window.addEventListener(

"click",

(e)=>{


mouse.x=
(e.clientX/innerWidth)*2-1;


mouse.y=
-(e.clientY/innerHeight)*2+1;



raycaster.setFromCamera(
mouse,
camera
);



const hit=
raycaster.intersectObjects(posters);



if(hit.length){

openPoster(hit[0].object);

}


});









function openPoster(poster){



// 点击当前返回

if(active===poster){

resetAll();

active=null;

return;

}



// 已有打开，先返回

if(active){

resetAll();

}



active=poster;





// 其他封面后退

posters.forEach(

p=>{


if(p!==poster){


gsap.to(

p.position,

{

z:-7,

duration:0.8

}

);


}

}

);





// 当前抽出

gsap.to(

poster.position,

{

x:0,

y:0,

z:5,

duration:1,

ease:"power3.out"

}

);



gsap.to(

poster.rotation,

{

y:0,

duration:1

}

);



gsap.to(

poster.scale,

{

x:1.25,

y:1.25,

duration:1

}

);





// 第六期进入阅读

if(
poster.userData.index===5
){

setTimeout(()=>{

window.location.href="reader.html";

},1200);


}



}









function resetAll(){


posters.forEach(

p=>{


gsap.to(

p.position,

{

x:p.userData.homeX,

z:p.userData.homeZ,

duration:1

}

);



gsap.to(

p.rotation,

{

y:-0.25,

duration:1

}

);



gsap.to(

p.scale,

{

x:1,

y:1,

duration:1

}

);



}

);


}









// 鼠标空间效果

let mx=0;

let my=0;


window.addEventListener(

"mousemove",

e=>{


mx=
(e.clientX/innerWidth-.5);


my=
(e.clientY/innerHeight-.5);


}

);






function animate(){


requestAnimationFrame(animate);



group.rotation.y +=

(
mx*0.2-group.rotation.y
)*0.03;



group.rotation.x +=

(
-my*0.1-group.rotation.x
)*0.03;




renderer.render(
scene,
camera
);


}



animate();







window.addEventListener(

"resize",

()=>{


camera.aspect=
innerWidth/innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(

innerWidth,

innerHeight

);



});
