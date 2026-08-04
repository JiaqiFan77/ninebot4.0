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


camera.position.z=10;




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






const group=
new THREE.Group();

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


const height=3.8;

const width=
height*ratio;






const loader=
new THREE.TextureLoader();


let posters=[];


let active=null;






const positions=[


[0,1.6,0],

[0,1,-1],

[0,.4,-2],

[0,-.2,-3],

[0,-.8,-4],

[0,-1.4,-5]


];







covers.forEach(

(img,i)=>{


const texture=
loader.load(
"images/"+img
);


texture.colorSpace=
THREE.SRGBColorSpace;




const geo=
new THREE.PlaneGeometry(

width,

height

);




const mat=
new THREE.MeshBasicMaterial({

map:texture,

side:THREE.DoubleSide

});



const mesh=
new THREE.Mesh(

geo,

mat

);




mesh.position.set(

positions[i][0],

positions[i][1],

positions[i][2]

);





mesh.rotation.y=-0.15;



mesh.userData={

index:i,

home:{

x:positions[i][0],

y:positions[i][1],

z:positions[i][2]

}

};




group.add(mesh);


posters.push(mesh);



}

);








// 点击检测


const raycaster=
new THREE.Raycaster();


const mouse=
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



const hit=
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



posters.forEach(

p=>{


if(p!==poster){


gsap.to(

p.position,

{

z:p.userData.home.z-3,

duration:1

}

);


}

}

);





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









// 鼠标视差


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

(mx*0.25-group.rotation.y)
*0.03;



group.rotation.x +=

(-my*0.15-group.rotation.x)
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


camera.aspect=
innerWidth/innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(

innerWidth,

innerHeight

);


});
