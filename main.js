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



camera.position.z=8;





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





const images=[

"cover01.jpg",
"cover02.jpg",
"cover03.jpg",
"cover04.jpg",
"cover05.jpg",
"cover06.jpg"

];





// A2 双页比例

const ratio =
840/594;



const height = 3.2;

const width =
height * ratio;





const loader =
new THREE.TextureLoader();



let posters=[];

let active=null;





images.forEach(

(img,index)=>{


const texture =
loader.load(

"images/"+img

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





// 队列排列

mesh.position.set(

0,

0,

-index*0.65

);




// 稍微错开角度

mesh.rotation.y =
(index-2.5)*0.08;



mesh.userData={

index:index,

homeZ:-index*0.65,

opened:false

};



group.add(mesh);



posters.push(mesh);


}

);







// 鼠标视角


let mouse={

x:0,

y:0

};



window.addEventListener(

"mousemove",

e=>{


mouse.x =
(e.clientX/innerWidth-.5);


mouse.y =
(e.clientY/innerHeight-.5);



}

);







// 点击检测


const raycaster =
new THREE.Raycaster();


const pointer =
new THREE.Vector2();




window.addEventListener(

"click",

e=>{


pointer.x =
(e.clientX/innerWidth)*2-1;


pointer.y =
-(e.clientY/innerHeight)*2+1;




raycaster.setFromCamera(

pointer,

camera

);



const hit =
raycaster.intersectObjects(

posters

);



if(hit.length){

selectPoster(
hit[0].object
);

}


});







function selectPoster(poster){


if(active===poster){

returnHome(poster);

active=null;

return;

}



active=poster;



// 其他退后


posters.forEach(p=>{


if(p!==poster){


gsap.to(

p.position,

{

z:p.userData.homeZ-3,

duration:1,

ease:"power3.out"

}

);


}


});




// 被抽出


gsap.to(

poster.position,

{

x:0,

y:0,

z:3,

duration:1,

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





// 第六期进入阅读


if(

poster.userData.index===5

){

setTimeout(()=>{

openIssue06();

},1000);


}



}







function returnHome(poster){



posters.forEach(p=>{


gsap.to(

p.position,

{

z:p.userData.homeZ,

duration:1

}

);


});



gsap.to(

poster.rotation,

{

x:0,

y:(poster.userData.index-2.5)*0.08,

duration:1

}

);


}








function openIssue06(){


console.log(
"OPEN ISSUE 06 READER"
);


// 这里之后接你的电子杂志页面

// 可以替换成：

// window.location.href="issue06.html";


}







function animate(){


requestAnimationFrame(
animate
);



group.rotation.y +=

(mouse.x*0.2-group.rotation.y)*0.03;



group.rotation.x +=

(-mouse.y*0.15-group.rotation.x)*0.03;



posters.forEach((p,i)=>{


if(p!==active){


p.position.y =
Math.sin(
Date.now()*0.001+i
)*0.02;


}


});



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
