import {
    AdaptiveThresholdTypes,
    BorderTypes,
    ColorConversionCodes,
    CommanOpenCV,
    ContourApproximationModes,
    InterpolationFlags,
    RetrievalModes,
    ThresholdTypes
} from './open-cv.common';

declare var org: any;
declare var java: any;

export class OpenCV extends CommanOpenCV {
    /**
     *
     */

    ColorConversionCodes: {};

    constructor() {
        super();
        try {
            if (org && org.bytedeco && org.bytedeco.javacpp) {
                org.bytedeco.javacpp.Loader.load(org.bytedeco.opencv.helper.opencv_core.class);
                org.bytedeco.javacpp.Loader.load(org.bytedeco.opencv.helper.opencv_imgproc.class);
            }
        } catch (e) {
            debugger;
        }
        console.log(org);

        debugger;
    }

    cvtColor(srcMat: any, destMat: any, dstChannels: ColorConversionCodes): void {
        org.bytedeco.opencv.global.opencv_imgproc.cvtColor(srcMat, destMat, dstChannels);
    }

    MatToImage(srcMat: any) {
        let converterToBitmap = new org.bytedeco.javacv.AndroidFrameConverter();
        let converterToMat = new org.bytedeco.javacv.OpenCVFrameConverter.ToMat();
        let frame = converterToMat.convert(srcMat);
        return converterToBitmap.convert(frame);
    }

    ImageToMat(bitMapImage: any) {
        let converterToBitmap = new org.bytedeco.javacv.AndroidFrameConverter();
        let converterToMat = new org.bytedeco.javacv.OpenCVFrameConverter.ToMat();
        // let frame = converterToMat.convert(res);
        let frame = converterToBitmap.convert(bitMapImage);
        let main_image = converterToMat.convertToMat(frame);
        return main_image;
    }

    bitwise_not(srcMat: any, destMat: any): void {
        return org.bytedeco.opencv.global.opencv_core.bitwise_not(srcMat, destMat);
    }

    GaussianBlur(srcMat: any, destMat: any, size: { x, y }, x: number, y: number, borderTypes: BorderTypes): void {
        // throw new Error("Methodnotimplemented.");
        org.bytedeco.opencv.global.opencv_imgproc.GaussianBlur(srcMat, destMat, new org.bytedeco.opencv.opencv_core.Size(size.x, size.y), x, y, borderTypes);
    }

    adaptiveThreshold(srcMat: any, destMat: any, maxValue: number, adaptiveMethod: AdaptiveThresholdTypes, thresholdType: ThresholdTypes, blockSize: number, C: number): void {
        org.bytedeco.opencv.global.opencv_imgproc.adaptiveThreshold(srcMat, destMat, maxValue, adaptiveMethod, thresholdType, blockSize, C)
    }

    CreateMat(): any {
        return new org.bytedeco.opencv.opencv_core.Mat();
    }

    CreateMatFromRect(srcMat: any, rect: any): any {
        return new org.bytedeco.opencv.opencv_core.Mat(srcMat, rect);
    }

    CreateMat_Color(rows: number, cols: number, imageType: any, color: { b, g, r, a }): any {
        return new org.bytedeco.opencv.opencv_core.Mat(rows, cols, imageType, new org.bytedeco.opencv.opencv_core.Scalar(color.b, color.g, color.r, color.a));
    }

    CreateMatVector() {
        return new org.bytedeco.opencv.opencv_core.MatVector();
    }

    findContours(srcMat: any, contoursMatVector: any, hierarchyMat: any, mode: RetrievalModes, method: ContourApproximationModes): void {
        org.bytedeco.opencv.global.opencv_imgproc.findContours(srcMat, contoursMatVector, hierarchyMat, mode, method);
    }

    contourArea(contour: any): number {
        return org.bytedeco.opencv.global.opencv_imgproc.contourArea(contour);
    }

    boundingRect(contour: any): any {
        return org.bytedeco.opencv.global.opencv_imgproc.boundingRect(contour);
    }

    CreateRange(start: number, end: number) {
        return new org.bytedeco.opencv.opencv_core.Range(start, end);
    }

    resize(srcMat: any, destMat: any, size: any, x: number, y: number, method: InterpolationFlags): void {
        org.bytedeco.opencv.global.opencv_imgproc.resize(srcMat, destMat, size, x, y, method);
    }

    extractChannel(srcMat: any, destMat: any): void {
    }
}


export {
    CommanOpenCV,
    ColorConversionCodes,
    BorderTypes,
    ThresholdTypes,
    AdaptiveThresholdTypes,
    RetrievalModes,
    ContourApproximationModes,
    InterpolationFlags
} from './open-cv.common';
