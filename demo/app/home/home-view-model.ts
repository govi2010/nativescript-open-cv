import { Observable } from "tns-core-modules/data/observable";
import { Page, idProperty } from 'tns-core-modules/ui/page';
import { Slider } from 'tns-core-modules/ui/slider';
import { fromNativeSource } from 'tns-core-modules/image-source/image-source';
import { ColorPicker } from 'nativescript-color-picker';
import { DrawingPad } from 'nativescript-drawingpad';
import { request, getFile, getImage, getJSON, getString } from "tns-core-modules/http";
// import * as cv from 'nativescript-opencv';
import { Color, isIOS } from 'tns-core-modules/ui/page/page';
declare const org: any;
declare const android: any;
export class HomeViewModel extends Observable {
    private _myDrawingPad: DrawingPad;
    private _widthSlider: Slider;
    private _penInput: any;
    private _colorPicker: ColorPicker;
    private _server: string = "http://localhost:5001/api/test";
    private _method: string = "POST";
    public penWidth = 14;
    public prediction = '';
    public penColor = '#000000';
    constructor(mainPage: Page) {
        super();
        this._myDrawingPad = mainPage.getViewById('drawingPad') as DrawingPad;
        this._colorPicker = new ColorPicker();
    }
    public get_contours(res) {
        let images = [];

        try {

            //b is the Bitmap

            //calculate how many bytes our image consists of.
            let converterToBitmap = new org.bytedeco.javacv.AndroidFrameConverter();
            let converterToMat = new org.bytedeco.javacv.OpenCVFrameConverter.ToMat();
            // let frame = converterToMat.convert(res);
            let frame = converterToBitmap.convert(res);
            let main_image = converterToMat.convertToMat(frame)


            // let bitmap = this.toImage(main_image);   


            // return bitmap;


            org.bytedeco.opencv.global.opencv_imgproc.cvtColor(main_image, main_image, org.bytedeco.opencv.global.opencv_imgproc.COLOR_RGB2BGR);

            org.bytedeco.opencv.global.opencv_core.bitwise_not(main_image, main_image);
            let orig_image = main_image.clone();
            org.bytedeco.opencv.global.opencv_imgproc.cvtColor(main_image, main_image, org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2GRAY);
            // org.bytedeco.opencv.global.opencv_imgproc.blur(main_image,main_image,new org.bytedeco.opencv.opencv_core.Size(5, 5))
            // org.bytedeco.opencv.global.opencv_imgproc.medianBlur(main_image, main_image, 15)
            org.bytedeco.opencv.global.opencv_imgproc.GaussianBlur(main_image, main_image, new org.bytedeco.opencv.opencv_core.Size(5, 5), 0.0, 0.0, org.bytedeco.opencv.global.opencv_core.BORDER_DEFAULT);
            org.bytedeco.opencv.global.opencv_imgproc.adaptiveThreshold(main_image, main_image, 125, org.bytedeco.opencv.global.opencv_imgproc.ADAPTIVE_THRESH_MEAN_C, org.bytedeco.opencv.global.opencv_imgproc.THRESH_BINARY_INV, 11, 12)
            //.threshold(main_image, main_image, 127, 255, org.bytedeco.opencv.global.opencv_imgproc.THRESH_OTSU + org.bytedeco.opencv.global.opencv_imgproc.THRESH_BINARY)


            const hierarchy = new org.bytedeco.opencv.opencv_core.Mat();
            let contours = new org.bytedeco.opencv.opencv_core.MatVector();



            org.bytedeco.opencv.global.opencv_imgproc.findContours(main_image, contours, hierarchy, org.bytedeco.opencv.global.opencv_imgproc.RETR_EXTERNAL, org.bytedeco.opencv.global.opencv_imgproc.CHAIN_APPROX_NONE);
            


            let areaArray = [];

            for (let i = 0; i < contours.size(); i++) {
                let contour = contours.get(i);
                let rect = org.bytedeco.opencv.global.opencv_imgproc.boundingRect(contour);
                areaArray.push({
                    rect: { x: rect.x(), y: rect.y(), height: rect.height(), width: rect.width() },
                    area: org.bytedeco.opencv.global.opencv_imgproc.contourArea(contour),
                    rectO: rect
                })
                // org.bytedeco.opencv.global.opencv_imgproc.rectangle(main_image, rect, new org.bytedeco.opencv.opencv_core.Scalar(255.0, 255.0, 255.0, 255.0), 5, 8, 0);
                // org.bytedeco.opencv.global.opencv_imgproc.drawContours(main_image, contours, i, new org.bytedeco.opencv.opencv_core.Scalar(255.0, 255.0, 255.0, 255.0));
            }
            areaArray = areaArray.sort((a, b) => {
                if (a.area < b.area) {
                    return -1;
                }
                if (a.area > b.area) {
                    return 1;
                }
                return 0;
            });
            if (areaArray.length >= 1) {
                let rec = areaArray[areaArray.length - 1].rectO;
                let width: number = rec.width();
                let height: number = rec.height();
                let size: number = height > width ? height : width;
                main_image = new org.bytedeco.opencv.opencv_core.Mat(orig_image, rec);
                debugger;
                let offset_height = ((size + 34) / 2 - (height + 34) / 2);
                let offset_width = ((size + 34) / 2 - (width + 34) / 2);
                let resizeImage = new org.bytedeco.opencv.opencv_core.Mat(size + 34, size + 34, main_image.type(), new org.bytedeco.opencv.opencv_core.Scalar(0.00, 0.00, 0.00, 255.00));

                if (offset_width > 0) {
                    let rowRange = new org.bytedeco.opencv.opencv_core.Range(0, height); //select maximum allowed cols
                    let rowDestRange = new org.bytedeco.opencv.opencv_core.Range(17, height + 17);
                    main_image.apply(rowRange, new org.bytedeco.opencv.opencv_core.Range(0, width)).copyTo(resizeImage.apply(rowDestRange, new org.bytedeco.opencv.opencv_core.Range(offset_width, offset_width + width)));
                } else if (offset_height > 0) {
                    let colRange = new org.bytedeco.opencv.opencv_core.Range(0, width); //select maximum allowed cols
                    let colDestRange = new org.bytedeco.opencv.opencv_core.Range(17, width + 17);
                    main_image.apply(new org.bytedeco.opencv.opencv_core.Range(0, height), colRange).copyTo(resizeImage.apply(new org.bytedeco.opencv.opencv_core.Range(offset_height, offset_height + height), colDestRange));

                }
                let size28_28 = new org.bytedeco.opencv.opencv_core.Mat(28, 28, (resizeImage as any).type());
                org.bytedeco.opencv.global.opencv_imgproc.resize(resizeImage, size28_28, size28_28.size(), 0, 0, org.bytedeco.opencv.global.opencv_imgproc.INTER_AREA);
                org.bytedeco.opencv.global.opencv_imgproc.cvtColor(size28_28, size28_28, org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2GRAY);
                // org.bytedeco.opencv.global.opencv_photo.fastNlMeansDenoising(size28_28, size28_28, 3, 7, 21)
                // org.bytedeco.opencv.global.opencv_imgproc.threshold(size28_28, size28_28, 0, 255, org.bytedeco.opencv.global.opencv_imgproc.THRESH_OTSU + org.bytedeco.opencv.global.opencv_imgproc.THRESH_BINARY)
                let bitmap = this.toImage(size28_28);
                return bitmap;
            }

            let bitmap = this.toImage(main_image);
            return bitmap;
        } catch (r) { console.log(r) }

    }
    public toImage(mat) {
        let converterToBitmap = new org.bytedeco.javacv.AndroidFrameConverter();
        let converterToMat = new org.bytedeco.javacv.OpenCVFrameConverter.ToMat();
        let frame = converterToMat.convert(mat);
        return converterToBitmap.convert(frame);
    }
    public getMyDrawing() {

        this._myDrawingPad.getDrawingSvg().then(res => {
            console.log(res);
        });
        this._myDrawingPad.getDrawing().then(res => {
            console.log(res);
            let bit = this.get_contours(res);
            this.set('prediction', "");
            const image = fromNativeSource(bit);
            this.set('drawingImage', image);
            const imageBase64 = image.toBase64String('jpeg');
            request({
                url: "http://192.168.1.6:5001/api/test",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({ image: imageBase64 })
            }).then((response) => {
                const result = response.content.toJSON();
                console.log(result);
                this.set('prediction', result);
            }, (e) => {
            });
            console.log('trying to set image');
            // this.set('drawingImage', image);
        });
    }
    public getMyDrawingSvg() {
        this._myDrawingPad.getDrawingSvg().then(res => {
            console.log(res);
        });
    }
    public clearMyDrawing() {
        this._myDrawingPad.clearDrawing();
        this.set('drawingImage', null);
    }
    public changePenColor() {
        this.set('penColor', '#ff4801');
    }

    public openColorPicker() {
        this._colorPicker
            .show('#3489db', 'HEX')
            .then(result => {
                this.set('penColor', result);
            })
            .catch(err => {
                console.log(err);
            });
    }
}
