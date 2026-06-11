interface ErrorToastProps {
  error: string | null;
  onClose: () => void;
}

export default function ErrorToast({ error, onClose }: ErrorToastProps) {
  if (!error) return null;

  return (
    <div className="error-toast">
      <span>{error}</span>
      <button onClick={onClose} aria-label="Dismiss Error">
        &times;
      </button>
    </div>
  );
}
