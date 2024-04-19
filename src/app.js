import { Camera } from '@mediapipe/camera_utils';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import screenfull from 'screenfull';

import * as css from "./style.css";

const videoElement = document.getElementsByClassName('inputVideo')[0];
const canvasElement = document.getElementsByClassName('outputCanvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const button = document.getElementsByClassName('startCamera')[0];
const fullscreenButton = document.getElementById('fullscreen-button');

const selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
}});

selfieSegmentation.setOptions({modelSelection: 1});
selfieSegmentation.onResults(results => {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Draw the video on the canvas
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // Use inverse of segmentation mask to remove background
    canvasCtx.globalCompositeOperation = 'destination-in';
    canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

    // Set background to black
    canvasCtx.globalCompositeOperation = 'destination-over';
    canvasCtx.fillStyle = 'black';
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.restore();
});

button.addEventListener('click', () => {
    let selectedCamera = document.querySelector('input[name="radio"]:checked').value;
    let inputs = document.querySelector('.inputs');
    let camera = new Camera(videoElement, {
        onFrame: async () => {
            await selfieSegmentation.send({image: videoElement});
        },
        facingMode: selectedCamera,
        width: 1280,
        height: 720,

    });
    camera.start();
    inputs.style.display = 'none';
    canvasElement.style.display = '';
});

fullscreenButton.addEventListener('click', (event) => {
    if (screenfull.isEnabled) {
        screenfull.toggle(canvasElement, {navigationUI: 'hide'});
    }
});

document.addEventListener('click', (event) => {
    if (screenfull.isEnabled && screenfull.isFullscreen) {
        screenfull.exit();
    }
});
