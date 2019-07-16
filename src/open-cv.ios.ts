import {CommanOpenCV} from './open-cv.common';

export class OpenCv extends CommanOpenCV {
    constructor() {
        super();
        // debugger;

    }

    cvtColor(srcMat: any, destMat: any, dstChannels: number): void {
        // throw new Error("Method not implemented.");
    }

    MatToImage(srcMat: any) {
        // throw new Error("Method not implemented.");
    }

    ImageToMat(bitMapImage: any) {
        // throw new Error("Method not implemented.");
    }

    bitwise_not(srcMat: any, destMat: any): void {
        // throw new Error("Method not implemented.");
    }

    GaussianBlur(srcMat: any, destMat: any, size: any, x: number, y: number, sigmaX: number): void {
        // throw new Error("Method not implemented.");
    }

    adaptiveThreshold(srcMat: any, destMat: any, maxValue: number, adaptiveMethod: number, thresholdType: number, blockSize: number, C: number): void {
        // throw new Error("Method not implemented.");
    }

    CreateMat() {
        // throw new Error("Method not implemented.");
    }


    CreateMatFromRect(srcMat: any, rect: any) {
        // throw new Error("Method not implemented.");
    }

    CreateMat_Color(rows: number, cols: number, imageType: any, color: any) {
        // throw new Error("Method not implemented.");
    }

    CreateMatVector() {
        // throw new Error("Method not implemented.");
    }

    findContours(srcMat: any, contoursMatVector: any, hierarchyMat: any, mode: number, method: number): void {
        // throw new Error("Method not implemented.");
    }

    contourArea(contours: any): number {
        // throw new Error("Method not implemented.");
        return 0;
    }


    boundingRect(contours: any) {
        // throw new Error("Method not implemented.");
    }

    CreateRange(start: number, end: number) {
        // throw new Error("Method not implemented.");
    }

    resize(srcMat: any, destMat: any, size: any, x: number, y: number, method: number): void {
        // throw new Error("Method not implemented.");
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

