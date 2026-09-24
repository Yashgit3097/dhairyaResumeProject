
import fs from 'fs'; // Importing the 'fs' module to handle file system operations
import path from 'path'; // Importing the 'path' module to handle file paths
import Resume from '../models/resumeModel.js'; // Importing the Resume model to interact with the database
import upload from '../middleware/uploadMiddleware.js'; // Importing the upload middleware for handling file uploads



export const uploadResumeImage = async (req, res) => {
    try {
        // Configure multer to handle file uploads
        upload.fields([{name: 'thumbnail'}, {name: 'profileImage'}])
        (req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "File upload failed", error: err.message }); // Return error if file upload fails
            }

            const resumeId = req.params.id; // Get the resume ID from the request parameters
            const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id }); // Find the resume by ID and user ID

            if (!resume) {
                return res.status(404).json({ message: "Resume not found or unauthorized" }); // Return error if resume is not found
            }


            // Use process .cwd() to locate the uploads folder
            const uploadsFolder = path.join(process.cwd(), 'uploads'); // Get the absolute path to the uploads folder
            const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`; // Construct the base URL for accessing uploaded files
            
            const newThumbnail = req.files.thumbnail?.[0]; // Get the uploaded thumbnail file
            const newProfileImage = req.files.profileImage?.[0]; // Get the uploaded profile image file

            if (newThumbnail) {
                if(resume.thumbnailLink) {
                    const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink)); // Get the absolute path of the old thumbnail
                    if (fs.existsSync(oldThumbnail))
                        fs.unlinkSync(oldThumbnail); // Delete the old thumbnail file if it exists
                }
                    resume.thumbnailLink = `${baseUrl}${newThumbnail.filename}`; // Update the thumbnail link in the resume
            }


            // Same for profilePreview image
            if (newProfileImage) {
                if(resume.profileInfo?.profilePreviewUrl) {
                    const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl)); // Get the absolute path of the old thumbnail
                    if (fs.existsSync(oldProfile))
                        fs.unlinkSync(oldProfile); // Delete the old thumbnail file if it exists
                }
                    resume.profileInfo.profilePreviewUrl = `${baseUrl}${newProfileImage.filename}`; // Update the thumbnail link in the resume
            }

            await resume.save(); // Save the updated resume to the database
            res.status(200).json({
                message: "Images uploaded successfully",
                thumbnailLink: resume.thumbnailLink,
                profilePreviewUrl: resume.profileInfo.profilePreviewUrl
        });
    });

} 
    catch (err) {
        console.error("Error uploading images:", err); // Log the error for debugging
        res.status(500).json({ message: "Failed to upload images", error: err.message }); // Return error response
    }

} 
