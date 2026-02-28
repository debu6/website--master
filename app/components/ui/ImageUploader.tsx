"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploaderProps {
  currentImage?: string;
  onImageUploaded: (imageUrl: string) => void;
  aspectRatio?: number;
  label?: string;
}

// Helper function to create centered aspect crop
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

export default function ImageUploader({
  currentImage,
  onImageUploaded,
  aspectRatio = 4 / 3,
  label = "Vehicle Image",
}: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setShowCropper(true);
    setCrop(undefined);
    setCompletedCrop(null);
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      imgRef.current = e.currentTarget;
      
      // Set initial centered crop with aspect ratio
      const initialCrop = centerAspectCrop(width, height, aspectRatio);
      setCrop(initialCrop);
    },
    [aspectRatio]
  );

  const handleCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      // Add crop data if we have a completed crop
      if (completedCrop && imgRef.current) {
        // Calculate crop data relative to natural image dimensions
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

        const cropData = {
          x: completedCrop.x * scaleX,
          y: completedCrop.y * scaleY,
          width: completedCrop.width * scaleX,
          height: completedCrop.height * scaleY,
        };
        formData.append("cropData", JSON.stringify(cropData));
      }

      const response = await fetch("http://localhost:5000/api/upload/vehicle-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const fullUrl = `http://localhost:5000${data.data.url}`;
        onImageUploaded(fullUrl);
        setShowCropper(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setCrop(undefined);
        setCompletedCrop(null);
        
        // Reset file input
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } else {
        setError(data.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to connect to server. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowCropper(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setError("");
    
    // Reset file input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClickUpload = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">{label} *</label>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {/* Upload button and current preview */}
      {!showCropper && (
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={handleClickUpload}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {currentImage ? "Change Image" : "Upload Image"}
          </button>
          
          {/* Current image preview */}
          {currentImage && (
            <div className="relative group">
              <img 
                src={currentImage} 
                alt="Current" 
                className="w-24 h-16 object-cover rounded-lg border border-white/10"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                <span className="text-xs text-white">Current</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Crop editor modal/section */}
      {showCropper && previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a0b2e] rounded-2xl border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Adjust Image</h3>
              <p className="text-sm text-gray-400">Drag to adjust the crop area. The image will be optimized upon upload.</p>
            </div>

            {/* Crop area */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-black/20">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={aspectRatio}
                className="max-h-[60vh]"
              >
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-h-[60vh] max-w-full"
                  style={{ objectFit: "contain" }}
                />
              </ReactCrop>
            </div>

            {/* Error message */}
            {error && (
              <div className="px-6 py-2">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading}
                className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Upload Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
