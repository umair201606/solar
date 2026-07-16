import MediaManager from "../../pages/admin/MediaManager";

export default function MediaPickerModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#041a12]">Select Media</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          <MediaManager
            isModalMode
            onSelect={(file) => {
              onSelect(file);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
