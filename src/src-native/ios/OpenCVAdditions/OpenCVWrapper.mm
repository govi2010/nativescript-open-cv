#import <opencv2/opencv.hpp>
#ifdef __cplusplus
#import <opencv2/opencv.hpp>
#endif

#ifdef __OBJC__
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#endif

#import "OpenCVWrapper.h"
#import <UIKit/UIKit.h>

@implementation ContoursVector
{
std::vector<std::vector<cv::Point>> _vector;
}
-(std::vector<std::vector<cv::Point>>*)vector {
    return &_vector;
}

//-(void)dealloc {
////  delete _vector;
//  _vector = NULL;
//  //  delete _mat;
//}

-(int)size {
return (int)_vector.size();
}
-(NSDictionary*)get:(int)i :(int)j {
    cv::Point point = _vector.at(i).at(j);
    return @{@"x":@(point.x) , @"y":@(point.y)};
}

-(NSArray*)getCountour:(int)i {
    std::vector<cv::Point> points = _vector[i];
    NSMutableArray *array = [[NSMutableArray alloc] initWithCapacity:points.size()];
    
    for( unsigned int i = 0; i < points.size(); i++){
        cv::Point point = points[i];
        [array addObject:@{@"x":@(point.x) , @"y":@(point.y)}];
    }
    return [[NSArray alloc] initWithArray:array];
}

-(double)contourArea:(int)index :(BOOL)oriented {
    return cv::contourArea(_vector.at(index), oriented);
}

-(NSDictionary*)boundingRect:(int)index  {
    cv::Rect c= cv::boundingRect(_vector.at(index));
    return @{@"x":@(c.x) , @"y":@(c.y),@"height":@(c.height),@"width":@(c.width)};
}

-(OpenCVMat*)GetMat:(int)index :(OpenCVMat*)mat2 {
    cv::Mat(*mat2.mat, cv::boundingRect(_vector.at(index)));
    cv::Mat matcv  =cv::Mat(*mat2.mat, cv::boundingRect(_vector.at(index)));
    OpenCVMat* mat = [[OpenCVMat alloc] initWithMat:matcv];
    return mat;
}


@end


@implementation OpenCVWrapper : NSObject

+(void)extractChannel: (OpenCVMat*)mat1 :(OpenCVMat*)mat2 {
    cv::extractChannel(*mat1.mat, *mat2.mat, 3);
}

+(void)cvtColor: (OpenCVMat*)mat1 :(OpenCVMat*)mat2 :(int)colorType :(int)dstChannels {
  cv::cvtColor(*mat1.mat, *mat2.mat, colorType,dstChannels);
}

+(void)GaussianBlur: (OpenCVMat*)mat1 :(OpenCVMat*)mat2 :(int)x :(int)y :(int)sigmaX {
  cv::GaussianBlur(*mat1.mat, *mat2.mat, cv::Size(x, y), sigmaX);
}

+(void)adaptiveThreshold: (OpenCVMat*)mat1 :(OpenCVMat*)mat2 :(int)maxValue :(int)adaptiveMethod :(int)thresholdType :(int)blockSize :(int)C {
    cv::adaptiveThreshold(*mat1.mat, *mat2.mat, maxValue, adaptiveMethod,thresholdType,blockSize,C);
}

+(void)bitwise_not: (OpenCVMat*)mat1 :(OpenCVMat*)mat2 {
  cv::bitwise_not(*mat1.mat, *mat2.mat);
}

+(void)resize: (OpenCVMat*)mat1 :(OpenCVMat*)mat2 :(int)x :(int)y {
  cv::resize(*mat1.mat, *mat2.mat, cv::Size(x, y));
}

+(void)Canny: (OpenCVMat*)mat1 :(OpenCVMat*)mat2 :(double)threshold1 :(double)threshold2 :(int)apertureSize :(BOOL)L2gradient {
  cv::Canny(*mat1.mat, *mat2.mat, threshold1, threshold2, apertureSize, L2gradient);
}
+(double)contourArea:(NSArray*)contour :(BOOL)oriented {
  __block std::vector<cv::Point> vector;
  [contour enumerateObjectsUsingBlock:^(NSDictionary*  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    vector.push_back(cv::Point([[obj valueForKey:@"x"] intValue], [[obj valueForKey:@"y"] intValue]));
  }];
  return cv::contourArea(vector);
}

+(NSDictionary*)boundingRect:(NSArray*)contour{
    
    __block std::vector<cv::Point> vector;
    [contour enumerateObjectsUsingBlock:^(NSDictionary*  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        NSLog(@"x %d", [[obj valueForKey:@"x"] intValue]);
        NSLog(@"y %d", [[obj valueForKey:@"y"] intValue]);
        vector.push_back(cv::Point([[obj valueForKey:@"x"] intValue], [[obj valueForKey:@"y"] intValue]));
    
    }];
    
    cv::Rect c =  cv::boundingRect(vector);
    return @{@"x":@(c.x) , @"y":@(c.y),@"height":@(c.height),@"width":@(c.width)};
}

+(ContoursVector*)findContours: (OpenCVMat*)mat1 :(OpenCVMat*)hierarchy :(int)mode :(int)method :(CGPoint)offset {
//    mat1.mat(cv::Range(3,4),cv::Range(3,4))
//    mat1.mat()(cv::Range(0, 10), cv::Range::all());
    CFTimeInterval startTime = CACurrentMediaTime();
    ContoursVector* result = [[ContoursVector alloc] init];
    std::vector<std::vector<cv::Point>>* vector = result.vector;
    cv::findContours(*mat1.mat, *vector, *hierarchy.mat, mode, method, cv::Point(offset.x, offset.y));
    NSLog(@"findContours duration %f", CACurrentMediaTime() - startTime);
    
    return result;
}


+ (cv::Mat*)cvMatFromUIImage:(UIImage *)image
{
  NSLog(@"cvMatFromUIImage");
    CGColorSpaceRef colorSpace = CGImageGetColorSpace(image.CGImage);
    CGFloat cols = image.size.width;
    CGFloat rows = image.size.height;
    NSLog(@"cols %f", cols);
    NSLog(@"rows %f", rows);

    cv::Mat* cvMat = new cv::Mat(rows, cols, CV_8UC4); // 8 bits per component, 4 channels (color channels + alpha)
    
    CGContextRef contextRef = CGBitmapContextCreate(cvMat->data,                 // Pointer to  data
                                                    cols,                       // Width of bitmap
                                                    rows,                       // Height of bitmap
                                                    8,                          // Bits per component
                                                    cvMat->step[0],              // Bytes per row
                                                    colorSpace,                 // Colorspace
                                                    kCGImageAlphaNoneSkipLast |
                                                    kCGBitmapByteOrderDefault); // Bitmap info flags
    
    CGContextDrawImage(contextRef, CGRectMake(0, 0, cols, rows), image.CGImage);
    CGContextRelease(contextRef);
    
    return cvMat;
}
+ (cv::Mat*)cvMatGrayFromUIImage:(UIImage *)image
{
    CGColorSpaceRef colorSpace = CGImageGetColorSpace(image.CGImage);
    CGFloat cols = image.size.width;
    CGFloat rows = image.size.height;
    cv::Mat* cvMat = new cv::Mat(rows, cols, CV_8UC1); // 8 bits per component, 1 channels
    
    CGContextRef contextRef = CGBitmapContextCreate(cvMat->data,                 // Pointer to data
                                                    cols,                       // Width of bitmap
                                                    rows,                       // Height of bitmap
                                                    8,                          // Bits per component
                                                    cvMat->step[0],              // Bytes per row
                                                    colorSpace,                 // Colorspace
                                                    kCGImageAlphaNoneSkipLast |
                                                    kCGBitmapByteOrderDefault); // Bitmap info flags
    
    CGContextDrawImage(contextRef, CGRectMake(0, 0, cols, rows), image.CGImage);
    CGContextRelease(contextRef);
    
    return cvMat;
}


+ (UIImage *)UIImageFromCVMat:(cv::Mat)cvMat
{
     NSLog(@"initWithImage2 %d %d", cvMat.cols, cvMat.rows);
    NSData *data = [NSData dataWithBytes:cvMat.data length:cvMat.elemSize()*cvMat.total()];
    CGColorSpaceRef colorSpace;
    
    if (cvMat.elemSize() == 1) {
        colorSpace = CGColorSpaceCreateDeviceGray();
    } else {
        colorSpace = CGColorSpaceCreateDeviceRGB();
    }
    
    CGDataProviderRef provider = CGDataProviderCreateWithCFData((__bridge CFDataRef)data);
  // Preserve alpha transparency, if exists
    bool alpha = cvMat.channels() == 4;
    CGBitmapInfo bitmapInfo = (alpha ? kCGImageAlphaLast : kCGImageAlphaNone) | kCGBitmapByteOrderDefault;
   
    // Creating CGImage from cv::Mat
    CGImageRef imageRef = CGImageCreate(cvMat.cols,                                 //width
                                        cvMat.rows,                                 //height
                                        8,                                          //bits per component
                                        8 * cvMat.elemSize(),                       //bits per pixel
                                        cvMat.step[0],                            //bytesPerRow
                                        colorSpace,                                 //colorspace
                                        bitmapInfo,// bitmap info
                                        provider,                                   //CGDataProviderRef
                                        NULL,                                       //decode
                                        false,                                      //should interpolate
                                        kCGRenderingIntentDefault                   //intent
                                        );
    
    
    // Getting UIImage from CGImage
    UIImage *finalImage = [UIImage imageWithCGImage:imageRef];
    CGImageRelease(imageRef);
    CGDataProviderRelease(provider);
    CGColorSpaceRelease(colorSpace);
    
    return finalImage;
}

+(void)drawContours:(OpenCVMat*)mat :(NSArray*)contours :(int)contourIdx :(UIColor*)color :(int)thickness :(int)lineType :(OpenCVMat*) hierarchy :(int) maxLevel :(NSDictionary*) offset {
  std::vector<std::vector<cv::Point>> vectors;
  for (NSArray* obj in contours) {
    std::vector<cv::Point> vector;
    for (NSDictionary* obj2 in obj) {
      vector.push_back(cv::Point([[obj2 valueForKey:@"x"] intValue], [[obj2 valueForKey:@"y"] intValue]));
    }
    vectors.push_back(vector);
  }
//  [contours enumerateObjectsUsingBlock:^(NSArray*  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
//    __block std::vector<cv::Point> vector;
//    [obj enumerateObjectsUsingBlock:^(NSValue*  _Nonnull obj2, NSUInteger idx, BOOL * _Nonnull stop) {
//      vector.push_back(cv::Point([[obj2 valueForKey:@"x"] floatValue], [[obj2 valueForKey:@"y"] floatValue]));
//    }];
//    vectors.push_back(vector);
//  }];
  const CGFloat* components = CGColorGetComponents(color.CGColor);
  cv::Scalar cvColor(components[0]*255, components[1]*255, components[2]*255, components[3]*255);
  cv::Point cvOffset([[offset valueForKey:@"x"] floatValue], [[offset valueForKey:@"y"] floatValue]);
  cv::drawContours(*mat.mat, vectors, contourIdx, cvColor, thickness, lineType, hierarchy? *hierarchy.mat : cv::noArray(), maxLevel, cvOffset);
}
@end
