import {
    OpenCV
} from 'nativescript-open-cv';
import { android } from 'tns-core-modules/application';
import { isAndroid, device } from 'tns-core-modules/platform';
import { Color } from 'tns-core-modules/color';
// console.log(new OpenCv().message);
/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { NavigatedData, Page } from "tns-core-modules/ui/page";

import { HomeViewModel } from "./home-view-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = new HomeViewModel(page);
    if (isAndroid && device.sdkVersion >= '21') {
        const window = android.startActivity.getWindow();
        window.setStatusBarColor(new Color('#336699').android);
    }
}
