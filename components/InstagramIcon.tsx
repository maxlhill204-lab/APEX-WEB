type InstagramIconProps = {
  className?: string;
};

export function InstagramIcon({ className = "h-4 w-4" }: InstagramIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.7" cy="7.3" r="1.1" fill="currentColor" />
    </svg>
  );
}
