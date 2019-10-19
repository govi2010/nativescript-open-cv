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
import {releaseNativeObject} from "tns-core-modules/utils/utils";

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
    }

    load() {
        try {
            if (org && org.bytedeco && org.bytedeco.javacpp) {
                org.bytedeco.javacpp.Loader.load(org.bytedeco.opencv.helper.opencv_core.class);
                org.bytedeco.javacpp.Loader.load(org.bytedeco.opencv.helper.opencv_imgproc.class);
            }
        } catch (e) {

        }
    }

    cvtColor(srcMat: any, destMat: any, dstChannels: ColorConversionCodes): void {
        org.bytedeco.opencv.global.opencv_imgproc.cvtColor(srcMat, destMat, dstChannels);
    }

    MatToImage(srcMat: any) {
        let converterToBitmap = new org.bytedeco.javacv.AndroidFrameConverter();
        let converterToMat = new org.bytedeco.javacv.OpenCVFrameConverter.ToMat();
        let frame = converterToMat.convert(srcMat);
        let result = converterToBitmap.convert(frame);
        releaseNativeObject(frame);
        releaseNativeObject(converterToMat);
        releaseNativeObject(converterToBitmap);
        return result;
    }

    ImageToMat(bitMapImage: any) {
        let converterToBitmap = new org.bytedeco.javacv.AndroidFrameConverter();
        let converterToMat = new org.bytedeco.javacv.OpenCVFrameConverter.ToMat();
        // let frame = converterToMat.convert(res);
        let frame = converterToBitmap.convert(bitMapImage);
        let main_image = converterToMat.convertToMat(frame);
        releaseNativeObject(frame);
        releaseNativeObject(converterToMat);
        releaseNativeObject(converterToBitmap);
        return main_image;
    }

    bitwise_not(srcMat: any, destMat: any): void {
        return org.bytedeco.opencv.global.opencv_core.bitwise_not(srcMat, destMat);
    }

    GaussianBlur(srcMat: any, destMat: any, size: { x, y }, x: number, y: number, borderTypes: BorderTypes): void {
        // throw new Error("Methodnotimplemented.");
        let s = new org.bytedeco.opencv.opencv_core.Size(size.x, size.y);
        org.bytedeco.opencv.global.opencv_imgproc.GaussianBlur(srcMat, destMat, s, x, y, borderTypes);
        releaseNativeObject(s);
    }

    adaptiveThreshold(srcMat: any, destMat: any, maxValue: number, adaptiveMethod: AdaptiveThresholdTypes, thresholdType: ThresholdTypes, blockSize: number, C: number): void {
        org.bytedeco.opencv.global.opencv_imgproc.adaptiveThreshold(srcMat, destMat, maxValue, adaptiveMethod, thresholdType, blockSize, C)
    }

    threshold(srcMat: any, destMat: any, thresh: number, maxval: number, thresholdType: ThresholdTypes): void {
        org.bytedeco.opencv.global.opencv_imgproc.threshold(srcMat, destMat, thresh, maxval, thresholdType);
    }


    getStructuringElement(morphShapes: MorphShapes, size: { x: number, y: number }): any {
        let s = new org.bytedeco.opencv.opencv_core.Size(size.x, size.y);
        let result = org.bytedeco.opencv.global.opencv_imgproc.getStructuringElement(morphShapes, s);
        releaseNativeObject(s);
        return result;
    }

    dilate(srcMat: any, destMat: any, rect_kernel: any) {
        org.bytedeco.opencv.global.opencv_imgproc.dilate(srcMat, destMat, rect_kernel);
    }

    erode(srcMat: any, destMat: any, rect_kernel: any) {
        org.bytedeco.opencv.global.opencv_imgproc.erode(srcMat, destMat, rect_kernel);
    }

    CreateMat(): any {
        return new org.bytedeco.opencv.opencv_core.Mat();
    }

    CreateMatFromRect(srcMat: any, rect: any): any {
        return new org.bytedeco.opencv.opencv_core.Mat(srcMat, rect);
    }

    CreateMat_Color(rows: number, cols: number, imageType: any, color: { b, g, r, a }): any {
        let colorS = new org.bytedeco.opencv.opencv_core.Scalar(color.b, color.g, color.r, color.a);
        let mat = new org.bytedeco.opencv.opencv_core.Mat(rows, cols, imageType, colorS);
        releaseNativeObject(colorS);
        return mat;
    }

    CreateMatVector() {
        return new org.bytedeco.opencv.opencv_core.MatVector();
    }

    CreateMatZero(size: any, type) {
        let c = new org.bytedeco.opencv.opencv_core.Scalar(0, 0, 0, 0)
        let mat = new org.bytedeco.opencv.opencv_core.Mat(size, type, c);
        releaseNativeObject(c);
        return mat;
    }


    findContours(srcMat: any, contoursMatVector: any, hierarchyMat: any, mode: RetrievalModes, method: ContourApproximationModes): void {
        org.bytedeco.opencv.global.opencv_imgproc.findContours(srcMat, contoursMatVector, hierarchyMat, mode, method);
    }

    drawContours(srcMat: any, contours: any, index: number, color: any, lineType: LineTypes): void {
        let p = new org.bytedeco.opencv.opencv_core.Point(0, 0);
        org.bytedeco.opencv.global.opencv_imgproc.drawContours(srcMat, contours, index, color, -1, 8, null, Number.MAX_SAFE_INTEGER, p);
        releaseNativeObject(p);
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

    FindMedian(values) {
        values.sort((a, b) => a - b);
        let lowMiddle = Math.floor((values.length - 1) / 2);
        let highMiddle = Math.ceil((values.length - 1) / 2);
        let median = (values[lowMiddle] + values[highMiddle]) / 2;
        return median;
    }

    toAll28X28Image(res): ImageSource[] {

        let images = [];


        let main_image = this.ImageToMat(res);
        this.cvtColor(main_image, main_image, ColorConversionCodes.COLOR_RGB2BGR);
        this.bitwise_not(main_image, main_image);
        let orig_image = main_image.clone();
        this.processImageForFindContour(main_image);

        let hierarchy = this.CreateMat();
        let contours = this.CreateMatVector();
        this.findContours(main_image, contours, hierarchy, RetrievalModes.RETR_EXTERNAL, ContourApproximationModes.CHAIN_APPROX_NONE);
        let areaArray = [];
        for (let i = 0; i < contours.size(); i++) {
            let contour = contours.get(i);
            let rect = this.boundingRect(contour);
            areaArray.push({
                area: this.contourArea(contour),
                rectO: rect,
                width: rect.width(),
                height: rect.height(),
                i: i,
                contour: contour
            })
        }
        let medHeight = this.FindMedian(areaArray.map(p => p.height));
        let medWidth = this.FindMedian(areaArray.map(p => p.width));
        console.log('Old medHeight: ' + medHeight);
        console.log('Old medWidth: ' + medWidth);
        console.log('dilate medHeight: ' + ((medHeight * 2) / 3));

        let rect_kernel = this.getStructuringElement(MorphShapes.MORPH_CROSS, {x: 1, y: (medHeight * 2) / 3});
        this.dilate(main_image, main_image, rect_kernel);
        contours = this.CreateMatVector();
        hierarchy = this.CreateMat();
        this.findContours(main_image, contours, hierarchy, RetrievalModes.RETR_EXTERNAL, ContourApproximationModes.CHAIN_APPROX_NONE);
        areaArray = [];
        for (let i = 0; i < contours.size(); i++) {
            let contour = contours.get(i);
            let rect = this.boundingRect(contour);
            areaArray.push({
                area: this.contourArea(contour),
                rectO: rect,
                width: rect.width(),
                height: rect.height(),
                i: i,
                contour: contour
            })
        }


        medHeight = this.FindMedian(areaArray.map(p => p.height));
        medWidth = this.FindMedian(areaArray.map(p => p.width));
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
            // if (areaArray[i].rectO.height() > 150 || areaArray[i].rectO.width() > 150) {
            let contourIndex = areaArray[i].i;
            let contour = contours.get(contourIndex);
            let roiF = this.boundingRect(contour);
            console.log(i + 'widht:' + roiF.width());
            console.log(i + 'height:' + roiF.height());
            let mask = this.CreateMatZero(orig_image.size(), org.bytedeco.opencv.global.opencv_core.CV_8UC1);
            this.drawContours(mask, contours, contourIndex, new org.bytedeco.opencv.opencv_core.Scalar(255, 255, 255, 255), LineTypes.FILLED);

            let contoursF = this.CreateMatVector();
            let hierarchyF = this.CreateMat();
            let op = this.CreateMat();
            orig_image.copyTo(op, mask);
            this.processImageForFindContour(op);
            this.findContours(op, contoursF, hierarchyF, RetrievalModes.RETR_EXTERNAL, ContourApproximationModes.CHAIN_APPROX_NONE);
            let mask1 = this.CreateMatZero(orig_image.size(), org.bytedeco.opencv.global.opencv_core.CV_8UC1);
            let rectArray = [];
            for (let i = 0; i < contoursF.size(); i++) {
                let contour = contoursF.get(i);
                let rect = this.boundingRect(contour);
                this.drawContours(mask1, contoursF, i, new org.bytedeco.opencv.opencv_core.Scalar(255, 255, 255, 255), LineTypes.FILLED);
                rectArray.push(rect)
            }
            let roiF2 = this.getMostOuterBox(rectArray); //this.boundingRect(contoursF.get(0));

            let size28_28_F = this.CreateMatZero(new org.bytedeco.opencv.opencv_core.Size(28, 28), orig_image.type());
            this.get28X28(orig_image, mask1, roiF2, size28_28_F)
            images.push(this.MatToImage(size28_28_F));


            size28_28_F.release();
            mask.release();
            mask1.release();
            releaseNativeObject(size28_28_F);
            releaseNativeObject(mask);
            // }

        }
        main_image.release();
        orig_image.release();
        hierarchy.release();
        releaseNativeObject(main_image);
        releaseNativeObject(orig_image);
        releaseNativeObject(hierarchy);
        releaseNativeObject(contours);
        return images.map(p => fromNativeSource(p));

    }

    get28X28(orig_image, mask1, roiF, size28_28) {
        let op = this.CreateMat();
        orig_image.copyTo(op, mask1);
        let croppedImage = this.CreateMat();
        this.CreateMatFromRect(op, roiF).copyTo(croppedImage);
        let size = roiF.height() > roiF.width() ? roiF.height() : roiF.width();
        let resizeImage = this.CreateMat_Color(size + 0, size + 0, croppedImage.type(), {
            a: 255,
            r: 0,
            g: 0,
            b: 0
        });
        if (size == roiF.height()) {
            let x = (size - roiF.width()) / 2;
            croppedImage.apply(this.CreateRange(0, croppedImage.size().height() - 1), this.CreateRange(0, croppedImage.size().width() - 1))
                .copyTo(resizeImage.apply(this.CreateRange(0, 0 + croppedImage.size().height() - 1), this.CreateRange(x, x + croppedImage.size().width() - 1)));
        } else if (size == roiF.width()) {
            let y = (size + 0 - roiF.height()) / 2;
            croppedImage.apply(this.CreateRange(0, croppedImage.size().height() - 1), this.CreateRange(0, croppedImage.size().width() - 1))
                .copyTo(resizeImage.apply(this.CreateRange(y, y + croppedImage.size().height() - 1), this.CreateRange(0, 0 + croppedImage.size().width() - 1)));
        }
        let size23_23 = this.CreateMatZero(new org.bytedeco.opencv.opencv_core.Size(23, 23), resizeImage.type());
        this.resize(resizeImage, size23_23, new org.bytedeco.opencv.opencv_core.Size(23, 23), 0, 0, InterpolationFlags.INTER_AREA);
        //
        size23_23.apply(this.CreateRange(0, 23), this.CreateRange(0, 23))
            .copyTo(size28_28.apply(this.CreateRange(3, 3 + 23), this.CreateRange(3, 3 + 23)));
        op.release();
        size23_23.release();
        resizeImage.release();
        releaseNativeObject(op);
        releaseNativeObject(size23_23);
        releaseNativeObject(resizeImage);
        // return
    }

    processImageForFindContour(main_image) {
        this.cvtColor(main_image, main_image, ColorConversionCodes.COLOR_BGR2GRAY);
        this.GaussianBlur(main_image, main_image, {
            x: 5,
            y: 5
        }, 0.0, 0.0, BorderTypes.BORDER_DEFAULT);

        this.threshold(main_image, main_image, 0, 255, ThresholdTypes.THRESH_OTSU)
    }

    getMostOuterBox(rectArray) {

        var rect = rectArray.reduce(this.unionRect)
        // x = min(a[0], b[0])
        // y = min(a[1], b[1])
        // w = max(a[0]+a[2], b[0]+b[2]) - x
        // h = max(a[1]+a[3], b[1]+b[3]) - y
        return rect;

    }

    unionRect(a, b) {
        debugger;
        let x = Math.min(a.x(), b.x())
        let y = Math.min(a.y(), b.y())
        let w = Math.max(a.x() + a.width(), b.x() + b.width()) - x
        let h = Math.max(a.y() + a.height(), b.y() + b.height()) - y
        return new org.bytedeco.opencv.opencv_core.Rect(x, y, w, h);
    }

    eastDetection(res) {
        debugger;
        let scoreThresh = 0.5;
        let nmsThresh = 0.4;
        let net = org.bytedeco.opencv.global.opencv_dnn.readNetFromTensorflow("c:/data/mdl/frozen_east_text_detection.pb");
        // input image

        org.bytedeco.opencv.global.opencv_imgproc.cvtColor(res, res, org.bytedeco.opencv.global.opencv_imgproc.cvtColor.COLOR_RGBA2RGB);

        let siz = new org.bytedeco.opencv.opencv_core.Size(320, 320);
        let W = (siz.width / 4); // width of the output geometry  / score maps
        let H = (siz.height / 4); // height of those. the geometry has 4, vertically stacked maps, the score one 1
        let blob = org.bytedeco.opencv.global.opencv_dnn.blobFromImage(res, 1.0, siz, new org.bytedeco.opencv.opencv_core.Scalar(123.68, 116.78, 103.94), true, false);
        net.setInput(blob);
        let outs;
        let outNames;
        outNames.push("feature_fusion/Conv_7/Sigmoid");
        outNames.push("feature_fusion/concat_3");
        net.forward(outs, outNames);

        // Decode predicted bounding boxes.
        let scores = outs.get(0).reshape(1, H);
        // My lord and savior : http://answers.opencv.org/question/175676/javaandroid-access-4-dim-mat-planes/
        let geometry = outs.get(1).reshape(1, 5 * H); // don't hardcode it !
        let confidencesList;
        let boxesList = this.decode(scores, geometry, confidencesList, scoreThresh);

        // Apply non-maximum suppression procedure.
        let confidences = new org.opencv.core.MatOfFloat(org.opencv.utils.Converters.vector_float_to_Mat(confidencesList));
        let boxesArray = boxesList.toArray(new org.bytedeco.opencv.opencv_core.RotatedRect[0]);
        let boxes = new org.opencv.core.MatOfRotatedRect(boxesArray);
        let indices = new org.opencv.core.MatOfInt();
        org.bytedeco.opencv.global.opencv_dnn.NMSBoxesRotated(boxes, confidences, scoreThresh, nmsThresh, indices);

        // Render detections
        let ratio = new org.bytedeco.opencv.opencv_core.Point(res.cols() / siz.width, res.rows() / siz.height);
        let indexes = indices.toArray();
        for (let i = 0; i < indexes.length; ++i) {
            let rot = boxesArray[indexes[i]];
            let vertices = new org.bytedeco.opencv.opencv_core.Point[4];
            rot.points(vertices);
            for (let j = 0; j < 4; ++j) {
                vertices[j].x *= ratio.x;
                vertices[j].y *= ratio.y;
            }
            for (let j = 0; j < 4; ++j) {
                org.bytedeco.opencv.global.opencv_imgproc.line(res, vertices[j], vertices[(j + 1) % 4], new org.bytedeco.opencv.opencv_core.Scalar(0, 0, 255), 1);
            }
        }
        return res;
        // Imgcodecs.imwrite("out.png", frame);
    }

    decode(scores, geometry, confidences, scoreThresh) {
        // size of 1 geometry plane
        let W = geometry.cols();
        let H = geometry.rows() / 5;
        //System.out.println(geometry);
        //System.out.println(scores);

        let detections;
        for (let y = 0; y < H; ++y) {
            let scoresData = scores.row(y);
            let x0Data = geometry.submat(0, H, 0, W).row(y);
            let x1Data = geometry.submat(H, 2 * H, 0, W).row(y);
            let x2Data = geometry.submat(2 * H, 3 * H, 0, W).row(y);
            let x3Data = geometry.submat(3 * H, 4 * H, 0, W).row(y);
            let anglesData = geometry.submat(4 * H, 5 * H, 0, W).row(y);

            for (let x = 0; x < W; ++x) {
                let score = scoresData.get(0, x)[0];
                if (score >= scoreThresh) {
                    let offsetX = x * 4.0;
                    let offsetY = y * 4.0;
                    let angle = anglesData.get(0, x)[0];
                    let cosA = Math.cos(angle);
                    let sinA = Math.sin(angle);
                    let x0 = x0Data.get(0, x)[0];
                    let x1 = x1Data.get(0, x)[0];
                    let x2 = x2Data.get(0, x)[0];
                    let x3 = x3Data.get(0, x)[0];
                    let h = x0 + x2;
                    let w = x1 + x3;
                    let offset = new org.bytedeco.opencv.opencv_core.Point(offsetX + cosA * x1 + sinA * x2, offsetY - sinA * x1 + cosA * x2);
                    let p1 = new org.bytedeco.opencv.opencv_core.Point(-1 * sinA * h + offset.x, -1 * cosA * h + offset.y);
                    let p3 = new org.bytedeco.opencv.opencv_core.Point(-1 * cosA * w + offset.x, sinA * w + offset.y); // original trouble here !
                    let r = new org.bytedeco.opencv.opencv_core.RotatedRect(new org.bytedeco.opencv.opencv_core.Point(0.5 * (p1.x + p3.x), 0.5 * (p1.y + p3.y)), new org.bytedeco.opencv.opencv_core.Size(w, h), -1 * angle * 180 / Math.PI);
                    detections.add(r);
                    confidences.add(score);
                }
            }
        }
        return detections;
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
