import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

import { gsap }
from
"https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";



const canvas =
document.querySelector("#webgl");


const scene =
new THREE.Scene();


scene.background =
new THREE.Color(0x000000);





const camera =
new THREE.PerspectiveCamera(

45,

innerWidth/innerHeight,

0.1,

100

);


camera.position.z=16;





const renderer =
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





const group =
new THREE.Group();

scene.add(group);







const files=[

"cover01.jpg",
"cover02.jpg",
"cover03.jpg",
"cover04.jpg",
"cover05.jpg",
"cover06.jpg"

];





const ratio=840/594;


const h=3;


const w=h*ratio;





const loader =
new THREE.TextureLoader();


let posters=[];


let active=null;





const startX=3;



files.forEach(

(file,index)=>{


const texture=
loader.load(
"images/"+file
);



texture.colorSpace=
THREE.SRGBColorSpace;



const geometry=
new THREE.PlaneGeometry(

w,

h

);



const material=
new THREE.MeshBasicMaterial({

map:texture,

side:THREE.DoubleSide

});



const mesh=
new THREE.Mesh(

geometry,

material

);




// 队列位置

mesh.userData.home={

x:(index-2.5)*3,

y:0,

z:-index*0.5,

scale:1

};



mesh.position.set(

mesh.userData.home.x,

0,

mesh.userData.home.z

);



mesh.rotation.y=-0.3;



mesh.userData.index=index;



group.add(mesh);


posters.push(mesh);



}

);








// 点击检测


const raycaster =
new THREE.Raycaster();


const mouse =
new THREE.Vector2();




window.addEventListener(

"click",

e=>{


mouse.x=
(e.clientX/innerWidth)*2-1;


mouse.y=
-(e.clientY/innerHeight)*2+1;



raycaster.setFromCamera(

mouse,

camera

);



const hit =
raycaster.intersectObjects(
posters
);



if(hit.length){

handleClick(
hit[0].object
);

}


});









function handleClick(poster){



// 点击当前，返回

if(active===poster){

returnHome();

active=null;

return;

}




// 如果已有一本打开

if(active){

returnHome();

}




active=poster;




// 其他退后

posters.forEach(

p=>{


if(p!==poster){


gsap.to(

p.position,

{

z:-5,

duration:.8

}

);


}

}

);





// 抽出

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

poster.scale,

{

x:1.25,

y:1.25,

duration:1

}

);



gsap.to(

poster.rotation,

{

y:0,

duration:1

}

);







// 第六期进入阅读

if(

poster.userData.index===5

){


setTimeout(()=>{

window.location.href=
"reader.html";

},1200);


}



}









function returnHome(){


posters.forEach(

p=>{


gsap.to(

p.position,

{

x:p.userData.home.x,

y:p.userData.home.y,

z:p.userData.home.z,

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



gsap.to(

p.rotation,

{

y:-0.3,

duration:1

}

);



}

);


}








// 鼠标空间感

let mx=0;

let my=0;


window.addEventListener(

"mousemove",

e=>{


mx=
(e.clientX/innerWidth-.5);


my=
(e.clientY/innerHeight-.5);


});






function animate(){


requestAnimationFrame(animate);



group.rotation.y +=

(
mx*0.25-group.rotation.y
)*0.03;



group.rotation.x +=

(
-my*0.12-group.rotation.x
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
