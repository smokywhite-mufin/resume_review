interface DeletePopUpProps {
  title: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeletePopUp({
  title,
  onConfirm,
  onClose,
}: DeletePopUpProps) {
  const handleClickBg = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      onClick={handleClickBg}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center px-12 py-11 bg-surface rounded-2xl">
        <h1 className="text-base font-medium mb-4">{title}</h1>
        <button
          className="px-28 py-3 bg-danger text-surface rounded-lg mb-2 font-medium cursor-pointer hover:bg-danger/90 transition-colors"
          onClick={onConfirm}
        >
          삭제
        </button>
        <button
          className="px-28 py-3 border border-border rounded-lg text-ink-muted font-medium cursor-pointer hover:bg-canvas transition-colors"
          onClick={onClose}
        >
          취소
        </button>
      </div>
    </div>
  );
}
