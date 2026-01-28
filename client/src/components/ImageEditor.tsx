import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crop as CropIcon, Maximize2, RotateCcw, Check, X, Loader2 } from "lucide-react";

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onSave: (editedFile: File) => void;
}

const ASPECT_RATIOS = [
  { label: "Free", value: 0 },
  { label: "1:1 Square", value: 1 },
  { label: "16:9 Widescreen", value: 16/9 },
  { label: "4:3 Standard", value: 4/3 },
  { label: "3:2 Photo", value: 3/2 },
  { label: "2:1 Banner", value: 2 },
];

const PRESET_SIZES = [
  { label: "Original", width: 0, height: 0 },
  { label: "Thumbnail (150x150)", width: 150, height: 150 },
  { label: "Small (300x200)", width: 300, height: 200 },
  { label: "Medium (600x400)", width: 600, height: 400 },
  { label: "Large (1200x800)", width: 1200, height: 800 },
  { label: "Hero (1920x1080)", width: 1920, height: 1080 },
];

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageEditor({ isOpen, onClose, imageFile, onSave }: ImageEditorProps) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [scale, setScale] = useState(100);
  const [customWidth, setCustomWidth] = useState<number>(0);
  const [customHeight, setCustomHeight] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load image when file changes
  useEffect(() => {
    if (imageFile && isOpen) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgSrc(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, isOpen]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setImgSrc("");
      setCrop(undefined);
      setCompletedCrop(undefined);
      setAspect(undefined);
      setScale(100);
      setCustomWidth(0);
      setCustomHeight(0);
    }
  }, [isOpen]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setCustomWidth(naturalWidth);
    setCustomHeight(naturalHeight);
    
    if (aspect) {
      setCrop(centerAspectCrop(width, height, aspect));
    } else {
      setCrop({
        unit: "%",
        x: 5,
        y: 5,
        width: 90,
        height: 90,
      });
    }
  }, [aspect]);

  const handleAspectChange = (value: string) => {
    const newAspect = parseFloat(value);
    setAspect(newAspect || undefined);
    
    if (imgRef.current && newAspect) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspect));
    }
  };

  const handlePresetSize = (width: number, height: number) => {
    if (width === 0) {
      if (imgRef.current) {
        setCustomWidth(imgRef.current.naturalWidth);
        setCustomHeight(imgRef.current.naturalHeight);
      }
    } else {
      setCustomWidth(width);
      setCustomHeight(height);
    }
  };

  const handleReset = () => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(100);
    setAspect(undefined);
    if (imgRef.current) {
      setCustomWidth(imgRef.current.naturalWidth);
      setCustomHeight(imgRef.current.naturalHeight);
    }
  };

  const processImage = async (): Promise<File | null> => {
    if (!imgRef.current || !canvasRef.current) return null;

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    let outputWidth = customWidth || image.naturalWidth;
    let outputHeight = customHeight || image.naturalHeight;

    if (completedCrop) {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      if (customWidth && customHeight) {
        outputWidth = customWidth;
        outputHeight = customHeight;
      } else {
        outputWidth = cropWidth * (scale / 100);
        outputHeight = cropHeight * (scale / 100);
      }

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );
    } else {
      outputWidth = customWidth * (scale / 100);
      outputHeight = customHeight * (scale / 100);
      
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );
    }

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const fileName = imageFile?.name || "edited-image.jpg";
            const editedFile = new File([blob], fileName, { type: "image/jpeg" });
            resolve(editedFile);
          } else {
            resolve(null);
          }
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const editedFile = await processImage();
      if (editedFile) {
        onSave(editedFile);
        onClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CropIcon className="w-5 h-5" />
            Image Editor
          </DialogTitle>
          <DialogDescription>
            Crop and resize your image before uploading
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
              {imgSrc ? (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Edit preview"
                    onLoad={handleImageLoad}
                    style={{ maxHeight: "400px", maxWidth: "100%" }}
                  />
                </ReactCrop>
              ) : (
                <p className="text-gray-400">No image loaded</p>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="crop">
              <TabsList className="w-full">
                <TabsTrigger value="crop" className="flex-1">
                  <CropIcon className="w-4 h-4 mr-1" />
                  Crop
                </TabsTrigger>
                <TabsTrigger value="resize" className="flex-1">
                  <Maximize2 className="w-4 h-4 mr-1" />
                  Resize
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crop" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <Select onValueChange={handleAspectChange} defaultValue="0">
                    <SelectTrigger>
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIOS.map((ratio) => (
                        <SelectItem key={ratio.label} value={ratio.value.toString()}>
                          {ratio.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {completedCrop && (
                  <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
                    <p>Crop: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)} px</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="resize" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Preset Sizes</Label>
                  <Select onValueChange={(v) => {
                    const preset = PRESET_SIZES.find(p => p.label === v);
                    if (preset) handlePresetSize(preset.width, preset.height);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preset size" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_SIZES.map((size) => (
                        <SelectItem key={size.label} value={size.label}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Width (px)</Label>
                    <Input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (px)</Label>
                    <Input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Scale: {scale}%</Label>
                  <Slider
                    value={[scale]}
                    onValueChange={(v) => setScale(v[0])}
                    min={10}
                    max={200}
                    step={5}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2 pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleSave}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
