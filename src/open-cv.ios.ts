import {CommanOpenCV} from './open-cv.common';
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";


declare var OpenCVWrapper: any;
declare var OpenCVMat: any, OPENCV_8UC4;

export class OpenCV extends CommanOpenCV {
    constructor() {
        super();
    }

    cvtColor(srcMat: any, destMat: any, colortype: number): void {
        // let dest = OpenCVMat.alloc().initWithRowsColsType(srcMat.size().height, srcMat.size().width, OPENCV_8UC4);
        OpenCVWrapper.cvtColor(srcMat, destMat, colortype, 0);
        // return dest;
    }

    extractChannel(srcMat: any, destMat: any): void {
        // let dest = OpenCVMat.alloc().initWithRowsColsType(srcMat.size().height, srcMat.size().width, OPENCV_8UC4);
        OpenCVWrapper.extractChannel(srcMat, destMat);
        // return dest;
    }

    MatToImage(srcMat: any) {
        return srcMat.toImage();
    }

    ImageToMat(bitMapImage: any) {
        if (bitMapImage instanceof ImageSource) {
            // console.log('imread', 'ImageSource');
            bitMapImage = bitMapImage.ios;
        }
        if (bitMapImage instanceof UIImage) {
            // const cvMat = OpenCVWrapper.cvMatFromUIImage(value);
            // console.log('imread', 'UIImage', value.size);
            return OpenCVMat.alloc().initWithImage(bitMapImage);
        }
        return null;
    }

    bitwise_not(srcMat: any, destMat: any): void {
        // throw new Error("Method not implemented.");
        // debugger;
        return OpenCVWrapper.bitwise_not(srcMat, destMat);
    }

    GaussianBlur(srcMat: any, destMat: any, size: any, x: number, y: number, sigmaX: number): void {
        // debugger;
        return OpenCVWrapper.GaussianBlur(srcMat, destMat, x, y, sigmaX);
    }

    adaptiveThreshold(srcMat: any, destMat: any, maxValue: number, adaptiveMethod: number, thresholdType: number, blockSize: number, C: number): void {
        // debugger;
        return OpenCVWrapper.adaptiveThreshold(srcMat, destMat, maxValue, adaptiveMethod, thresholdType, blockSize, C);
    }

    CreateMat() {
        // debugger;
        return new OpenCVMat();
    }


    CreateMatFromRect(srcMat: any, rect: any) {
        // debugger;
        // const result = srcMat.initWithMatWithRect(rect);
        return null;
    }

    CreateMat_Color(rows: number, cols: number, imageType: any, color: any) {
        const result = OpenCVMat.alloc().initWithRowsColsType(rows, cols, imageType);
        // console.log('createMat', rows, cols, type, result.size().width, result.size().height);
        return result;
    }

    CreateMatVector() {
        return new OpenCVMat();
    }

    findContours(srcMat: any, contoursMatVector: any, hierarchyMat: any, mode: number, method: number, offset: { x: number, y: number } = {
        x: 0,
        y: 0
    }): void {
        return OpenCVWrapper.findContours(srcMat, hierarchyMat, mode, method, offset);
    }

    contourArea(contours: any): number {
        // throw new Error("Method not implemented.");
        return OpenCVWrapper.contourArea(contours, false);
    }


    boundingRect(contours: any) {
        return OpenCVWrapper.boundingRect(contours);
    }

    CreateRange(start: number, end: number) {
        // throw new Error("Method not implemented.");
    }

    resize(srcMat: any, destMat: any, size: any, x: number, y: number, method: number): void {
        // throw new Error("Method not implemented.");
    }

    toAll28X28Image(res: any): { img: ImageSource, rect, x, y, height, width }[] {
        let main_image = this.ImageToMat(res);
        debugger;
        let nsarray = main_image.toAll28X28Image();

        let s = this.nsArrayToJSArray(nsarray);
        s.forEach((p: { img, rect, x, y, height, width }) => {
            p.img = fromNativeSource(p.img);
        });
        return s;
    }

    nsArrayToJSArray(a: NSArray<any>): Array<{ img: ImageSource, rect, x, y, height, width }> {
        const arr = [];
        if (a !== undefined) {
            let count = a.count;
            for (let i = 0; i < count; i++) {
                let dict = a.objectAtIndex(i);
                var result = {};

                result['x'] = dict.objectForKey('x');
                result['y'] = dict.objectForKey('y');
                result['height'] = dict.objectForKey('height');
                result['width'] = dict.objectForKey('width');
                result['img'] = dict.objectForKey('img');

                arr.push(result);
            }
        }

        return arr;
    }

    load() {
    }

    ChangeColor(res, rect, x, y, height, width, result): any {
        let main_image = this.ImageToMat(res);
        try {
            let nsarray = main_image.changeColorYHeightWidthResult(x, y, height, width, result);

            return nsarray;
        } catch (e) {
            debugger;
            console.log(e);
        }
        return null;

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

