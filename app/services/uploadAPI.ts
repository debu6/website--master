const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface UploadResponse {
    success: boolean;
    message: string;
    data: {
        url: string;
        publicId: string;
        filename: string;
    };
}

/**
 * Upload vehicle image to Cloudinary via backend
 * @param file - Image file to upload
 * @param cropData - Optional crop data
 * @returns Promise with Cloudinary image URL
 */
export async function uploadVehicleImage(
    file: File,
    cropData?: { x: number; y: number; width: number; height: number }
): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    if (cropData) {
        formData.append('cropData', JSON.stringify(cropData));
    }

    const res = await fetch(`${API_BASE}/upload/vehicle-image`, {
        method: 'POST',
        body: formData
    });

    const data: UploadResponse = await res.json();
    
    if (!data.success) {
        throw new Error(data.message || 'Failed to upload image');
    }

    return data.data.url; // Returns Cloudinary URL directly
}

/**
 * Delete vehicle image from Cloudinary via backend
 * @param publicId - Cloudinary public ID of the image
 */
export async function deleteVehicleImage(publicId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/upload/vehicle-image/${publicId}`, {
        method: 'DELETE'
    });

    const data = await res.json();
    
    if (!data.success) {
        throw new Error(data.message || 'Failed to delete image');
    }
}

/**
 * Get public ID from Cloudinary URL
 * Useful for storing and managing Cloudinary assets
 * @param cloudinaryUrl - Full Cloudinary URL
 * @returns Public ID
 */
export function getPublicIdFromUrl(cloudinaryUrl: string): string {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}
    const match = cloudinaryUrl.match(/\/upload(?:\/v\d+)?\/(.+?)(?:\.\w+)?$/);
    return match ? match[1] : '';
}
