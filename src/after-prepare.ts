const sourceMapLocation = '/node_modules/nativescript-open-cv/platforms/ios/module.modulemap';
const targetMapLocation = '/platforms/ios/Pods/OpenCV/opencv2.framework/Modules/module.modulemap';
// @ts-ignore
import * as fs from 'fs';
// @ts-ignore
import * as path from 'path';
// @ts-ignore
module.exports = function(logger, platformsData, projectData, hookArgs, $usbLiveSyncService) {
    const targetMapFolder = path.dirname(projectData.projectDir + targetMapLocation);
    if (!fs.existsSync(targetMapFolder)) {
        try {
            fs.mkdirSync(targetMapFolder);
        } catch (e) {}
    }
    if (fs.existsSync(targetMapFolder)) {
        fs.copyFileSync(projectData.projectDir + sourceMapLocation, projectData.projectDir + targetMapLocation);
    }
};
