import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const GridIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    className={className}
    {...props}
  >
    <rect x="1.5" y="1.5" width="6" height="6" rx="1.2" fill="currentColor" />
    <rect x="10.5" y="1.5" width="6" height="6" rx="1.2" fill="currentColor" />
    <rect x="1.5" y="10.5" width="6" height="6" rx="1.2" fill="currentColor" />
    <rect x="10.5" y="10.5" width="6" height="6" rx="1.2" fill="currentColor" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 17, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="11" cy="11" r="7.5" />
    <line x1="20.5" y1="20.5" x2="16.35" y2="16.35" />
  </svg>
);

export const BagIcon: React.FC<IconProps> = ({ size = 17, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M6 7h12l1 13H5L6 7z" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 14, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
