

/**
 Constructor...
 */
VideoBucket = function(video, label) {
    
    this.video = video;
    this.label = label;

	this.enabled = true;
    
    this.transformCanvas = null;
    this.transformContext = null;
    this.coordinates = [];
    
    // this.videoCanvas = MediaExt.createCanvas(video.width, video.height);
    // this.videoContext = this.videoCanvas.getContext("2d");
    
    this.transform = null;
}

/**
 Call this function after calibration
 @param poly ...
 @param rect The local shared rectangle
 */
VideoBucket.prototype.setTransform = function(poly, rect) {
    
    console.log('creating transform');
    console.log(poly);
    console.log(rect);
    
    this.coordinates = poly;
    this.transformCanvas = MediaExt.createCanvas(rect.width, rect.height);
    this.transformContext = this.transformCanvas.getContext("2d");
    this.transform = new Geometry.PolyToCanvasTransform(poly, this.transformCanvas);
	
	var cropRect = Geometry.rectFromPoly(poly);
	
	var padding = 5;
	cropRect.x -= padding;
	cropRect.y -= padding;
	cropRect.width += padding * 2;
	cropRect.height += padding * 2;

	this.videoCanvas = MediaExt.createCanvas(rect.width, cropRect.height);
    this.videoContext = this.videoCanvas.getContext("2d");
	this.videoCropRect = cropRect;
}

VideoBucket.prototype.toggleEnabled = function() {
	this.enabled = !this.enabled;
}

VideoBucket.prototype.transformVideo = function() {
    
    if (this.transform == null || !this.enabled) {
        return null;
    }
    
    var	x = this.videoCropRect.x,
		y = this.videoCropRect.y,
		w = this.videoCropRect.width,
        h = this.videoCropRect.height;
	
    this.videoContext.drawImage(this.video,
								x, y, w, h,
								0, 0, w, h);
    var imageData = this.videoContext.getImageData(0, 0, w, h);
    
	/*
    this.videoContext.drawImage(this.video, 0, 0, video.width, video.height);
    var imageData = this.videoContext.getImageData(0, 0, w, h);
    */
	
    this.transform.transformImage(imageData,
								  this.transformCanvas,
								  this.videoCropRect);
    
    return this.transformCanvas;
}

VideoBucket.transformList = function(bucketList) {
    var transformedVideos = [];
    for (var i = 0; i < bucketList.length; i++) {
        var tv = bucketList[i].transformVideo();
        if (tv != null) {
            transformedVideos.push(tv);
        }
    }
    return transformedVideos;
}
