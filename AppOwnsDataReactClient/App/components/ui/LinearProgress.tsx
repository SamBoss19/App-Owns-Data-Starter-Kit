// Replaces MUI <LinearProgress>: an indeterminate horizontal progress bar.
const LinearProgress = ({ className = '' }: { className?: string }) => (
  <div className={`relative h-1 w-full overflow-hidden bg-blue-200 ${className}`}>
    <div className="animate-indeterminate bg-blue-600" />
  </div>
);

export default LinearProgress;
