
import Resume from "../models/resumeModel.js";
import fs from "fs"; // Importing fs to handle file system operations
import path from "path"; // Importing path to handle file paths



export const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        // Default Template:
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };


        const newResume = await Resume.create({
            userId: req.user._id, // Assuming req.user is set by the auth middleware
            title,
            ...defaultResumeData, // Spread the default resume data
            ...req.body, // Include any additional fields from the request body  
        });
        res.status(201).json(newResume);
    }


    catch (error) {
        res.status(500).json({
            message: "Error creating resume",
            error: error.message, // Include the error message for debugging
        });
    }
}









// GET function to get all resumes for a user
export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });

        res.json(resumes);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching resumes",
            error: error.message, // Include the error message for debugging
        });
    }
}



// GET function to get a specific resume by ID
export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

        if(!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.json(resume);

    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching resume",
            error: error.message, // Include the error message for debugging
        });
    }
}







// Update resume function - this will update the resume with the provided data
export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }

        // Merge updated resume data with existing resume
        Object.assign(resume, req.body);

        // Save the updated resume
        const savedResume = await resume.save();
        res.json(savedResume);

    }
    catch (error) {
        res.status(500).json({
            message: "Failed to update resume",
            error: error.message, // Include the error message for debugging
        });
    }
}











// Delete resume function - this will delete the resume by ID
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }


        // Create a Uploads folder and store the resume in it
        const uploadsFolder = path.join(process.cwd(), 'uploads'); // Get the current working directory and create the uploads folder path


        // Delete the Thumbnail means deleting our resume 
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));  // Get the full path of the old thumbnail
            if (fs.existsSync(oldThumbnail)) { // Check if the file exists
                fs.unlinkSync(oldThumbnail); // Delete the file
            }
        }

        // Delete the Profile Image means deleting our profile image
        if(resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl)); // Get the full path of the old profile image
            if (fs.existsSync(oldProfile)) { // Check if the file exists
                fs.unlinkSync(oldProfile); // Delete the file
            }
        }




        // Dlete the resume Document from the database(mongoDB)
        const deletedResume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deletedResume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }
        res.json({ message: "Resume deleted successfully" });

    }
    catch (error) {
        res.status(500).json({
            message: "Failed to delete resume",
            error: error.message, // Include the error message for debugging
        });
    }
}








