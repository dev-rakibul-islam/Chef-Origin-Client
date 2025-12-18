import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import axiosInstance from "../services/axiosInstance";

// ⿡ Get authentication parameters
const getAuthParams = async () => {
  try {
    const response = await axiosInstance.get("/auth");
    return response.data; // { signature, expire, token, publicKey }
  } catch (error) {
    console.log("Failed to get auth params:", error);
    throw error;
  }
};

// ⿢ Upload file to ImageKit and return the final URL
const imagekitUploader = async (file, onProgressCallback) => {
  try {
    // Get auth info first
    const { signature, expire, token, publicKey } = await getAuthParams();

    // Upload file
    const result = await upload({
      file,
      fileName: file.name,
      signature,
      expire,
      token,
      publicKey,
      onProgress: onProgressCallback, // optional
    });

    return result.url; // 🔥 return uploaded URL
  } catch (error) {
    // Error handling
    if (error instanceof ImageKitAbortError) {
      throw new Error("Upload aborted");
    } else if (error instanceof ImageKitInvalidRequestError) {
      throw new Error("Invalid upload request");
    } else if (error instanceof ImageKitUploadNetworkError) {
      throw new Error("Network issue during upload");
    } else if (error instanceof ImageKitServerError) {
      throw new Error("ImageKit server error");
    } else {
      throw new Error(error.message || "Unknown upload error");
    }
  }
};

export default imagekitUploader;
