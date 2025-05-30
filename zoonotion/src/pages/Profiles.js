import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk upload foto profil
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");

  // State untuk tambah/edit
  const [form, setForm] = useState({
    user_id: "",
    username: "",
    email: "",
    tanggal_lahir: "",
    alamat: "",
    noted: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/user_profiles")
      .then(res => {
        setProfiles(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Upload foto profil
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (id) => {
    if (!selectedFile) {
      setUploadMsg("Pilih file terlebih dahulu.");
      return;
    }
    const formData = new FormData();
    formData.append("foto_profil", selectedFile);
    try {
      await axios.post(`http://localhost:5000/api/user_profiles/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadMsg("Upload berhasil!");
      setSelectedFile(null);
      setSelectedId(null);
      fetchProfiles();
    } catch {
      setUploadMsg("Upload gagal.");
    }
  };

  // Tambah/Edit user profile
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/user_profiles/${editId}`, form);
        setUploadMsg("Data berhasil diupdate!");
      } else {
        await axios.post("http://localhost:5000/api/user_profiles", form);
        setUploadMsg("Data berhasil ditambah!");
      }
      setForm({ user_id: "", username: "", email: "", tanggal_lahir: "", alamat: "", noted: "" });
      setEditId(null);
      fetchProfiles();
    } catch {
      setUploadMsg("Gagal simpan data.");
    }
  };

  // Hapus user profile
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus data ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/user_profiles/${id}`);
      setUploadMsg("Data berhasil dihapus!");
      fetchProfiles();
    } catch {
      setUploadMsg("Gagal hapus data.");
    }
  };

  // Isi form edit
  const handleEdit = (profile) => {
    setForm({
      user_id: profile.user_id,
      username: profile.username || "",
      email: profile.email || "",
      tanggal_lahir: profile.tanggal_lahir ? profile.tanggal_lahir.substring(0, 10) : "",
      alamat: profile.alamat || "",
      noted: profile.noted || "",
    });
    setEditId(profile.id);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222", marginBottom: 32 }}>Daftar User Profile</h1>
      {uploadMsg && (
        <div style={{ marginBottom: 16, color: uploadMsg.includes("berhasil") ? "#33693C" : "#c00" }}>{uploadMsg}</div>
      )}

      {/* Form tambah/edit */}
      <form onSubmit={handleFormSubmit} style={{ marginBottom: 32, background: "#f4f6f8", padding: 20, borderRadius: 8 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <input type="number" name="user_id" placeholder="User ID" value={form.user_id} onChange={handleFormChange} required style={{ flex: 1, padding: 8 }} />
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleFormChange} style={{ flex: 1, padding: 8 }} />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleFormChange} style={{ flex: 1, padding: 8 }} />
          <input type="date" name="tanggal_lahir" placeholder="Tanggal Lahir" value={form.tanggal_lahir} onChange={handleFormChange} style={{ flex: 1, padding: 8 }} />
          <input type="text" name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleFormChange} style={{ flex: 1, padding: 8 }} />
          <input type="text" name="noted" placeholder="Noted" value={form.noted} onChange={handleFormChange} style={{ flex: 1, padding: 8 }} />
        </div>
        <button type="submit" style={{ marginTop: 16, background: "#33693C", color: "#fff", border: "none", borderRadius: 6, padding: "8px 24px", fontWeight: 600 }}>
          {editId ? "Update" : "Tambah"}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm({ user_id: "", username: "", email: "", tanggal_lahir: "", alamat: "", noted: "" }); }} style={{ marginLeft: 12, background: "#ccc", color: "#222", border: "none", borderRadius: 6, padding: "8px 24px", fontWeight: 600 }}>
            Batal
          </button>
        )}
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : profiles.length === 0 ? (
        <div style={{ color: "#888", fontSize: 18 }}>Belum ada data user profile.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f6f8" }}>
              <th style={{ padding: 10, border: "1px solid #eee" }}>ID</th>
              <th style={{ padding: 10, border: "1px solid #eee" }}>User ID</th>
              <th style={{ padding: 10, border: "1px solid #eee" }}>Username</th>
              <th style={{ padding: 10, border: "1px solid #eee" }}>Email</th>
              <th style={{ padding: 10, border: "1px solid #eee" }}>Tanggal Lahir</th>
              <th style={{ padding: 10, border: "1px solid #eee" }}>Alamat</th>
              <th style={{ padding: 10, border: "1px solid #eee" }}>Foto Profil</th>
              <th style={{ padding: 10, border: "1px solid #eee" }}>Upload Foto</th>
              <th style={{ padding: 10, border: "1px solid #eee" }}>Noted</th>
              <th style={{ padding: 10, border: "1px solid #eee" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(profile => (
              <tr key={profile.id}>
                <td style={{ padding: 10, border: "1px solid #eee" }}>{profile.id}</td>
                <td style={{ padding: 10, border: "1px solid #eee" }}>{profile.user_id}</td>
                <td style={{ padding: 10, border: "1px solid #eee" }}>{profile.username || "-"}</td>
                <td style={{ padding: 10, border: "1px solid #eee" }}>{profile.email || "-"}</td>
                <td style={{ padding: 10, border: "1px solid #eee" }}>{profile.tanggal_lahir ? profile.tanggal_lahir.substring(0, 10) : "-"}</td>
                <td style={{ padding: 10, border: "1px solid #eee" }}>{profile.alamat || "-"}</td>
                <td style={{ padding: 10, border: "1px solid #eee" }}>
                  {profile.foto_profil ? (
                    profile.foto_profil.startsWith("http")
                      ? <img src={profile.foto_profil} alt="foto profil" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                      : <img src={`http://localhost:5000${profile.foto_profil}`} alt="foto profil" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                  ) : "-"}
                </td>
                <td style={{ padding: 10, border: "1px solid #eee" }}>
                  {selectedId === profile.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                      <button
                        onClick={() => handleUpload(profile.id)}
                        style={{ padding: "4px 12px", borderRadius: 6, background: "#33693C", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        Upload
                      </button>
                      <button
                        onClick={() => { setSelectedId(null); setSelectedFile(null); }}
                        style={{ padding: "4px 12px", borderRadius: 6, background: "#ccc", color: "#222", border: "none", cursor: "pointer" }}
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedId(profile.id)}
                      style={{ padding: "4px 12px", borderRadius: 6, background: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}
                    >
                      Ganti Foto
                    </button>
                  )}
                </td>
                <td style={{ padding: 10, border: "1px solid #eee" }}>{profile.noted || "-"}</td>
                <td style={{ padding: 10, border: "1px solid #eee" }}>
                  <button onClick={() => handleEdit(profile)} style={{ marginRight: 8, background: "#ffc107", color: "#222", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(profile.id)} style={{ background: "#c00", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}