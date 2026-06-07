import { ReactNode } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

type Severity = 'info' | 'warning' | 'error';

const styles: Record<Severity, { box: string; icon: ReactNode }> = {
  info: { box: 'bg-blue-50 text-blue-800 border-blue-300', icon: <InfoIcon fontSize="small" /> },
  warning: { box: 'bg-amber-50 text-amber-800 border-amber-300', icon: <WarningIcon fontSize="small" /> },
  error: { box: 'bg-red-50 text-red-800 border-red-300', icon: <ErrorIcon fontSize="small" /> },
};

// Replaces MUI <Alert>: a colored, bordered message box with a leading icon.
const Alert = ({
  severity = 'info',
  children,
  className = '',
}: {
  severity?: Severity;
  children: ReactNode;
  className?: string;
}) => {
  const s = styles[severity];
  return (
    <div className={`flex items-center gap-2 rounded border p-2 text-sm ${s.box} ${className}`} role="alert">
      <span className="shrink-0">{s.icon}</span>
      <span>{children}</span>
    </div>
  );
};

export default Alert;
