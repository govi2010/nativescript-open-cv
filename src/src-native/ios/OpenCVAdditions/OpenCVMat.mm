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

-(UIImage*)changeColor:(int)x y:(int)y height:(int)height width:(int)width result:(bool)result{
    cv::Mat matInput;
    (_mat).copyTo(matInput);
    cv::Rect outerRect = cv::Rect(x, y, width, height);
    

    cv::Mat mask1 = cv::Mat::zeros(matInput.size(),CV_8UC1);
    cv::Mat croppedImage;
    cv::Mat(matInput, outerRect).copyTo(croppedImage);
    cv::cvtColor(croppedImage,croppedImage,cv::COLOR_BGR2GRAY);
    cv::bitwise_not(croppedImage, croppedImage);
    cv::Scalar color;
    if(result){
        color = cv::Scalar(0,255,0,255);
    }else {
        color = cv::Scalar(255,0,0,255);
    }
   
    cv::threshold(croppedImage, croppedImage, 0,255, cv::THRESH_BINARY);
   
    croppedImage(cv::Range(0, croppedImage.size().height-1), cv::Range(0, croppedImage.size().width-1))
    .copyTo(mask1(cv::Range(y, y+ croppedImage.size().height-1), cv::Range(x, x + croppedImage.size().width-1)));
    matInput.setTo(color,mask1);
    NSLog(@"heightMedian %d  widthMedian: %d ", matInput.size().height, matInput.size().width);
    return [OpenCVWrapper UIImageFromCVMat:matInput];
}
-(NSArray*)toAll28X28Image{
    cv::Mat matInput;
    (_mat).copyTo(matInput);
    cv::cvtColor(matInput,matInput,cv::COLOR_BGR2GRAY);
    cv::cvtColor(matInput,matInput,cv::COLOR_RGB2BGR);
    cv::bitwise_not(matInput, matInput);
    cv::Mat orig_image;
    matInput.copyTo(orig_image);
    
    
    cv::cvtColor(matInput,matInput,cv::COLOR_BGR2GRAY);
    cv::GaussianBlur(matInput, matInput, cv::Size(5, 5), cv::BORDER_DEFAULT);
    cv::threshold(matInput, matInput, 0,255, cv::THRESH_OTSU);
    std::vector<std::vector<cv::Point>> contours;

    cv::findContours(matInput, contours, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_NONE, cv::Point(0, 0));
    std::vector<Point> approx;
    std::vector<int> widthArray;
    std::vector<int> heightArray;
    for (size_t i = 0; i < contours.size(); i++)
    {
        std::vector<cv::Point> contour=contours.at(i);
        cv::Rect roi= cv::boundingRect(contour);
        widthArray.push_back(roi.width);
        heightArray.push_back(roi.height);
    }
    
    std::sort(widthArray.begin(), widthArray.end());
    int lowwidthMiddle = floor((widthArray.size() - 1) / 2);
    int highwidthMiddle = ceil((widthArray.size() - 1) / 2);
    int widthMedian = (widthArray[lowwidthMiddle] + widthArray[highwidthMiddle]) / 2;

    std::sort(heightArray.begin(), heightArray.end());
  
    int lowheightMiddle = floor((heightArray.size() - 1) / 2);
    int highheightMiddle = ceil((heightArray.size() - 1) / 2);
    int heightMedian = (heightArray[lowheightMiddle] + heightArray[highheightMiddle]) / 2;
    
    NSMutableArray *images = [[NSMutableArray alloc] init];
    cv::Mat rect_kernel =  cv::getStructuringElement(cv::MORPH_CROSS, cv::Size(1, (heightMedian* 2)/3));
    cv::dilate(matInput,matInput, rect_kernel);
    NSLog(@"heightMedian %d  widthMedian: %d ", heightMedian, widthMedian);
    std::vector<std::vector<cv::Point>> contoursF;
    NSMutableArray *d = [[NSMutableArray alloc] init];
    cv::findContours(matInput, contoursF, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_SIMPLE, cv::Point(0, 0));
    
    for (size_t i = 0; i < contoursF.size(); i++)
    {
        std::vector<cv::Point> contour=contoursF.at(i);
        cv::Rect roi= cv::boundingRect(contour);
        int area= cv::contourArea(contour);
        [d addObject:@{@"x":@(roi.x),@"y": @(roi.y) , @"width": @(roi.width) , @"height" :@(roi.height) , @"area":@(area), @"i":@(i)}];
    }
    NSSortDescriptor * descriptor = [[NSSortDescriptor alloc] initWithKey:@"x" ascending:YES];
    NSArray *sortedArray = [d sortedArrayUsingDescriptors:@[descriptor]];
    
    for (NSDictionary * roiFinal in sortedArray) {
        int contourIndex =[[roiFinal valueForKey:@"i"] intValue];
        cv::Mat mask = cv::Mat::zeros(orig_image.size(),CV_8UC1);
        cv::drawContours(mask, contoursF,contourIndex, cv::Scalar::all(255), cv::FILLED );
        cv::Mat op;
        orig_image.copyTo(op, mask);
        
        cv::cvtColor(op,op,cv::COLOR_BGR2GRAY);
        cv::GaussianBlur(op, op, cv::Size(5, 5), cv::BORDER_DEFAULT);
        cv::threshold(op, op, 0,255, cv::THRESH_OTSU);

        std::vector<std::vector<cv::Point>> contoursH;
        cv::findContours(op, contoursH, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_SIMPLE, cv::Point(0, 0));
        mask.release();
        op.release();
        
        cv::Mat mask1 = cv::Mat::zeros(orig_image.size(),CV_8UC1);
        cv::drawContours(mask1, contoursH,-1, cv::Scalar::all(255), cv::FILLED );
        cv::Mat op1;
        orig_image.copyTo(op1, mask1);
        
        mask1.release();
        op1.release();
        
        std::vector<cv::Rect> rectArray;
        for (size_t i = 0; i < contoursH.size(); i++)
        {
            std::vector<cv::Point> contour=contoursH.at(i);
            cv::Rect roi= cv::boundingRect(contour);
            rectArray.push_back(roi);
        }
        cv::Rect outerRect;
        for (size_t i = 0; i < rectArray.size(); i++)
        {
            if(i==0){
                outerRect=rectArray.at(i);
            }else {
                cv::Rect currentRect =rectArray.at(i);
                int x = std::min(outerRect.x, currentRect.x);
                int y = std::min(outerRect.y, currentRect.y);
                int w = std::max(outerRect.x + outerRect.width, currentRect.x + currentRect.width) - x;
                int h = std::max(outerRect.y + outerRect.height, currentRect.y + currentRect.height) - y;
                outerRect  = cv::Rect(x, y, w, h);
            }
        }
        cv::Mat croppedImage;
        cv::Mat(orig_image, outerRect).copyTo(croppedImage);
       
        int size = outerRect.height > outerRect.width ? outerRect.height : outerRect.width;
        cv::Mat  resizeImage = cv::Mat(size,size, croppedImage.type(),cv::Scalar(0,0,0,0));
        if (size == outerRect.height) {
            int x = (size - outerRect.width)/2;
            croppedImage(cv::Range(0,croppedImage.rows -1),cv::Range(0,croppedImage.cols -1))
            .copyTo(resizeImage(cv::Range(0,0 + croppedImage.rows -1 ),cv::Range(x , x + croppedImage.cols -1)  ));
        } else if (size == outerRect.width) {
            int  y  = (size - outerRect.height)/2;
            croppedImage(cv::Range(0,croppedImage.rows -1),cv::Range(0,croppedImage.cols -1)  )
            .copyTo(resizeImage(cv::Range(y,y+croppedImage.rows - 1),cv::Range(0 ,0 +  croppedImage.cols-1 )  ));
        }
        int iteration = ((resizeImage.rows/100)*2)/ 3;
        cv::Mat rect_kernel1 =  cv::getStructuringElement(cv::MORPH_RECT, cv::Size(5, 5));
        cv::dilate(croppedImage,croppedImage, rect_kernel1, cv::Point(-1,-1), iteration,
                   cv::BORDER_CONSTANT,
                   cv::Scalar::all(DBL_MAX));
        cv::Mat  size23_23  = cv::Mat(cv::Size(23,23),resizeImage.type(),cv::Scalar(0,0,0,0));
        cv::resize(resizeImage, size23_23, cv::Size(23,23),0,0, cv::INTER_AREA);
        cv::Mat  size28_28  = cv::Mat(cv::Size(28,28),resizeImage.type(),cv::Scalar(0,0,0,0));
            size23_23(cv::Range(0, 23), cv::Range(0, 23))
            .copyTo(size28_28(cv::Range(3, 3 + 23), cv::Range(3, 3 + 23)));
        [images addObject:@{@"x":@(outerRect.x),@"y": @(outerRect.y) , @"width": @(outerRect.width) , @"height" :@(outerRect.height) ,@"img":[OpenCVWrapper UIImageFromCVMat:size28_28]}];
        croppedImage.release();
        size28_28.release();
        size23_23.release();
        resizeImage.release();
//        }
    }
    matInput.release();
    orig_image.release();
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

