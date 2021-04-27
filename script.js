'use strict';

let canvas = document.getElementById('myCanvas')
let context = canvas.getContext('2d')


let playSound = (path) => {
    document.getElementById('sound').innerHTML = "<embed src=\""+path+"\" hidden=\"true\" loop=\"false\"></embed>"
}


// loading an image
// let image = new Image()
// image.onload = () => context.drawImage(image, 0, 0, 500, 500)
// image.src = './images/idle.png'

/*
To draw an image, we need an image object
A callback function which draws the image to the canvas
And we have to set the source of the image file
*/

let getPath = (animation, frame) => `./${animation}/${frame}.png`



let loadImage = (path, callBack) => {
    let image = new Image()
    image.onload = () => callBack(image)
    image.src = path
}


// const idleImgPath = './images/idle.png'


let frames = {
    idle: [1, 2, 3, 4, 5, 6, 7, 8],
    kick: [1, 2, 3, 4, 5, 6, 7],
    punch: [1, 2, 3, 4, 5, 6, 7],
    forward: [1, 2, 3, 4, 5, 6],
    backward: [1, 2, 3, 4, 5, 6],
    block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
}

// loadImage(idleImgPath, image => context.drawImage(image, 0, 0, 500, 500) )
let loadImages = (callBack) => {
    let images = {
        idle: [],
        kick: [],
        punch: [],
        block: [],
        forward: [],
        backward: [],
    }
    let imageCount = 0;
    ['idle', 'punch', 'kick', 'block', 'forward', 'backward'].forEach( (animation) => {
        let animationFrame = frames[animation]
        imageCount += animationFrame.length
        animationFrame.forEach( (frame) => {
            let path = getPath(animation, frame)
            loadImage(path, (image) => {
                images[animation][frame - 1] = image
                --imageCount
                if (imageCount === 0) {
                    callBack(images)
                }
            })
        })
    })
}


// loadImages((images) => context.drawImage(images[7], 0, 0, 500, 500))

// let animation = (action) => {
//     loadImages((images) => {
//         images.forEach( (image, idx) => {
//             setTimeout( () => {
//                 context.clearRect(0, 0, 500, 500)
//                 context.drawImage(image, 0, 0, 500, 500)
//             }, idx*100)
//         })
//     })
// }

// animation('idle')

let x = 0


let animate = (context, images, animation, callBack) => {
    images[animation].forEach( (image, idx) => {
        setTimeout( () => {
            context.clearRect(x, 350, 500, 500)
            
            if (animation == 'forward') {
                if (x + 15 <= 1000)
                    x += 15
            } else if (animation == 'backward') {
                if (x - 15 >= 0) {
                    x -= 15
                }
            }
            // playSound(sound)
            context.drawImage(image, x, 350, 500, 500)
        }, idx * 100)
    })

    setTimeout(callBack, images[animation].length * 100)
}

loadImages((images) => {
    // let animation = 'idle'
    let animation;
    let animationQueue = [], soundQueue = []
    let sound;

    let aux = () => {
        if (animationQueue.length === 0) {
            animation = 'idle'
            sound = 'punch.mp3'
        } else {
            animation = animationQueue.shift()
            sound = soundQueue.shift()
        }
        animate(context, images, animation, aux)
        
    }

    document.getElementById('kick').onclick = () => {
        animationQueue.push('kick')
        soundQueue.push('./kick.mp3')
    }

    document.getElementById('punch').onclick = () => {
        animationQueue.push('punch')
        soundQueue.push('./punch.mp3')
    }

    document.getElementById('block').onclick = () => {
        animationQueue.push('block')
    }

    document.getElementById('forward').onclick = () => {
        animationQueue.push('forward')
    }

    document.getElementById('backward').onclick = () => {
        animationQueue.push('backward')
    }

    document.addEventListener('keyup', event => {
        switch(event.key) {
            case "ArrowLeft":
                animationQueue.push('backward')
                break
            case "ArrowRight":
                animationQueue.push('forward')
                break
            case "ArrowDown":
                animationQueue.push('kick')
                soundQueue.push('./kick.mp3')
                break
            case "ArrowUp":
                animationQueue.push('punch')
                soundQueue.push('./punch.mp3')
                break
        }
    })

    aux()
})