import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TambahEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [namaKomunitas, setNamaKomunitas] = useState("");
  const [penyelenggara, setPenyelenggara] = useState("");
  const [tahun, setTahun] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [banner, setBanner] = useState(null);

  // Fetch data communities
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/communities")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_komunitas", namaKomunitas);
    formData.append("nama_penyelenggara", penyelenggara);
    formData.append("tahun_penyelenggara", tahun);
    formData.append("deskripsi_komunitas", deskripsi);
    if (banner) formData.append("banner_komunitas", banner);

    try {
      await axios.post("http://localhost:5000/api/communities", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNamaKomunitas("");
      setPenyelenggara("");
      setTahun("");
      setDeskripsi("");
      setBanner(null);
      fetchEvents();
      alert("Event berhasil ditambahkan!");
    } catch (err) {
      alert("Gagal menambah event!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f4f6f8] p-6 md:p-10">
      <div className="max-w-2xl md:max-w-3xl mx-auto bg-white shadow-2xl border p-6 md:p-10 rounded-3xl mb-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-[#33693C] text-center tracking-wide drop-shadow">
          <span className="inline-block border-b-4 border-[#b2dfdb] pb-1">
            Tambah Event Baru
          </span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-base font-semibold text-[#33693C]">
              Nama Event
            </label>
            <input
              type="text"
              value={namaKomunitas}
              onChange={(e) => setNamaKomunitas(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[#b2dfdb] focus:outline-none focus:ring-2 focus:ring-[#33693C] transition shadow-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-base font-semibold text-[#33693C]">
              Nama Penyelenggara
            </label>
            <input
              type="text"
              value={penyelenggara}
              onChange={(e) => setPenyelenggara(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[#b2dfdb] focus:outline-none focus:ring-2 focus:ring-[#33693C] transition shadow-sm"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-base font-semibold text-[#33693C]">
              Tahun Penyelenggara
            </label>
            <input
              type="number"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[#b2dfdb] focus:outline-none focus:ring-2 focus:ring-[#33693C] transition shadow-sm"
              min="1900"
              max="2100"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-base font-semibold text-[#33693C]">
              Deskripsi Event
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-4 py-3 border border-[#b2dfdb] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#33693C] transition shadow-sm"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-base font-semibold text-[#33693C]">
              Banner Event
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBanner(e.target.files[0])}
              className="block"
            />
          </div>
          <button
            type="submit"
            className="bg-[#33693C] hover:bg-[#24512a] text-white px-10 py-3 rounded-full text-lg mt-4 w-full transition font-semibold shadow-lg"
          >
            Simpan Event
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl border p-6 md:p-10 rounded-3xl">
        <h2 className="text-xl font-bold mb-6 text-[#33693C]">
          Daftar Event (Database communities)
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-gray-500">Belum ada event.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f4f6f8]">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Nama Event</th>
                <th className="p-3 border">Penyelenggara</th>
                <th className="p-3 border">Tahun</th>
                <th className="p-3 border">Deskripsi</th>
                <th className="p-3 border">Banner</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td className="p-2 border">{ev.id}</td>
                  <td className="p-2 border">{ev.nama_komunitas}</td>
                  <td className="p-2 border">{ev.nama_penyelenggara || "-"}</td>
                  <td className="p-2 border">
                    {ev.tahun_penyelenggara || "-"}
                  </td>
                  <td className="p-2 border">
                    {ev.deskripsi_komunitas || "-"}
                  </td>
                  <td className="p-2 border">
                    {ev.banner_komunitas ? (
                      <img
                        src={
                          ev.banner_komunitas.startsWith("http")
                            ? ev.banner_komunitas
                            : `http://localhost:5000${ev.banner_komunitas}`
                        }
                        alt="banner"
                        style={{
                          width: 80,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
