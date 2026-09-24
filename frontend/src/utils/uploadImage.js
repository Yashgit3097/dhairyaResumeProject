
import { API_PATHS } from './apiPaths'
import axiosInstance from './axiosInstance';

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.image.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading the image', error);
        throw error;
    }
};

export default uploadImage;

// It will help in uploading images to the server.
// The function takes an image file as input, creates a FormData object, appends the image file to it, and sends a POST request to the server using axios.
// The server endpoint is defined in the API_PATHS object.
// If the upload is successful, it returns the response data; otherwise, it logs the error and throws it for further handling.

