interface SpinnerProps {
  // diameter in pixels
  size?: number;
  className?: string;
}

// Replaces MUI <CircularProgress>: an indeterminate spinning ring.
const Spinner = ({ size = 48, className = '' }: SpinnerProps) => (
  <span
    role="progressbar"
    aria-label="loading"
    className={`inline-block animate-spin rounded-full border-4 border-current border-t-transparent ${className}`}
    style={{ width: size, height: size }}
  />
);

export default Spinner;
