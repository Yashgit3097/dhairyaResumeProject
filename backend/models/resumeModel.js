import mongoose from "mongoose";



const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Types.ObjectId means it will store the ID of the user
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnailLink: {
      type: String,
    },
    template: {
      theme: String,
      colorPalette: [String],
    },
    profileInfo: {
      profilePreviewUrl: String,
      fullName: String,
      designation: String,
      summary: String,
    },
    contactInfo: {
      email: String,
      phone: String,
      address: String,
      website: String,
      linkedin: String,
      github: String,
    },

    // work Experience
    workExperience: [
      {
        companyName: String,
        jobTitle: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        institutionName: String,
        degree: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    skills: [
      {
        skillName: String,
        progress: Number, // Progress can be a percentage or a rating
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        githubLink: String,
        liveDemoLink: String,
      },
    ],

    certifications: [
      {
        title: String,
        issuer: String,
        year: String,
      },
    ],

    languages: [
      {
        name: String,
        progress: Number,
      },
    ],

    interests: [String],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }, // Automatically manage createdAt and updatedAt fields
  }
);


export default mongoose.model("Resume", resumeSchema);


