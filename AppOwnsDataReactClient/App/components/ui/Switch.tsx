interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

// Replaces MUI <Switch>: an accessible toggle styled with Tailwind.
const Switch = ({ checked, onChange, className = '' }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-brand' : 'bg-gray-300'} ${className}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
    />
  </button>
);

export default Switch;
