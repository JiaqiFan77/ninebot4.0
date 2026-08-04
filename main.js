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





// 相机

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
10
);





// 渲染器

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





// A2双页比例

const ratio = 840 / 594;



const height = 2.8;

const width =
height * ratio;





const loader =
new THREE.TextureLoader();


let posters=[];

let active=null;






// 队列位置

const positions=[


[-2.5,0,0],

[-1.5,0,-0.8],

[-0.5,0,-1.6],

[0.5,0,-2.4],

[1.5,0,-3.2],

[2.5,0,-4]

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





const mesh =
new THREE.Mesh(

geometry,

material

);





mesh.position.set(

positions[index][0],

positions[index][1],

positions[index][2]

);




// 队列倾斜

mesh.rotation.y =
-0.35;




mesh.userData={

index:index,

home:{

x:positions[index][0],

y:positions[index][1],

z:positions[index][2]

}

};





group.add(mesh);


posters.push(mesh);



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
(e.clientX / innerWidth)*2-1;


mouse.y =
-(e.clientY / innerHeight)*2+1;



raycaster.setFromCamera(

mouse,

camera

);



const result =
raycaster.intersectObjects(
posters
);



if(result.length){

extract(
result[0].object
);

}


});









function extract(poster){


if(active){

return;

}


active=poster;




// 其他封面退后

posters.forEach(

p=>{


if(p!==poster){


gsap.to(

p.position,

{

z:-8,

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

z:4,

duration:1.2,

ease:"power4.out"

}

);





gsap.to(

poster.rotation,

{

y:0,

duration:1

}

);






// 第六期打开阅读

if(
poster.userData.index===5
){


setTimeout(()=>{


window.location.href=
"reader.html";


},1200);



}



}









// 鼠标视差

let mouseX=0;

let mouseY=0;



window.addEventListener(

"mousemove",

(e)=>{


mouseX =
(e.clientX/innerWidth-.5);


mouseY =
(e.clientY/innerHeight-.5);


}

);







function animate(){


requestAnimationFrame(
animate
);



group.rotation.y +=

(
mouseX*0.25 -
group.rotation.y
)
*0.04;



group.rotation.x +=

(
-mouseY*0.15 -
group.rotation.x
)
*0.04;



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
