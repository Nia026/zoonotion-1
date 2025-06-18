import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar"; // pastikan Sidebar juga pakai bootstrap
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

const DashboardAdmin = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => {
        setTotalUser(res.data.length);
        setUserData(res.data);
      })
      .catch(() => {
        setTotalUser(0);
        setUserData([]);
      });
  }, []);

  const activeUsersData = [
    { month: "OCT 2019", value: 35 },
    { month: "NOV", value: 65 },
    { month: "DEC", value: 35 },
    { month: "JAN 2020", value: 45 },
    { month: "FEB", value: 50 },
    { month: "MAR", value: 20 },
    { month: "APR", value: 30 },
    { month: "MAY", value: 55 },
    { month: "JUN", value: 78 },
  ];

  return (
    <div className="container-fluid min-vh-100 p-4">
      <h1 className="mb-5 zoo-main-title">Dashboard</h1>
      
      <div className="row">
        {/* Kolom Kiri: Konten Dashboard */}
        <div className="col-md-7">
          {/* Total Pengguna Aktif */}
          <div className="d-flex align-items-center text-white p-3 rounded mb-4" style={{ backgroundColor: "#a58259" }}>
            <div className="fs-2 me-3">👤</div>
            <div className="fs-3 fw-bold">{totalUser}</div>
            <div className="ms-2 fs-5">Pengguna Aktif</div>
          </div>
  
          {/* Grafik Statistik */}
          <div className="bg-white rounded shadow-sm p-3 mb-4">
            <h5 className="mb-3">Statistik Pengguna Aktif</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activeUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#000" strokeWidth={2} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Kolom Kanan: Tabel User */}
        <div className="col-md-5">
          <div className="bg-white rounded shadow-sm p-3">
            <h5 className="mb-3">Daftar Pengguna</h5>
            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table table-sm table-striped">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((user, idx) => (
                    <tr key={user.id}>
                      <td>{idx + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );    
};

export default DashboardAdmin;
