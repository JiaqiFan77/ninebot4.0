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





// camera

const camera =
new THREE.PerspectiveCamera(

45,

innerWidth / innerHeight,

0.1,

100

);


camera.position.set(
0,
0,
18
);






// renderer

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






// 图片

const covers=[

"cover01.jpg",
"cover02.jpg",
"cover03.jpg",
"cover04.jpg",
"cover05.jpg",
"cover06.jpg"

];





// A2 双页比例

const ratio =
840 / 594;



const height = 3;


const width =
height * ratio;





const loader =
new THREE.TextureLoader();



let posters=[];

let active=null;






// 队列

const positions=[


[-5,0,0],

[-3,0,-1],

[-1,0,-2],

[1,0,-3],

[3,0,-4],

[5,0,-5]


];







covers.forEach(

(file,index)=>{


const texture =
loader.load(
"images/"+file
);


texture.colorSpace =
THREE.SRGBColorSpace;





const geometry =
new THREE.PlaneGeometry(

width,

height

);





const material =
new THREE.MeshBasicMaterial({

map:texture,

side:THREE.DoubleSide

});





const poster =
new THREE.Mesh(

geometry,

material

);





poster.position.set(

positions[index][0],

positions[index][1],

positions[index][2]

);





// 队列倾斜

poster.rotation.y=-0.25;




poster.userData={

index:index,

home:{

x:positions[index][0],

y:positions[index][1],

z:positions[index][2]

}

};





group.add(poster);


posters.push(poster);



}

);









// 点击

const raycaster =
new THREE.Raycaster();


const mouse =
new THREE.Vector2();




window.addEventListener(

"click",

(e)=>{


mouse.x =
(e.clientX/innerWidth)*2-1;


mouse.y =
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

extract(hit[0].object);

}


});









function extract(poster){


if(active){

return;

}


active=poster;





// 其他退后

posters.forEach(

p=>{


if(p!==poster){


gsap.to(

p.position,

{

z:-6,

duration:1,

ease:"power3.out"

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

duration:1.2,

ease:"power4.out"

}

);





gsap.to(

poster.rotation,

{

x:0,

y:0,

duration:1

}

);







// 第六期阅读

if(

poster.userData.index===5

){


setTimeout(()=>{


window.location.href=
"reader.html";


},1200);


}


}










// 鼠标空间感

let mx=0;

let my=0;



window.addEventListener(

"mousemove",

(e)=>{


mx=
(e.clientX/innerWidth-.5);


my=
(e.clientY/innerHeight-.5);


});









function animate(){


requestAnimationFrame(
animate
);




group.rotation.y +=

(
mx*0.2-group.rotation.y
)
*0.03;



group.rotation.x +=

(
-my*0.1-group.rotation.x
)
*0.03;





renderer.render(

scene,

camera

);



}


animate();









window.addEventListener(

"resize",

()=>{


camera.aspect =
innerWidth/innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(

innerWidth,

innerHeight

);


});
