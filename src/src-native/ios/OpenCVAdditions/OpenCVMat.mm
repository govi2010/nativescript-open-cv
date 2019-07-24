#ifdef __cplusplus
#import <opencv2/opencv.hpp>
#import <opencv2/imgcodecs/ios.h>
#endif

#ifdef __OBJC__
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#endif

#import "OpenCVMat.h"
#import "OpenCVWrapper.h"

@implementation OpenCVMat
{
  cv::Mat _mat;
  BOOL owned;
}
-(id)init {
  self = [super init];
  _mat = cv::Mat();
  owned = true;
  return self;
}

-(void)setMat:(cv::Mat*)newVal {
  @synchronized(self) {
    if (owned) {
      _mat.release();
//      delete _mat;  // it's OK to delete a NULL pointer
    }
      if(newVal){
          _mat = (*newVal);
      }else {
          _mat= NULL;
      }
  }
}

-(cv::Mat*)mat {
  return &_mat;
}

-(void)dealloc {
  [self setMat:NULL];
//  delete _mat;
}

- (id)initWithMat:(cv::Mat&)mat
{
  // NSLog(@"initWithMat");
  self = [super init];
  
  if (self) {
    [self setMat:&mat];
    owned = false;
  }
  
  return self;
}
- (id)initWithOwnedMat:(cv::Mat&)mat
{
  // NSLog(@"initWithMat");
  self = [super init];
  
  if (self) {
    [self setMat:&mat];
    owned = true;
  }
  
  return self;
}
- (id)initWithRows:(int)rows cols:(int) cols type:(int) type
{
  // NSLog(@"initWithRows %d %d %d", rows, cols, type);                             
  self = [super init];
  
  if (self) {
    _mat = cv::Mat(rows, cols, type);
    owned = true;
  }
  
  return self;
}

- (id)initWithOpenCVMat:(OpenCVMat*)mat
{
   NSLog(@"initWithOpenCVMat");
  self = [super init];
  
  if (self) {
    [self setMat:mat.mat];
    owned = false;
  }
  
  return self;
}
- (id)initWithImage:(UIImage*)image
{
   NSLog(@"initWithImage");
  self = [super init];
  
  
  if (self) {
    cv::Mat mat = cv::Mat();
    CGImageAlphaInfo ainfo = CGImageGetAlphaInfo( image.CGImage );
    UIImageToMat( image, mat, ainfo != kCGImageAlphaNone );
     NSLog(@"initWithImage2 %d %d", mat.cols, mat.rows);
    [self setMat:&mat];
    owned = true;
  }
  
  return self;
}

-(void)releaseMat {
    if (_mat.empty()) {
    _mat.release();
    _mat = NULL;
//    [self setMat:NULL];
//    return _mat->release();
  }
}

-(int)channels {
  if (_mat.empty()) {
    return _mat.channels();
  }
  return -1;
}

-(void)setTo:(UIColor*)color
{
  if (_mat.empty()) {
    const CGFloat* components = CGColorGetComponents(color.CGColor);
    cv::Scalar cvColor(components[0]*255, components[1]*255, components[2]*255, components[3]*255);
    _mat.setTo(cvColor);
  }
}

-(CGSize)size {
  if (_mat.empty()) {
    // NSLog(@"size %d %d", _mat->cols, _mat->rows);
    return CGSizeMake(_mat.cols, _mat.rows);
  }
  return CGSizeZero;
}

-(UIImage*)toImage  {
   if (_mat.empty()) {
//    if (_mat->channels() == 4) {
//    return MatToUIImage(*_mat);
//    }
    return [OpenCVWrapper UIImageFromCVMat:_mat];
  }
  return nil;
}
-(NSArray*)toAll28X28Image{
    cv::Mat matInput;
    (_mat).copyTo(matInput);
    NSLog(@"start : extractChannel");
    cv::cvtColor(matInput,matInput,cv::COLOR_BGR2GRAY);
    NSLog(@"end : extractChannel");
    NSLog(@"start : cvtColor");
    cv::cvtColor(matInput,matInput,cv::COLOR_RGB2BGR);
    NSLog(@"end : cvtColor");
    
    NSLog(@"start : bitwise_not");
    cv::bitwise_not(matInput, matInput);
    NSLog(@"end : bitwise_not");
    
    NSLog(@"start : orig_image");
    cv::Mat orig_image;
    matInput.copyTo(orig_image);
    NSLog(@"end : orig_image");
    
    NSLog(@"start : cvtColor2");
    cv::cvtColor(matInput,matInput,cv::COLOR_BGR2GRAY);
    NSLog(@"end : cvtColor2");
    
    NSLog(@"start : GaussianBlur");
    cv::GaussianBlur(matInput, matInput, cv::Size(5, 5), cv::BORDER_DEFAULT);
    NSLog(@"end : GaussianBlur");
    
    NSLog(@"start : adaptiveThreshold");
    //        cv::adaptiveThreshold(matInput, matInput, 125, cv::ADAPTIVE_THRESH_MEAN_C,cv::THRESH_BINARY_INV,11,12);
    cv::threshold(matInput, matInput, 0,255, cv::THRESH_OTSU);
    NSLog(@"end : adaptiveThreshold");
    
    cv::Mat rect_kernel =  cv::getStructuringElement(cv::MORPH_RECT, cv::Size(1, 20));
    cv::dilate(matInput,matInput, rect_kernel);
    NSLog(@"start : hierarchy");
    NSLog(@"end : hierarchy");
    NSLog(@"start : crete contours");
    std::vector<std::vector<cv::Point>> contours;
    NSMutableArray *d = [[NSMutableArray alloc] init];
    std::vector<cv::Vec4i> hierarchy;
    
    cv::findContours(matInput, contours, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_NONE, cv::Point(0, 0));
    NSLog(@"end : find contours");
    std::vector<Point> approx;
    for (size_t i = 0; i < contours.size(); i++)
    {
        std::vector<cv::Point> contour=contours.at(i);
        cv::Rect roi= cv::boundingRect(contour);
        int area= cv::contourArea(contour);
        [d addObject:@{@"x":@(roi.x),@"y": @(roi.y) , @"width": @(roi.width) , @"height" :@(roi.height) , @"area":@(area), @"i":@(i) }];
    }
//    cv::Mat img =(cv::Mat_<uchar>(3, 4) << 0 , 1 , 2 , 3 , 10 , 11 , 12 , 13 , 20 , 21 , 22 , 23);
//    cv::Mat a=cv::Mat(3, 4, CV_8UC1, cv::Scalar(0));
//    cv::Mat b=cv::Mat(3, 4, CV_8UC1, cv::Scalar(0));
//
//    img.copyTo(a);
//    std::cout << "a = " << a << std::endl;
//    img(cv::Range(0,2),cv::Range(1,3)).copyTo(b(cv::Range(0, 2), cv::Range(1, 3)));
//    std::cout << "b = " << b << std::endl;
    
    NSSortDescriptor * descriptor = [[NSSortDescriptor alloc] initWithKey:@"x" ascending:NO];
    NSArray *sortedArray = [d sortedArrayUsingDescriptors:@[descriptor]];
    NSMutableArray *images = [[NSMutableArray alloc] init];
    for (NSDictionary * roiFinal in sortedArray) {

        int contourIndex =[[roiFinal valueForKey:@"i"] intValue];
        std::vector<cv::Point> contour=contours.at(contourIndex);
        cv::Rect roiF= cv::boundingRect(contour);
        cv::Mat mask = cv::Mat::zeros(orig_image.size(),CV_8UC1);
        cv::drawContours(mask, contours,contourIndex, cv::Scalar::all(255), cv::FILLED );
        cv::Mat op;
//        cv::Mat masked  = cv::Mat(orig_image.size().height , orig_image.size().width,orig_image.type());
//        masked.setTo(cv::Scalar(0,0));
//        [images addObject:[OpenCVWrapper UIImageFromCVMat:mask]];
        orig_image.copyTo(op, mask);
//        cv::Mat croppedImage;
       
//        [images addObject:[OpenCVWrapper UIImageFromCVMat:op]];
//        op.copyTo(croppedImage);
        cv::Mat croppedImage;
        cv::Mat(op, roiF).copyTo(croppedImage);
        
        int size = roiF.height > roiF.width ? roiF.height : roiF.width;
        
        cv::Mat  resizeImage = cv::Mat(size + 34,size + 34, croppedImage.type());
        int offset_height = ((size) / 2 - (roiF.height) / 2);
        int offset_width = ((size) / 2 - (roiF.width) / 2);

        if (size == roiF.height) {

            int x = (size + 34 - roiF.width)/2;
            croppedImage(cv::Range(0,croppedImage.rows -1),cv::Range(0,croppedImage.cols -1))
            .copyTo(resizeImage(cv::Range(17,17 + croppedImage.rows -1 ),cv::Range(x , x + croppedImage.cols -1)  ));
            
           

        } else if (size == roiF.width) {
            
           
            int  y  = (size + 34 - roiF.height)/2;
            croppedImage(cv::Range(0,croppedImage.rows -1),cv::Range(0,croppedImage.cols -1)  )
            .copyTo(resizeImage(cv::Range(y,y+croppedImage.rows - 1),cv::Range(17 ,17 +  croppedImage.cols-1 )  ));
//
           
            
        }
        cv::Mat  size28_28  = cv::Mat::zeros(cv::Size(28,28),resizeImage.type());
        cv::resize(resizeImage, size28_28, cv::Size(28,28),0,0);
         [images addObject:[OpenCVWrapper UIImageFromCVMat:size28_28]];

    }
    
   
    
    return images;
}

-(UIImage*)to28X28Image{

        cv::Mat matInput;
        (_mat).copyTo(matInput);
        NSLog(@"start : extractChannel");
        cv::cvtColor(matInput,matInput,cv::COLOR_BGR2GRAY);
         NSLog(@"end : extractChannel");
         NSLog(@"start : cvtColor");
        cv::cvtColor(matInput,matInput,cv::COLOR_RGB2BGR);
        NSLog(@"end : cvtColor");

         NSLog(@"start : bitwise_not");
        cv::bitwise_not(matInput, matInput);
        NSLog(@"end : bitwise_not");

         NSLog(@"start : orig_image");
        cv::Mat orig_image;
        matInput.copyTo(orig_image);
        NSLog(@"end : orig_image");

         NSLog(@"start : cvtColor2");
        cv::cvtColor(matInput,matInput,cv::COLOR_BGR2GRAY);
        NSLog(@"end : cvtColor2");

         NSLog(@"start : GaussianBlur");
        cv::GaussianBlur(matInput, matInput, cv::Size(5, 5), cv::BORDER_DEFAULT);
        NSLog(@"end : GaussianBlur");

         NSLog(@"start : adaptiveThreshold");
//        cv::adaptiveThreshold(matInput, matInput, 125, cv::ADAPTIVE_THRESH_MEAN_C,cv::THRESH_BINARY_INV,11,12);
        cv::threshold(matInput, matInput, 0,255, cv::THRESH_OTSU);
        NSLog(@"end : adaptiveThreshold");
    
        cv::Mat rect_kernel =  cv::getStructuringElement(cv::MORPH_RECT, cv::Size(1, 50));
        cv::dilate(matInput,matInput, rect_kernel);
        NSLog(@"start : hierarchy");
        NSLog(@"end : hierarchy");
        NSLog(@"start : crete contours");
        std::vector<std::vector<cv::Point>> contours;
        NSMutableArray *d = [[NSMutableArray alloc] init];
        std::vector<cv::Vec4i> hierarchy;
        cv::findContours(matInput, contours, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_SIMPLE, cv::Point(0, 0));
        NSLog(@"end : find contours");
        std::vector<Point> approx;
        for (size_t i = 0; i < contours.size(); i++)
        {
            std::vector<cv::Point> contour=contours.at(i);
            cv::Rect roi= cv::boundingRect(contour);
            int area= cv::contourArea(contour);
            [d addObject:@{@"x":@(roi.x),@"y": @(roi.y) , @"width": @(roi.width) , @"height" :@(roi.height) , @"area":@(area) }];
        }
        NSSortDescriptor * descriptor = [[NSSortDescriptor alloc] initWithKey:@"area" ascending:NO];
        NSArray *sortedArray = [d sortedArrayUsingDescriptors:@[descriptor]];
        NSDictionary *roiFinal = [sortedArray objectAtIndex:0];
        cv::Rect roiF= cv::Rect([[roiFinal valueForKey:@"x"] intValue] ,[[roiFinal valueForKey:@"y"] intValue],[[roiFinal valueForKey:@"width"] intValue], [[roiFinal valueForKey:@"height"] intValue]);
        cv::Mat croppedImage;
        cv::Mat(orig_image, roiF).copyTo(croppedImage);
        int size = roiF.height > roiF.width ? roiF.height : roiF.width;

        int offset_height = ((size) / 2 - (roiF.height) / 2);
        int offset_width = ((size ) / 2 - (roiF.width) / 2);
            cv::Mat  size28_28;
            if (offset_height > 0) {
                double scale = float(26)/(roiF.width);
                cv::resize(croppedImage, size28_28, cv::Size(0,0),scale,scale);
            }else {
                double scale = float(26)/(roiF.height);
                cv::resize(croppedImage, size28_28, cv::Size(0,0),scale,scale);
            }

    return [OpenCVWrapper UIImageFromCVMat:size28_28];
    
    

}
- (NSComparisonResult)compare:(NSDictionary *)otherObject {
    return [[self valueForKey:@"area"] compare:[otherObject valueForKey:@"area"]];
}
-(OpenCVMat*)clone {
  OpenCVMat* newMat = [[OpenCVMat alloc] initWithRows:_mat.rows cols:_mat.cols type:_mat.type()];
  _mat.copyTo(*newMat.mat);
  return newMat;
}

- (id)copyWithZone:(NSZone *)zone {
  return [[[self class] alloc] initWithOpenCVMat:self];
}
@end

