import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";



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






// A2 双页比例

const ratio =
840/594;



const h=3;


const w=h*ratio;





const loader =
new THREE.TextureLoader();






files.forEach(

(file,index)=>{


console.log(
"loading:",
file
);



const texture =
loader.load(

"images/"+file,

()=>{

console.log(
"success:",
file
);

},

undefined,

()=>{

console.log(
"error:",
file
);

}

);





texture.colorSpace =
THREE.SRGBColorSpace;






const geometry =
new THREE.PlaneGeometry(

w,

h

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





// 明显错开

mesh.position.set(

(index-2.5)*3,

0,

-index*0.5

);




// 轻微旋转

mesh.rotation.y=-0.3;




group.add(mesh);



}

);







// 鼠标视差

let mx=0;

let my=0;



window.addEventListener(

"mousemove",

(e)=>{


mx=
(e.clientX/innerWidth-.5);


my=
(e.clientY/innerHeight-.5);


}

);







function animate(){


requestAnimationFrame(
animate
);



group.rotation.y +=

(
mx*0.3-group.rotation.y
)*0.03;



group.rotation.x +=

(
-my*0.15-group.rotation.x
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


camera.aspect =
innerWidth/innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(

innerWidth,

innerHeight

);


});
