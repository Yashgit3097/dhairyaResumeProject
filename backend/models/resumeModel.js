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
      profileImg: String,
      previewUrl: String,
      fullName: String,
      designation: String,
      summary: String,
    },
    contactInfo: {
      email: String,
      phone: String,
      address: String,
      location: String,
      website: String,
      linkedin: String,
      github: String,
    },

    // work Experience
    workExperience: [
      {
        company: String,
        companyName: String,
        role: String,
        jobTitle: String,
        startDate: String,
        endDate: String,
        description: String,
        location: String,
      },
    ],
    education: [
      {
        institution: String,
        institutionName: String,
        degree: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    skills: [
      {
        name: String,
        skillName: String,
        progress: Number, // Progress can be a percentage or a rating
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        github: String,
        githubLink: String,
        liveDemo: String,
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
    strict: false,
  }
);

resumeSchema.pre("save", function (next) {
  if (this.contactInfo) {
    if (this.contactInfo.location && !this.contactInfo.address) {
      this.contactInfo.address = this.contactInfo.location;
    } else if (this.contactInfo.address && !this.contactInfo.location) {
      this.contactInfo.location = this.contactInfo.address;
    }
  }
  next();
});

export default mongoose.model("Resume", resumeSchema);


