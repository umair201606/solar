import { useState, useEffect, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { Image, Video, FileText, Layers, Trash2, Upload, Loader2, Play } from "lucide-react";

const filterTabs = [
  { key: "all", label: "All", icon: Layers },
  { key: "image", label: "Images", icon: Image },
  { key: "video", label: "Videos", icon: Video },
  { key: "document", label: "PDFs", icon: FileText },
];

export default function MediaManager({ onSelect, isModalMode = false }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [filter, setFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [compressEnabled, setCompressEnabled] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await axios.get("/media");
      setMediaFiles(res.data);
    } catch (err) {
      console.error("Failed to load media", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const MAX_SIZE_MB = 20;

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const fileSizeMB = file.size / 1024 / 1024;
      const isImage = file.type.startsWith("image/");

      if (isImage && compressEnabled && fileSizeMB > 1) {
        setUploadStatus(`Compressing ${file.name}...`);
        try {
          file = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
        } catch (err) {
          console.warn("Compression failed", err);
        }
      }

      if (fileSizeMB > MAX_SIZE_MB) {
        alert(`"${file.name}" is ${fileSizeMB.toFixed(1)}MB. Max is 20MB.`);
        continue;
      }

      setUploadStatus(`Uploading ${i + 1}/${files.length}: ${file.name}...`);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post("/media/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMediaFiles((prev) => [res.data, ...prev]);
      } catch (err) {
        console.error("Upload failed", err);
        if (err.response?.status === 413) {
          alert("File too large. Check server limits.");
        }
      }
    }

    setUploading(false);
    setUploadStatus("");
    e.target.value = null;
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this file?")) return;
    try {
      await axios.delete(`/media/${id}`);
      setMediaFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = (file) => {
    if (isModalMode) {
      onSelect(file);
    } else {
      window.open(file.url, "_blank");
    }
  };

  const getFileType = (mime) => {
    if (!mime) return "other";
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.includes("pdf")) return "document";
    return "other";
  };

  const filteredFiles = mediaFiles.filter((file) => {
    const type = getFileType(file.mime_type);
    if (filter === "all") return true;
    return type === filter;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-black text-[#041a12]">Media Library</h2>
        <div className="flex items-center gap-3">
          {/* Compress toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={compressEnabled}
                onChange={(e) => setCompressEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-[#d4ff00] transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
            </div>
            <span className="text-xs font-medium">Compress</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            id="mediaUpload"
            hidden
            multiple
            onChange={handleFileUpload}
            accept="image/*,video/*,.pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#d4ff00] text-[#041a12] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#c5f000] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* Upload status */}
      {uploadStatus && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-xl px-4 py-2 mb-3 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {uploadStatus}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 pb-3">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === tab.key
                  ? "bg-[#041a12] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto bg-white rounded-2xl border border-gray-100 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Image className="w-12 h-12 mb-2 opacity-30" />
            <p className="text-sm">No media files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredFiles.map((file) => {
              const type = getFileType(file.mime_type);
              return (
                <div
                  key={file.id}
                  className="relative group aspect-square bg-gray-50 rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-[#d4ff00] transition-colors"
                  onClick={() => handleItemClick(file)}
                >
                  {type === "image" ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : type === "video" ? (
                    <div className="w-full h-full relative bg-black">
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                        playsInline
                        onLoadedMetadata={(e) => { e.target.currentTime = 1; }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-2">
                      <FileText className="w-10 h-10 text-red-400" />
                      <p className="text-[10px] text-gray-500 mt-1 text-center truncate w-full">{file.name}</p>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-start justify-end p-2">
                    <button
                      onClick={(e) => handleDelete(file.id, e)}
                      className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>

                  {isModalMode && (
                    <div className="absolute inset-x-0 bottom-0 bg-[#d4ff00]/90 text-[#041a12] text-[10px] font-bold text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Select
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
