import {ImageSource} from "tns-core-modules/image-source";

export declare class OpenCV {
    extractChannel(srcMat: any, destMat: any): void;

    cvtColor(srcMat: any, destMat: any, dstChannels: number): void;

    MatToImage(srcMat: any): any;

    ImageToMat(bitMapImage: any): any;

    bitwise_not(srcMat: any, destMat: any): void;

    GaussianBlur(srcMat: any, destMat: any, size: any, x: number, y: number, sigmaX: number): void;

    adaptiveThreshold(srcMat: any, destMat: any, maxValue: number, adaptiveMethod: number, thresholdType: number, blockSize: number, C: number): void;

    CreateMat(): any;

    CreateMatFromRect(srcMat: any, rect: any): any;

    CreateMat_Color(rows: number, cols: number, imageType: any, color: { b, g, r, a }): any;

    CreateMatVector(): any;

    findContours(srcMat: any, contoursMatVector: any, hierarchyMat: any, mode: number, method: number, offset: { x: number, y: number }): void;

    contourArea(contours: any): number;

    boundingRect(contours: any): any;

    CreateRange(start: number, end: number): any;

    resize(srcMat: any, destMat: any, size: any, x: number, y: number, method: number): void;

    toAll28X28Image(res: any):  { img: ImageSource, rect }[];

    ChangeColor(res, rect, result): any;

    load();
}

export declare enum SpecialFilter {
    FILTER_SCHARR = -1
}

export declare enum MorphTypes {
    MORPH_ERODE = 0,
    MORPH_DILATE = 1,
    MORPH_OPEN = 2,
    MORPH_CLOSE = 3,
    MORPH_GRADIENT = 4,
    MORPH_TOPHAT = 5,
    MORPH_BLACKHAT = 6,
    MORPH_HITMISS = 7
}

export declare enum MorphShapes {
    MORPH_RECT = 0,
    MORPH_CROSS = 1,
    MORPH_ELLIPSE = 2
}

export declare enum InterpolationFlags {
    INTER_NEAREST = 0,
    INTER_LINEAR = 1,
    INTER_CUBIC = 2,
    INTER_AREA = 3,
    INTER_LANCZOS4 = 4,
    INTER_LINEAR_EXACT = 5,
    INTER_MAX = 7,
    WARP_FILL_OUTLIERS = 8,
    WARP_INVERSE_MAP = 16
}

export declare enum WarpPolarMode {
    WARP_POLAR_LINEAR = 0,
    WARP_POLAR_LOG = 256
}

export declare enum InterpolationMasks {
    INTER_BITS = 5,
    INTER_BITS2 = 10,
    INTER_TAB_SIZE = 32,
    INTER_TAB_SIZE2 = 1024
}

export declare enum DistanceTypes {
    DIST_USER = -1,
    DIST_L1 = 1,
    DIST_L2 = 2,
    DIST_C = 3,
    DIST_L12 = 4,
    DIST_FAIR = 5,
    DIST_WELSCH = 6,
    DIST_HUBER = 7
}

export declare enum DistanceTransformMasks {
    DIST_MASK_3 = 3,
    DIST_MASK_5 = 5,
    DIST_MASK_PRECISE = 0
}

export declare enum ThresholdTypes {
    THRESH_BINARY = 0,
    THRESH_BINARY_INV = 1,
    THRESH_TRUNC = 2,
    THRESH_TOZERO = 3,
    THRESH_TOZERO_INV = 4,
    THRESH_MASK = 7,
    THRESH_OTSU = 8,
    THRESH_TRIANGLE = 16
}

export declare enum AdaptiveThresholdTypes {
    ADAPTIVE_THRESH_MEAN_C = 0,
    ADAPTIVE_THRESH_GAUSSIAN_C = 1
}

export declare enum GrabCutClasses {
    GC_BGD = 0,
    GC_FGD = 1,
    GC_PR_BGD = 2,
    GC_PR_FGD = 3
}

export declare enum GrabCutModes {
    GC_INIT_WITH_RECT = 0,
    GC_INIT_WITH_MASK = 1,
    GC_EVAL = 2,
    GC_EVAL_FREEZE_MODEL = 3
}

export declare enum DistanceTransformLabelTypes {
    DIST_LABEL_CCOMP = 0,
    DIST_LABEL_PIXEL = 1
}

export declare enum FloodFillFlags {
    FLOODFILL_FIXED_RANGE = 65536,
    FLOODFILL_MASK_ONLY = 131072
}

export declare enum ConnectedComponentsTypes {
    CC_STAT_LEFT = 0,
    CC_STAT_TOP = 1,
    CC_STAT_WIDTH = 2,
    CC_STAT_HEIGHT = 3,
    CC_STAT_AREA = 4,
    CC_STAT_MAX = 5
}

export declare enum ConnectedComponentsAlgorithmsTypes {
    CCL_WU = 0,
    CCL_DEFAULT = -1,
    CCL_GRANA = 1
}

export declare enum RetrievalModes {
    RETR_EXTERNAL = 0,
    RETR_LIST = 1,
    RETR_CCOMP = 2,
    RETR_TREE = 3,
    RETR_FLOODFILL = 4
}

export declare enum ContourApproximationModes {
    CHAIN_APPROX_NONE = 1,
    CHAIN_APPROX_SIMPLE = 2,
    CHAIN_APPROX_TC89_L1 = 3,
    CHAIN_APPROX_TC89_KCOS = 4
}

export declare enum ShapeMatchModes {
    CONTOURS_MATCH_I1 = 1,
    CONTOURS_MATCH_I2 = 2,
    CONTOURS_MATCH_I3 = 3
}

export declare enum HoughModes {
    HOUGH_STANDARD = 0,
    HOUGH_PROBABILISTIC = 1,
    HOUGH_MULTI_SCALE = 2,
    HOUGH_GRADIENT = 3
}

export declare enum LineSegmentDetectorModes {
    LSD_REFINE_NONE = 0,
    LSD_REFINE_STD = 1,
    LSD_REFINE_ADV = 2
}

export declare enum HistCompMethods {
    HISTCMP_CORREL = 0,
    HISTCMP_CHISQR = 1,
    HISTCMP_INTERSECT = 2,
    HISTCMP_BHATTACHARYYA = 3,
    HISTCMP_HELLINGER = 3,
    HISTCMP_CHISQR_ALT = 4,
    HISTCMP_KL_DIV = 5
}

export declare enum ColorConversionCodes {
    COLOR_BGR2BGRA = 0,
    COLOR_RGB2RGBA = 0,
    COLOR_BGRA2BGR = 1,
    COLOR_RGBA2RGB = 1,
    COLOR_BGR2RGBA = 2,
    COLOR_RGB2BGRA = 2,
    COLOR_RGBA2BGR = 3,
    COLOR_BGRA2RGB = 3,
    COLOR_BGR2RGB = 4,
    COLOR_RGB2BGR = 4,
    COLOR_BGRA2RGBA = 5,
    COLOR_RGBA2BGRA = 5,
    COLOR_BGR2GRAY = 6,
    COLOR_RGB2GRAY = 7,
    COLOR_GRAY2BGR = 8,
    COLOR_GRAY2RGB = 8,
    COLOR_GRAY2BGRA = 9,
    COLOR_GRAY2RGBA = 9,
    COLOR_BGRA2GRAY = 10,
    COLOR_RGBA2GRAY = 11,
    COLOR_BGR2BGR565 = 12,
    COLOR_RGB2BGR565 = 13,
    COLOR_BGR5652BGR = 14,
    COLOR_BGR5652RGB = 15,
    COLOR_BGRA2BGR565 = 16,
    COLOR_RGBA2BGR565 = 17,
    COLOR_BGR5652BGRA = 18,
    COLOR_BGR5652RGBA = 19,
    COLOR_GRAY2BGR565 = 20,
    COLOR_BGR5652GRAY = 21,
    COLOR_BGR2BGR555 = 22,
    COLOR_RGB2BGR555 = 23,
    COLOR_BGR5552BGR = 24,
    COLOR_BGR5552RGB = 25,
    COLOR_BGRA2BGR555 = 26,
    COLOR_RGBA2BGR555 = 27,
    COLOR_BGR5552BGRA = 28,
    COLOR_BGR5552RGBA = 29,
    COLOR_GRAY2BGR555 = 30,
    COLOR_BGR5552GRAY = 31,
    COLOR_BGR2XYZ = 32,
    COLOR_RGB2XYZ = 33,
    COLOR_XYZ2BGR = 34,
    COLOR_XYZ2RGB = 35,
    COLOR_BGR2YCrCb = 36,
    COLOR_RGB2YCrCb = 37,
    COLOR_YCrCb2BGR = 38,
    COLOR_YCrCb2RGB = 39,
    COLOR_BGR2HSV = 40,
    COLOR_RGB2HSV = 41,
    COLOR_BGR2Lab = 44,
    COLOR_RGB2Lab = 45,
    COLOR_BGR2Luv = 50,
    COLOR_RGB2Luv = 51,
    COLOR_BGR2HLS = 52,
    COLOR_RGB2HLS = 53,
    COLOR_HSV2BGR = 54,
    COLOR_HSV2RGB = 55,
    COLOR_Lab2BGR = 56,
    COLOR_Lab2RGB = 57,
    COLOR_Luv2BGR = 58,
    COLOR_Luv2RGB = 59,
    COLOR_HLS2BGR = 60,
    COLOR_HLS2RGB = 61,
    COLOR_BGR2HSV_FULL = 66,
    COLOR_RGB2HSV_FULL = 67,
    COLOR_BGR2HLS_FULL = 68,
    COLOR_RGB2HLS_FULL = 69,
    COLOR_HSV2BGR_FULL = 70,
    COLOR_HSV2RGB_FULL = 71,
    COLOR_HLS2BGR_FULL = 72,
    COLOR_HLS2RGB_FULL = 73,
    COLOR_LBGR2Lab = 74,
    COLOR_LRGB2Lab = 75,
    COLOR_LBGR2Luv = 76,
    COLOR_LRGB2Luv = 77,
    COLOR_Lab2LBGR = 78,
    COLOR_Lab2LRGB = 79,
    COLOR_Luv2LBGR = 80,
    COLOR_Luv2LRGB = 81,
    COLOR_BGR2YUV = 82,
    COLOR_RGB2YUV = 83,
    COLOR_YUV2BGR = 84,
    COLOR_YUV2RGB = 85,
    COLOR_YUV2RGB_NV12 = 90,
    COLOR_YUV2BGR_NV12 = 91,
    COLOR_YUV2RGB_NV21 = 92,
    COLOR_YUV2BGR_NV21 = 93,
    COLOR_YUV420sp2RGB = 92,
    COLOR_YUV420sp2BGR = 93,
    COLOR_YUV2RGBA_NV12 = 94,
    COLOR_YUV2BGRA_NV12 = 95,
    COLOR_YUV2RGBA_NV21 = 96,
    COLOR_YUV2BGRA_NV21 = 97,
    COLOR_YUV420sp2RGBA = 96,
    COLOR_YUV420sp2BGRA = 97,
    COLOR_YUV2RGB_YV12 = 98,
    COLOR_YUV2BGR_YV12 = 99,
    COLOR_YUV2RGB_IYUV = 100,
    COLOR_YUV2BGR_IYUV = 101,
    COLOR_YUV2RGB_I420 = 100,
    COLOR_YUV2BGR_I420 = 101,
    COLOR_YUV420p2RGB = 98,
    COLOR_YUV420p2BGR = 99,
    COLOR_YUV2RGBA_YV12 = 102,
    COLOR_YUV2BGRA_YV12 = 103,
    COLOR_YUV2RGBA_IYUV = 104,
    COLOR_YUV2BGRA_IYUV = 105,
    COLOR_YUV2RGBA_I420 = 104,
    COLOR_YUV2BGRA_I420 = 105,
    COLOR_YUV420p2RGBA = 102,
    COLOR_YUV420p2BGRA = 103,
    COLOR_YUV2GRAY_420 = 106,
    COLOR_YUV2GRAY_NV21 = 106,
    COLOR_YUV2GRAY_NV12 = 106,
    COLOR_YUV2GRAY_YV12 = 106,
    COLOR_YUV2GRAY_IYUV = 106,
    COLOR_YUV2GRAY_I420 = 106,
    COLOR_YUV420sp2GRAY = 106,
    COLOR_YUV420p2GRAY = 106,
    COLOR_YUV2RGB_UYVY = 107,
    COLOR_YUV2BGR_UYVY = 108,
    COLOR_YUV2RGB_Y422 = 107,
    COLOR_YUV2BGR_Y422 = 108,
    COLOR_YUV2RGB_UYNV = 107,
    COLOR_YUV2BGR_UYNV = 108,
    COLOR_YUV2RGBA_UYVY = 111,
    COLOR_YUV2BGRA_UYVY = 112,
    COLOR_YUV2RGBA_Y422 = 111,
    COLOR_YUV2BGRA_Y422 = 112,
    COLOR_YUV2RGBA_UYNV = 111,
    COLOR_YUV2BGRA_UYNV = 112,
    COLOR_YUV2RGB_YUY2 = 115,
    COLOR_YUV2BGR_YUY2 = 116,
    COLOR_YUV2RGB_YVYU = 117,
    COLOR_YUV2BGR_YVYU = 118,
    COLOR_YUV2RGB_YUYV = 115,
    COLOR_YUV2BGR_YUYV = 116,
    COLOR_YUV2RGB_YUNV = 115,
    COLOR_YUV2BGR_YUNV = 116,
    COLOR_YUV2RGBA_YUY2 = 119,
    COLOR_YUV2BGRA_YUY2 = 120,
    COLOR_YUV2RGBA_YVYU = 121,
    COLOR_YUV2BGRA_YVYU = 122,
    COLOR_YUV2RGBA_YUYV = 119,
    COLOR_YUV2BGRA_YUYV = 120,
    COLOR_YUV2RGBA_YUNV = 119,
    COLOR_YUV2BGRA_YUNV = 120,
    COLOR_YUV2GRAY_UYVY = 123,
    COLOR_YUV2GRAY_YUY2 = 124,
    COLOR_YUV2GRAY_Y422 = 123,
    COLOR_YUV2GRAY_UYNV = 123,
    COLOR_YUV2GRAY_YVYU = 124,
    COLOR_YUV2GRAY_YUYV = 124,
    COLOR_YUV2GRAY_YUNV = 124,
    COLOR_RGBA2mRGBA = 125,
    COLOR_mRGBA2RGBA = 126,
    COLOR_RGB2YUV_I420 = 127,
    COLOR_BGR2YUV_I420 = 128,
    COLOR_RGB2YUV_IYUV = 127,
    COLOR_BGR2YUV_IYUV = 128,
    COLOR_RGBA2YUV_I420 = 129,
    COLOR_BGRA2YUV_I420 = 130,
    COLOR_RGBA2YUV_IYUV = 129,
    COLOR_BGRA2YUV_IYUV = 130,
    COLOR_RGB2YUV_YV12 = 131,
    COLOR_BGR2YUV_YV12 = 132,
    COLOR_RGBA2YUV_YV12 = 133,
    COLOR_BGRA2YUV_YV12 = 134,
    COLOR_BayerBG2BGR = 46,
    COLOR_BayerGB2BGR = 47,
    COLOR_BayerRG2BGR = 48,
    COLOR_BayerGR2BGR = 49,
    COLOR_BayerBG2RGB = 48,
    COLOR_BayerGB2RGB = 49,
    COLOR_BayerRG2RGB = 46,
    COLOR_BayerGR2RGB = 47,
    COLOR_BayerBG2GRAY = 86,
    COLOR_BayerGB2GRAY = 87,
    COLOR_BayerRG2GRAY = 88,
    COLOR_BayerGR2GRAY = 89,
    COLOR_BayerBG2BGR_VNG = 62,
    COLOR_BayerGB2BGR_VNG = 63,
    COLOR_BayerRG2BGR_VNG = 64,
    COLOR_BayerGR2BGR_VNG = 65,
    COLOR_BayerBG2RGB_VNG = 64,
    COLOR_BayerGB2RGB_VNG = 65,
    COLOR_BayerRG2RGB_VNG = 62,
    COLOR_BayerGR2RGB_VNG = 63,
    COLOR_BayerBG2BGR_EA = 135,
    COLOR_BayerGB2BGR_EA = 136,
    COLOR_BayerRG2BGR_EA = 137,
    COLOR_BayerGR2BGR_EA = 138,
    COLOR_BayerBG2RGB_EA = 137,
    COLOR_BayerGB2RGB_EA = 138,
    COLOR_BayerRG2RGB_EA = 135,
    COLOR_BayerGR2RGB_EA = 136,
    COLOR_BayerBG2BGRA = 139,
    COLOR_BayerGB2BGRA = 140,
    COLOR_BayerRG2BGRA = 141,
    COLOR_BayerGR2BGRA = 142,
    COLOR_BayerBG2RGBA = 141,
    COLOR_BayerGB2RGBA = 142,
    COLOR_BayerRG2RGBA = 139,
    COLOR_BayerGR2RGBA = 140,
    COLOR_COLORCVT_MAX = 143
}

export declare enum RectanglesIntersectTypes {
    INTERSECT_NONE = 0,
    INTERSECT_PARTIAL = 1,
    INTERSECT_FULL = 2
}

export declare enum LineTypes {
    FILLED = -1,
    LINE_4 = 4,
    LINE_8 = 8,
    LINE_AA = 16
}

export declare enum HersheyFonts {
    FONT_HERSHEY_SIMPLEX = 0,
    FONT_HERSHEY_PLAIN = 1,
    FONT_HERSHEY_DUPLEX = 2,
    FONT_HERSHEY_COMPLEX = 3,
    FONT_HERSHEY_TRIPLEX = 4,
    FONT_HERSHEY_COMPLEX_SMALL = 5,
    FONT_HERSHEY_SCRIPT_SIMPLEX = 6,
    FONT_HERSHEY_SCRIPT_COMPLEX = 7,
    FONT_ITALIC = 16
}

export declare enum MarkerTypes {
    MARKER_CROSS = 0,
    MARKER_TILTED_CROSS = 1,
    MARKER_STAR = 2,
    MARKER_DIAMOND = 3,
    MARKER_SQUARE = 4,
    MARKER_TRIANGLE_UP = 5,
    MARKER_TRIANGLE_DOWN = 6
}

export declare enum BorderTypes {
    BORDER_CONSTANT = 0,
    BORDER_REPLICATE = 1,
    BORDER_REFLECT = 2,
    BORDER_WRAP = 3,
    BORDER_REFLECT_101 = 4,
    BORDER_TRANSPARENT = 5,
    BORDER_REFLECT101 = 4,
    BORDER_DEFAULT = 4,
    BORDER_ISOLATED = 16
}
