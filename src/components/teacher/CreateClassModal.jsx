import { X } from "lucide-react";
import { useState } from "react";
import api from "../../services/api";

const CreateClassModal = ({ onClose, onSuccess }) => {
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!className.trim()) {
      setError("Nama kelas wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/classes", {
        className: className.trim(),
      });

      onSuccess?.(data.class);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat kelas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-[28px]">
      <div className="w-full max-w-[360px] rounded-[16px] bg-white px-[22px] pb-[24px] pt-[22px] shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-black">Tambah Kelas</h2>

          <button onClick={onClose} className="text-[#6B7280]">
            <X size={24} />
          </button>
        </div>

        <p className="mt-[8px] text-[13px] font-medium text-[#6B7280]">
          Buat kelas baru untuk mulai monitoring siswa.
        </p>

        <form onSubmit={handleSubmit} className="mt-[20px]">
          <label className="text-[13px] font-semibold text-black">
            Nama Kelas
          </label>

          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Contoh: Math XII A"
            className="mt-[7px] h-[39px] w-full rounded-[8px] border border-[#E5E7EB] px-[13px] text-[14px] font-medium outline-none focus:border-[#651DFF]"
          />

          {error && (
            <p className="mt-[10px] text-[12px] font-medium text-red-500">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="mt-[20px] h-[42px] w-full rounded-[8px] bg-gradient-to-r from-[#981DFF] to-[#5A16E8] text-[15px] font-bold text-white disabled:opacity-50"
          >
            {loading ? "Membuat..." : "Buat Kelas"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;