'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

// Constants for file validation
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSION = 100; // Minimum 100x100 pixels
const MAX_DIMENSION = 4096; // Maximum 4096x4096 pixels

interface ProfilePictureUploadProps {
  currentImage: string;
  userName: string;
  onImageChange: (imageUrl: string) => void;
}

type ErrorType = 
  | 'invalid-type'
  | 'file-too-large'
  | 'file-too-small'
  | 'dimension-too-small'
  | 'dimension-too-large'
  | 'upload-failed'
  | 'read-failed'
  | null;

interface UploadError {
  type: ErrorType;
  message: string;
}

const ERROR_MESSAGES: Record<NonNullable<ErrorType>, string> = {
  'invalid-type': 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.',
  'file-too-large': `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
  'file-too-small': 'File is too small or empty. Please select a valid image.',
  'dimension-too-small': `Image dimensions are too small. Minimum size is ${MIN_DIMENSION}x${MIN_DIMENSION} pixels.`,
  'dimension-too-large': `Image dimensions are too large. Maximum size is ${MAX_DIMENSION}x${MAX_DIMENSION} pixels.`,
  'upload-failed': 'Failed to upload image. Please try again.',
  'read-failed': 'Failed to read the image file. Please try a different image.',
};

export default function ProfilePictureUpload({
  currentImage,
  userName,
  onImageChange,
}: ProfilePictureUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<UploadError | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file type
  const validateFileType = (file: File): boolean => {
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  };

  // Validate file size
  const validateFileSize = (file: File): ErrorType | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'file-too-large';
    }
    if (file.size < 100) {
      return 'file-too-small';
    }
    return null;
  };

  // Validate image dimensions
  const validateImageDimensions = (img: HTMLImageElement): ErrorType | null => {
    if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
      return 'dimension-too-small';
    }
    if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
      return 'dimension-too-large';
    }
    return null;
  };

  // Simulate upload delay (replace with real upload logic)
  const simulateUpload = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }, []);

  // Process the selected file
  const processFile = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    if (!validateFileType(file)) {
      setError({ type: 'invalid-type', message: ERROR_MESSAGES['invalid-type'] });
      return;
    }

    // Validate file size
    const sizeError = validateFileSize(file);
    if (sizeError) {
      setError({ type: sizeError, message: ERROR_MESSAGES[sizeError] });
      return;
    }

    setIsUploading(true);

    try {
      // Create a preview and validate dimensions
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // Create an image element to check dimensions
        const img = new window.Image();
        img.onload = async () => {
          const dimensionError = validateImageDimensions(img);
          if (dimensionError) {
            setError({ type: dimensionError, message: ERROR_MESSAGES[dimensionError] });
            setIsUploading(false);
            return;
          }

          // Set preview and simulate upload
          setPreviewUrl(result);
          
          // TODO: Replace with actual upload logic to your server/storage
          // For now, we simulate a successful upload
          try {
            await simulateUpload();
            onImageChange(result);
            setShowModal(false);
          } catch {
            setError({ type: 'upload-failed', message: ERROR_MESSAGES['upload-failed'] });
            setPreviewUrl(currentImage);
          }
          
          setIsUploading(false);
        };

        img.onerror = () => {
          setError({ type: 'read-failed', message: ERROR_MESSAGES['read-failed'] });
          setIsUploading(false);
        };

        img.src = result;
      };

      reader.onerror = () => {
        setError({ type: 'read-failed', message: ERROR_MESSAGES['read-failed'] });
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch {
      setError({ type: 'upload-failed', message: ERROR_MESSAGES['upload-failed'] });
      setIsUploading(false);
    }
  }, [currentImage, onImageChange, simulateUpload]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Remove current image
  const handleRemoveImage = () => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=200&background=ec4899&color=fff`;
    setPreviewUrl(defaultAvatar);
    onImageChange(defaultAvatar);
    setError(null);
    setShowModal(false);
  };

  return (
    <>
      {/* Camera Button Trigger */}
      <button
        onClick={() => setShowModal(true)}
        className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        aria-label="Change profile picture"
      >
        <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Change Profile Picture
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                  setPreviewUrl(currentImage);
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Current Preview */}
            <div className="mb-6 flex justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-pink-200 dark:border-pink-800">
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <svg className="h-5 w-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error.message}
                  </p>
                  <p className="mt-1 text-xs text-red-600 dark:text-red-300">
                    Accepted formats: JPEG, PNG, WebP, GIF (max 5MB)
                  </p>
                </div>
              </div>
            )}

            {/* Drop Zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`mb-4 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                isDragging
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'border-gray-300 hover:border-pink-400 dark:border-gray-600 dark:hover:border-pink-500'
              } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
              onClick={openFilePicker}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              <svg
                className={`mx-auto h-12 w-12 ${isDragging ? 'text-pink-500' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                or click to browse
              </p>
              <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                JPEG, PNG, WebP, or GIF • Max 5MB • Min 100×100px
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Remove Photo
              </button>
              <button
                onClick={openFilePicker}
                disabled={isUploading}
                className="flex-1 rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Choose Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
