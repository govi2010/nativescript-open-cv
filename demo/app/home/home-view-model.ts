import {Observable} from "tns-core-modules/data/observable";
import {Page} from 'tns-core-modules/ui/page';
import {Slider} from 'tns-core-modules/ui/slider';
import {ColorPicker} from 'nativescript-color-picker';
import {DrawingPad} from 'nativescript-drawingpad';
import {OpenCV} from "nativescript-open-cv";
import {fromNativeSource} from "tns-core-modules/image-source";

declare var OPENCV_8UC4, OpenCVMat;

// var s = require("nativescript-open-cv");
declare const org: any;
declare const android: any;

export class HomeViewModel extends Observable {
    public penWidth = 14;
    public prediction = '';
    public penColor = '#0000FF';
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
            debugger;
            let main_image = this.OpenCv.toAll28X28Image(res);
            return main_image;

        } catch (r) {
            console.log(r);
        }

    }

    public getMyDrawing() {
        this._myDrawingPad.getDrawingSvg().then(res => {
            console.log(res);
        });
        this._myDrawingPad.getDrawing().then(res => {
            console.log(res);

            let bit = this.get_contours(res);
            this.set('prediction', "");
            // const image = fromNativeSource(bit);
            // let img = (this.OpenCv as any).ApplyResultOnImage(res);
            // bit.push(img);


            // (this._myDrawingPad as any).nativeElement.android.setSignatureBitmap(img.android);
            let r = false;

            bit.forEach((i: any) => {
                res = this.OpenCv.ChangeColor(res, i.rect, r);
                r = !r;
            });
            bit.push({img: fromNativeSource(res), rect: null});
            // bit.push({img: fromNativeSource(res), rect: null});
            this.set('drawingImage', bit.map((p: any) => p.img));
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
