
import React from 'react'
import { modalStyles as styles } from '../assets/dummystyle.js';
import { X } from 'lucide-react';



const Modal = ({
  children, isOpen, onClose, title, hideHeader, showActionBtn, actionBtnIcon = null,
  actionBtnText, onActionClick =() => { }, 
}) => {
  if (!isOpen) return null;  // If the modal is not open, return null to render nothing
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {!hideHeader && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>

            {showActionBtn && (
              <button className={styles.actionButton} onClick={onActionClick}>
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}
            </div>
        )}

        <button type='button' className={styles.closeButton} onClick={onClose}>
          <X size={20} />

        </button>
        <div className={styles.body}>{children}</div>

      </div>
    </div>
  )
}

export default Modal
