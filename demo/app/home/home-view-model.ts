import {Observable} from "tns-core-modules/data/observable";
import {Page} from 'tns-core-modules/ui/page';
import {Slider} from 'tns-core-modules/ui/slider';
import {fromNativeSource} from 'tns-core-modules/image-source/image-source';
import {ColorPicker} from 'nativescript-color-picker';
import {DrawingPad} from 'nativescript-drawingpad';
import {request} from "tns-core-modules/http";
import {
    AdaptiveThresholdTypes,
    BorderTypes,
    ColorConversionCodes,
    ContourApproximationModes,
    InterpolationFlags,
    OpenCV,
    RetrievalModes,
    ThresholdTypes
} from "nativescript-open-cv";
import {isIOS} from "tns-core-modules/platform";
import {ios} from "tns-core-modules/utils/utils";
import nsArrayToJSArray = ios.collections.nsArrayToJSArray;

declare var OPENCV_8UC4, OpenCVMat;

// var s = require("nativescript-open-cv");
declare const org: any;
declare const android: any;

export class HomeViewModel extends Observable {
    public penWidth = 14;
    public prediction = '';
    public penColor = '#000000';
    OpenCv: OpenCV;
    private _myDrawingPad: DrawingPad;
    private _widthSlider: Slider;
    private _penInput: any;
    private _colorPicker: ColorPicker;
    private _server: string = "http://localhost:5001/api/test";
    private _method: string = "POST";

    constructor(mainPage: Page) {
        super();
        this._myDrawingPad = mainPage.getViewById('drawingPad') as DrawingPad;
        this._colorPicker = new ColorPicker();
        this.OpenCv = new OpenCV();
        this.set('drawingImage', null);
        this._myDrawingPad.clearDrawing();
        this._myDrawingPad.clearOnLongPress = false;

    }

    public get_contours(res) {
        let images = [];

        // o.

        try {
            // return res;
            // debugger;
            let main_image = this.OpenCv.ImageToMat(res);
            if (!isIOS) {
                let bitmap1 = this.OpenCv.MatToImage(main_image);

                return bitmap1;
                // let grayImage = main_image.clone();
                if (isIOS) {
                    this.OpenCv.extractChannel(main_image, main_image);
                } else {
                    this.OpenCv.cvtColor(main_image, main_image, ColorConversionCodes.COLOR_RGB2BGR);
                }


                this.OpenCv.bitwise_not(main_image, main_image);
                let orig_image = main_image.clone();
                if (!isIOS)
                    this.OpenCv.cvtColor(main_image, main_image, ColorConversionCodes.COLOR_BGR2GRAY);
                // org.bytedeco.opencv.global.opencv_imgproc.blur(main_image,main_image,new org.bytedeco.opencv.opencv_core.Size(5, 5))
                // org.bytedeco.opencv.global.opencv_imgproc.medianBlur(main_image, main_image, 15)
                this.OpenCv.GaussianBlur(main_image, main_image, {
                    x: 5,
                    y: 5
                }, 0.0, 0.0, BorderTypes.BORDER_DEFAULT);
                this.OpenCv.adaptiveThreshold(main_image, main_image, 125, AdaptiveThresholdTypes.ADAPTIVE_THRESH_MEAN_C, ThresholdTypes.THRESH_BINARY_INV, 11, 12)
                //.threshold(main_image, main_image, 127, 255, org.bytedeco.opencv.global.opencv_imgproc.THRESH_OTSU + org.bytedeco.opencv.global.opencv_imgproc.THRESH_BINARY)


                const hierarchy = this.OpenCv.CreateMat();
                let contours = this.OpenCv.CreateMatVector();

                contours = this.OpenCv.findContours(main_image, contours, hierarchy, RetrievalModes.RETR_EXTERNAL, ContourApproximationModes.CHAIN_APPROX_NONE, {
                    x: 0,
                    y: 0
                });


                let areaArray = [];

                for (let i = 0; i < contours.size(); i++) {
                    let contour = isIOS ? contours.getCountour(i) : contours.get(i);
                    let rect = this.OpenCv.boundingRect(contour);
                    areaArray.push({
                        area: this.OpenCv.contourArea(contour),
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
                    let width: number = isIOS ? (rec.objectForKey('width')) : rec.width();
                    let height: number = isIOS ? (rec.objectForKey('height')) : rec.height();
                    let size: number = height > width ? height : width;
                    main_image = this.OpenCv.CreateMatFromRect(orig_image, rec);
                    debugger;
                    let offset_height = ((size + 34) / 2 - (height + 34) / 2);
                    let offset_width = ((size + 34) / 2 - (width + 34) / 2);
                    let resizeImage = this.OpenCv.CreateMat_Color(size + 34, size + 34, main_image.type(), {
                        b: 0.00,
                        g: 0.00,
                        r: 0.00,
                        a: 255.00
                    });

                    if (offset_width > 0) {
                        let rowRange = this.OpenCv.CreateRange(0, height); //select maximum allowed cols
                        let rowDestRange = this.OpenCv.CreateRange(17, height + 17);
                        main_image.apply(rowRange, this.OpenCv.CreateRange(0, width)).copyTo(resizeImage.apply(rowDestRange, this.OpenCv.CreateRange(offset_width, offset_width + width)));
                    } else if (offset_height > 0) {
                        let colRange = this.OpenCv.CreateRange(0, width); //select maximum allowed cols
                        let colDestRange = this.OpenCv.CreateRange(17, width + 17);
                        main_image.apply(this.OpenCv.CreateRange(0, height), colRange).copyTo(resizeImage.apply(this.OpenCv.CreateRange(offset_height, offset_height + height), colDestRange));

                    }
                    let size28_28 = this.OpenCv.CreateMat_Color(28, 28, (resizeImage as any).type(), {
                        b: 0.00,
                        g: 0.00,
                        r: 0.00,
                        a: 255.00
                    });
                    this.OpenCv.resize(resizeImage, size28_28, size28_28.size(), 0, 0, InterpolationFlags.INTER_AREA);
                    this.OpenCv.cvtColor(size28_28, size28_28, ColorConversionCodes.COLOR_BGR2GRAY);
                    let bitmap = this.OpenCv.MatToImage(size28_28);
                    return bitmap;
                }
                let bitmap = this.OpenCv.MatToImage(main_image);
                return bitmap;
            } else {
                debugger;
                let bitmap1 = main_image.toAll28X28Image();
                return bitmap1;
            }

        } catch (r) {
            console.log(r)
        }

    }

    public getMyDrawing() {

        this._myDrawingPad.getDrawingSvg().then(res => {
            console.log(res);
        });
        this._myDrawingPad.getDrawing().then(res => {
            console.log(res);

            let bit = this.get_contours(res);
            let images = nsArrayToJSArray(bit).map(p=>fromNativeSource(p));
            this.set('prediction', "");
            // const image = fromNativeSource(bit);
            this.set('drawingImage', images);
            // const imageBase64 = image.toBase64String('jpeg');
            // request({
            //     url: "http://192.168.1.6:5001/api/test",
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     content: JSON.stringify({image: imageBase64})
            // }).then((response) => {
            //     const result = response.content.toJSON();
            //     console.log(result);
            //     this.set('prediction', result);
            // }, (e) => {
            // });
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
