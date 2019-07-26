import {
    AdaptiveThresholdTypes,
    BorderTypes,
    ColorConversionCodes,
    CommanOpenCV,
    ContourApproximationModes,
    InterpolationFlags,
    LineTypes,
    MorphShapes,
    RetrievalModes,
    ThresholdTypes
} from './open-cv.common';
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";

declare var org: any;
declare var java: any;
declare var CV_8UC1;

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

    threshold(srcMat: any, destMat: any, thresh: number, maxval: number, thresholdType: ThresholdTypes): void {
        org.bytedeco.opencv.global.opencv_imgproc.threshold(srcMat, destMat, thresh, maxval, thresholdType);
    }


    getStructuringElement(morphShapes: MorphShapes, size: { x: number, y: number }): any {
        return org.bytedeco.opencv.global.opencv_imgproc.getStructuringElement(morphShapes, new org.bytedeco.opencv.opencv_core.Size(size.x, size.y));
    }

    dilate(srcMat: any, destMat: any, rect_kernel: any) {
        org.bytedeco.opencv.global.opencv_imgproc.dilate(srcMat, destMat, rect_kernel);
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

    CreateMatZero(size: any, type) {
        return new org.bytedeco.opencv.opencv_core.Mat(size, type);
    }

    findContours(srcMat: any, contoursMatVector: any, hierarchyMat: any, mode: RetrievalModes, method: ContourApproximationModes): void {
        org.bytedeco.opencv.global.opencv_imgproc.findContours(srcMat, contoursMatVector, hierarchyMat, mode, method);
    }

    drawContours(srcMat: any, contours: any, index: number, color: any, lineType: LineTypes): void {
        org.bytedeco.opencv.global.opencv_imgproc.findContours(srcMat, contours, index, color, lineType);
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

    toAll28X28Image(res): ImageSource[] {
        let images = [];
        let main_image = this.ImageToMat(res);
        this.cvtColor(main_image, main_image, ColorConversionCodes.COLOR_RGB2BGR);
        this.bitwise_not(main_image, main_image);
        let orig_image = main_image.clone();

        this.cvtColor(main_image, main_image, ColorConversionCodes.COLOR_BGR2GRAY);
        this.GaussianBlur(main_image, main_image, {
            x: 5,
            y: 5
        }, 0.0, 0.0, BorderTypes.BORDER_DEFAULT);

        this.threshold(main_image, main_image, 0, 255, ThresholdTypes.THRESH_OTSU)
        //.threshold(main_image, main_image, 127, 255, org.bytedeco.opencv.global.opencv_imgproc.THRESH_OTSU + org.bytedeco.opencv.global.opencv_imgproc.THRESH_BINARY)

        let rect_kernel = this.getStructuringElement(MorphShapes.MORPH_RECT, {x: 1, y: 20});
        this.dilate(main_image, main_image, rect_kernel);
        const hierarchy = this.CreateMat();
        let contours = this.CreateMatVector();
        contours = this.findContours(main_image, contours, hierarchy, RetrievalModes.RETR_EXTERNAL, ContourApproximationModes.CHAIN_APPROX_NONE);
        let areaArray = [];
        for (let i = 0; i < contours.size(); i++) {
            let contour = contours.get(i);
            let rect = this.boundingRect(contour);
            areaArray.push({
                area: this.contourArea(contour),
                rectO: rect,
                i: i,
                contour: contour
            })
        }
        areaArray = areaArray.sort((a, b) => {
            if (a.rectO.x() < b.rectO.x()) {
                return -1;
            }
            if (a.rectO.x() > b.rectO.x()) {
                return 1;
            }
            return 0;
        });
        for (let i = 0; i < areaArray.length; i++) {
            let contourIndex = areaArray[i].i;
            let contour = contours.get(contourIndex);
            ;
            let roiF = this.boundingRect(contour);
            let mask = this.CreateMatZero(orig_image.size(), CV_8UC1);
            this.drawContours(mask, contours, contourIndex, org.bytedeco.opencv.opencv_core.Scalar(255, 255, 255), LineTypes.FILLED);
            let op;
            orig_image.copyTo(op, mask);
            let croppedImage;
            this.CreateMatFromRect(op, roiF).copyTo(croppedImage);
            let size = roiF.height() > roiF.width() ? roiF.height() : roiF.width();
            let resizeImage = this.CreateMat_Color(size + 8, size + 8, croppedImage.type(), {
                a: 255,
                r: 255,
                g: 255,
                b: 255
            });
            if (size == roiF.height()) {
                let x = (size + 8 - roiF.width()) / 2;
                croppedImage(this.CreateRange(0, croppedImage.rows() - 1), this.CreateRange(0, croppedImage.cols - 1))
                    .copyTo(resizeImage(this.CreateRange(4, 4 + croppedImage.rows - 1), this.CreateRange(x, x + croppedImage.cols - 1)));
            } else if (size == roiF.width) {
                let y = (size + 8 - roiF.height()) / 2;
                croppedImage(this.CreateRange(0, croppedImage.rows - 1), this.CreateRange(0, croppedImage.cols - 1))
                    .copyTo(resizeImage(this.CreateRange(y, y + croppedImage.rows - 1), this.CreateRange(4, 4 + croppedImage.cols - 1)));
            }
            let size28_28 = this.CreateMatZero(org.bytedeco.opencv.opencv_core.Size(28, 28), resizeImage.type());
            images.push(this.MatToImage(size28_28));
            this.resize(resizeImage, size28_28, org.bytedeco.opencv.opencv_core.Size(28, 28), 0, 0, InterpolationFlags.INTER_AREA);
            // [images addObject:[OpenCVWrapper UIImageFromCVMat:size28_28]];
        }
        // if (areaArray.length >= 1) {
        //     let rec = areaArray[areaArray.length - 1].rectO;
        //     let width: number = rec.width();
        //     let height: number = rec.height();
        //     let size: number = height > width ? height : width;
        //     main_image = this.CreateMatFromRect(orig_image, rec);
        //     let offset_height = ((size + 34) / 2 - (height + 34) / 2);
        //     let offset_width = ((size + 34) / 2 - (width + 34) / 2);
        //     let resizeImage = this.CreateMat_Color(size + 34, size + 34, main_image.type(), {
        //         b: 0.00,
        //         g: 0.00,
        //         r: 0.00,
        //         a: 255.00
        //     });
        //     if (offset_width > 0) {
        //         let rowRange = this.CreateRange(0, height); //select maximum allowed cols
        //         let rowDestRange = this.CreateRange(17, height + 17);
        //         main_image.apply(rowRange, this.CreateRange(0, width)).copyTo(resizeImage.apply(rowDestRange, this.CreateRange(offset_width, offset_width + width)));
        //     } else if (offset_height > 0) {
        //         let colRange = this.CreateRange(0, width); //select maximum allowed cols
        //         let colDestRange = this.CreateRange(17, width + 17);
        //         main_image.apply(this.CreateRange(0, height), colRange).copyTo(resizeImage.apply(this.CreateRange(offset_height, offset_height + height), colDestRange));
        //
        //     }
        //     let size28_28 = this.CreateMat_Color(28, 28, (resizeImage as any).type(), {
        //         b: 0.00,
        //         g: 0.00,
        //         r: 0.00,
        //         a: 255.00
        //     });
        //     this.resize(resizeImage, size28_28, size28_28.size(), 0, 0, InterpolationFlags.INTER_AREA);
        //     this.cvtColor(size28_28, size28_28, ColorConversionCodes.COLOR_BGR2GRAY);
        //     let bitmap = this.MatToImage(size28_28);
        //     return bitmap;
        // }
        // let bitmap = this.MatToImage(main_image);
        return images.map(p => fromNativeSource(p));
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
