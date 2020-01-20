/**
 * This script is adapted from the two tensorflowjs examples hosted at
 * https://github.com/tensorflow/tfjs-examples/tree/master/webcam-transfer-learning
 * and https://github.com/tensorflow/tfjs-models/tree/master/posenet/demos
 */

let model;
let modelURL;
/**
 * This function captures an image from the webcam, resizes it to the preferred
 * dimensions of the selected model, and represents it in a format suitable for
 * input to the network.
 */
function fetchInputImage(image, imageDims) {
  return tf.tidy(() => {
    loadedImage = tf.browser.fromPixels(image);
    const batchedImage = loadedImage.toFloat().expandDims();
    const resizedImage = tf.image.resizeBilinear(batchedImage, imageDims, true);
    const clippedImage = tf.clipByValue(resizedImage, 0.0, 255.0);
    const reversedImage = tf.reverse(clippedImage, 2);
    return reversedImage;
  });
}

function predictSaliency(image, model, imageDims) {
  return tf.tidy(() => {
    const modelOutput = model.predict(fetchInputImage(image, imageDims));
    const resizedOutput = tf.image.resizeBilinear(modelOutput, [image.height, image.width], true);
    const clippedOutput = tf.clipByValue(resizedOutput, 0.0, 255.0);
    return clippedOutput.squeeze();
  });
}

function brightestRect(tensor, rectSize, ctx) {
    console.log("Calculating brightest rect...");
    // How roughly are we guessing. If this is bigger, it will run faster
    const stepSize = rectSize / 5;

    var maxWidth = tensor.shape[0];
    var maxHeight = tensor.shape[1];

    var bestValue = 0;
    var bestPosition = undefined;
    // Iterate over chunks by stepSize, limited by bounds
    for (var col = 0; col < maxWidth - rectSize + 1; col += stepSize) {
        for (var row = 0; row < maxHeight - rectSize + 1; row += stepSize) {

            // Slice the tensor to get the submatrix of [rectSize, rectSize] starting at this chunk.
            var submatrix = tf.slice(tensor, [col, row], [rectSize, rectSize]);
            // Calculate the sum of the submatrix
            var value = submatrix.mean().dataSync()[0];
            if (value > bestValue) {
                bestValue = value;
                bestPosition = [row, col];
            }

            // Draw selected bounding box
            ctx.globalCompositeOperation = "source-over";
            ctx.beginPath();
            ctx.rect(row, col, rectSize, rectSize);
            ctx.strokeStyle = "#ffff0011";
            ctx.stroke();

            ctx.font = "10px Arial";
            ctx.fillStyle = "#ffff00";
            ctx.fillText("" + Math.round(value * 100) / 100, row, col + 12);
        }
    }
    return bestPosition;
}

/**
 * Here the model is loaded and fed with an initial image to warm up the
 * graph execution such that the next prediction will run faster. Afterwards,
 * the network keeps on predicting saliency as long as no other model is
 * selected. The results are automatically drawn to the canvas.
 */
async function runModel() {
    // Initialize
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("swordsImage");

    // Keep aspect ratio, but have a maximum size for the network input
    let canvasDims = [image.height, image.width];
    const maxSize = 128;
    var scaleFactor;
    if (canvasDims[0] > canvasDims[1]) {
      scaleFactor = maxSize / canvasDims[0];
    } else {
      scaleFactor = maxSize / canvasDims[1];
    }
    const imageDims = [Math.floor(canvasDims[0] * scaleFactor), Math.floor(canvasDims[1] * scaleFactor)];
    console.log(imageDims);

    // Load the model
    const modelURL = "https://storage.googleapis.com/msi-net/model/low/model.json";
    model = await tf.loadGraphModel(modelURL);
    console.log(model);

    // Calculate the saliency
    var saliencyMap = predictSaliency(image, model, imageDims);
    var dropLow = 0.75;
//    saliencyMap = saliencyMap.clipByValue(dropLow, 1.0);
//    saliencyMap = saliencyMap.sub(tf.scalar(dropLow)).mul(tf.scalar(1 / (1-dropLow)));
//    saliencyMap = saliencyMap.clipByValue(0.5, 0.9)

    // Draw saliency map
    await tf.browser.toPixels(saliencyMap, canvas);

    // Multiply in the original image
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(image, 0, 0);

    // Calculate the row/col of the center of the rectangle.
    const clipSize = Math.floor(Math.min(...canvasDims) / 3);
    var corner = brightestRect(saliencyMap, clipSize, ctx);

    // Calculate the most salient point as the center instead.
    var i = tf.argMax(saliencyMap.flatten()).dataSync()[0]
    var row = Math.floor(i / saliencyMap.shape[1]);
    var col = i % saliencyMap.shape[1];
    corner = [col - (clipSize / 2), row - (clipSize / 2)];

    // Draw selected bounding box
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(image, corner[0], corner[1], clipSize, clipSize, corner[0], corner[1], clipSize, clipSize);

    // Cleanup
    saliencyMap.dispose();
    model.dispose();
}
