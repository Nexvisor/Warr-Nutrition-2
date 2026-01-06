import { FileWithPreview } from "@/FrontendSchema/FileWithPreview.Schema";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

const abortController = new AbortController();
const authenticator = async () => {
  try {
    // Perform the request to the upload authentication endpoint.
    const response = await fetch("/api/Products/upload-image");
    if (!response.ok) {
      // If the server response is not successful, extract the error text for debugging.
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    // Parse and destructure the response JSON for upload credentials.
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    // Log the original error for debugging before rethrowing a new error.
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

async function uploadToImageKit(files: FileWithPreview[]) {
  const imageUrls = await Promise.all(
    files.map(async (imageFile) => {
      let file = imageFile.file as File;

      // Authenticate
      let authParams;
      try {
        authParams = await authenticator();
      } catch (authError) {
        console.error("Failed to authenticate for upload:", authError);
        return null;
      }

      const { signature, expire, token, publicKey } = authParams;

      // Upload
      try {
        const uploadResponse = await upload({
          expire,
          token,
          signature,
          publicKey,
          file,
          fileName: file.name,
          abortSignal: abortController.signal,
        });

        console.log("Upload response:", uploadResponse);
        return {
          imageKitId: uploadResponse.fileId,
          url: uploadResponse.url,
        };
      } catch (error) {
        if (error instanceof ImageKitAbortError) {
          console.error("Upload aborted:", error.reason);
        } else if (error instanceof ImageKitInvalidRequestError) {
          console.error("Invalid request:", error.message);
        } else if (error instanceof ImageKitUploadNetworkError) {
          console.error("Network error:", error.message);
        } else if (error instanceof ImageKitServerError) {
          console.error("Server error:", error.message);
        } else {
          console.error("Upload error:", error);
        }
        return null;
      }
    })
  );
  return imageUrls;
}

export default uploadToImageKit;
