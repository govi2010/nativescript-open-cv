import { Common } from './open-cv.common';

declare var org: any;
declare var java: any;
export class OpenCv extends Common {
    /**
     *
     */
    constructor() {
        super();
        try {
            if (org && org.bytedeco && org.bytedeco.javacpp) {
                debugger;
                // let emptyUrls = [];
                // let u = new java.net.URL("/");
                // emptyUrls.push(u);
                // debugger;
                org.bytedeco.javacpp.Loader.load(org.bytedeco.opencv.helper.opencv_core.class);
                org.bytedeco.javacpp.Loader.load(org.bytedeco.opencv.helper.opencv_imgproc.class);
                // org.bytedeco.opencv.helper.opencv_imgcodecs
                // org.bytedeco.javacpp.Loader.loadLibrary("opencv_imgcodecs");
            }
        } catch (e) {
            debugger;
        }
        console.log(org);

        debugger;
    }
    // cvtColor
    // MatToImage
    // ImageToMat
    // bitwise_not
    // GaussianBlur
    // adaptiveThreshold
    // CreateMat
    // CreateMatVector
    // findContours
    // boundingRect
    // contourArea
    // CreateRange
    // resize
}
