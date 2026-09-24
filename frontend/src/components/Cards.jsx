import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { cardStyles } from "../assets/dummystyle";
import { Award, Clock, Edit, Zap, Trash2, TrendingUp, Check } from "lucide-react";
import { useState } from "react";



// Profile Info Cards
export const ProfileInfoCards = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  // If user is not authenticated, return null or redirect to login
  return (
    user && (
      <div className={cardStyles.profileCard}>
        <div className={cardStyles.profileInitialsContainer}>
          <span className={cardStyles.profileInitialsText}>
            {user.name ? user.name.charAt(0).toUpperCase() : ""}
          </span>
        </div>

        <div className={cardStyles.profileName}>{user.name || ""}</div>

        <button className={cardStyles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    )
  );
};







// ResumeSummaryCard Component
export const ResumeSummaryCard = ({
  title = "Untitled Resume",
  createdAt = null,
  updatedAt = null,
  onSelect,
  onDelete,
  completion = 85,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Created at
  const formattedCreatedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "—";

  // Updated at
  const formattedUpdatedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "—";

  //color according to completion percentage
  const getCompletionColor = () => {
    if (completion >= 90) return cardStyles.completionHigh;
    if (completion >= 70) return cardStyles.completionMedium;
    return cardStyles.completionLow;
  };


  // color icon according to completion percentage
  // Award icon for high completion, TrendingUp for medium, and Zap for low
  const getCompletionIcon = () => {
    if (completion >= 90) return <Award size={12} />;
    if (completion >= 70) return <TrendingUp size={12} />;
    return <Zap size={12} />;
  };


  // Handle delete click
  // This function stops the click event from propagating to the card's onClick handler
  // and calls the onDelete prop if provided.
  // This allows the delete button to work without triggering the card selection.
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  // Generate a design color based on the title length
  const generateDesign = () => {
    const colors = [
      "from-blue-50 to-blue-100",
      "from-purple-50 to-purple-100",
      "from-emerald-50 to-emerald-100",
      "from-amber-50 to-amber-100",
      "from-rose-50 to-rose-100"
    ];
    return colors[title.length % colors.length];
  };

  const designColor = generateDesign();

  return (
    <div
      className={cardStyles.resumeCard}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}  // mouse or swipe for mobile view
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Completion indicator */}
      <div className={cardStyles.completionIndicator}>
        <div className={`${cardStyles.completionDot} bg-gradient-to-r ${getCompletionColor()}`}>
          <div className={cardStyles.completionDotInner} />
        </div>
        <span className={cardStyles.completionPercentageText}>{completion}%</span>
        {getCompletionIcon()}
      </div>

      {/* Preview area */}
      <div className={`${cardStyles.previewArea} bg-gradient-to-br ${designColor}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cardStyles.emptyPreviewIcon}>
            <Edit size={28} className="text-indigo-600" />
          </div>
          <span className={cardStyles.emptyPreviewText}>{title}</span>
          <span className={cardStyles.emptyPreviewSubtext}>
            {completion === 0 ? "Start building" : `${completion}% completed`}
          </span>

          {/* Mini resume sections indicator */}
          <div className="mt-4 flex gap-2">
            {['Profile', 'Work', 'Skills', 'Edu'].map((section, i) => (
              <div
                key={i}
                className={`px-2 py-1 text-xs rounded-md ${i < Math.floor(completion / 25)
                  ? 'bg-white/90 text-indigo-600 font-medium'
                  : 'bg-white/50 text-gray-500'
                  }`}
              >
                {section}
              </div>
            ))}
          </div>
        </div>

        {/* Hover overlay with action buttons */}
        {isHovered && (
          <div className={cardStyles.actionOverlay}>
            <div className={cardStyles.actionButtonsContainer}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelect) onSelect();
                }}
                className={cardStyles.editButton}
                title="Edit"
              >
                <Edit size={18} className={cardStyles.buttonIcon} />
              </button>
              <button
                onClick={handleDeleteClick}
                className={cardStyles.deleteButton}
                title="Delete"
              >
                <Trash2 size={18} className={cardStyles.buttonIcon} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className={cardStyles.infoArea}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h5 className={cardStyles.title}>{title}</h5>
            <div className={cardStyles.dateInfo}>
              <Clock size={12} />
              <span>Created At: {formattedCreatedDate}</span>
              <span className="ml-2">Updated At: {formattedUpdatedDate}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getCompletionColor()} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
            style={{ width: `${completion}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
          <div
            className={`absolute top-0 h-full w-4 bg-gradient-to-r from-transparent to-white/50 blur-sm transition-all duration-700`}
            style={{ left: `${Math.max(0, completion - 2)}%` }}
          ></div>
        </div>

        {/* Completion status */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-medium text-gray-500">
            {completion < 50 ? "Getting Started" : completion < 80 ? "Almost There" : "Ready to Go!"}
          </span>
          <span className="text-xs font-bold text-gray-700">{completion}% Complete</span>
        </div>
      </div>
    </div>
  );
};


// Templates Card:
export const TemplateCard = ({thumbnailImg, isSelected, onSelect, name}) => {
  return (
    <div className={`group h-[210px] sm:h-[230px] md:h-[240px] flex flex-col bg-white border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-2xl relative
      ${
        isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/20 bg-violet-50 ring-2 ring-violet-400/50' : 'border-gray-200 hover:border-violet-300'
      }`} onClick={onSelect}>
      {thumbnailImg ? (
        <div className="relative w-full h-full overflow-hidden">
          <img src={thumbnailImg || '/placeholder.svg'} alt={name || "Template Review"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Template Name Tag */}
          {name && (
            <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold text-slate-800 shadow-sm flex items-center justify-between border border-white/50">
              <span className="truncate">{name}</span>
              {isSelected && <span className="text-[10px] text-violet-600 bg-violet-100 font-extrabold px-1.5 py-0.5 rounded">Active</span>}
            </div>
          )}

          {/* Checkmark */}
          {isSelected && (
            <div className="absolute inset-0 bg-violet-500/15 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl">
                <Check size={26} className="text-violet-600 stroke-[3]" />
              </div>
            </div>
          )}

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-violet-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          </div>
        </div>
      ) : (
        <div className="w-full h-[200px] flex items-center flex-col justify-center bg-gradient-to-br from-violet-50 via-violet-600 to-fuchsia-50">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-3">
            <Edit className="text-white" size={20} /> 
          </div>
          <span className="text-gray-700 font-bold">
            {name || "No Preview"}
          </span>
        </div>
      )}
    </div>
  )
}