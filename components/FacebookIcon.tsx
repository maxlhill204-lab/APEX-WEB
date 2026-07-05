type FacebookIconProps = {
  className?: string;
};

export function FacebookIcon({ className = "h-4 w-4" }: FacebookIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14.3 8.1V6.7c0-.7.5-.9 1-.9h1.8V2.7l-2.5-.1c-2.8 0-4.3 1.7-4.3 4.7v.8H7.6v3.5h2.7v9.8h4v-9.8H17l.5-3.5h-3.2Z" />
    </svg>
  );
}
