import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar"; // import Sidebar
import "./DashboardAdmin.css";

const DashboardAdmin = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(res => {
        setTotalUser(res.data.length);
        setUserData(res.data);
      })
      .catch(() => {
        setTotalUser(0);
        setUserData([]);
      });
  }, []);

  const activeUsersData = [
    { month: "OCT 2019", percentage: 20 },
    { month: "NOV", percentage: 30 },
    { month: "DEC", percentage: 40 },
    { month: "JAN 2020", percentage: 50 },
    { month: "FEB", percentage: 60 },
    { month: "MAR", percentage: 70 },
    { month: "APR", percentage: 80 },
    { month: "MAY", percentage: 70 },
    { month: "JUN", percentage: 60 },
  ];

  return (
    <div className="dashboard-admin" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px" }}>
        <h1>DASHBOARD</h1>

        <div className="total-user-box" style={{ marginBottom: "24px", padding: "16px", background: "#f5f5f5", borderRadius: "8px", textAlign: "center" }}>
          <h2>Total User Terdaftar: {totalUser}</h2>
        </div>

        <div className="divider"></div>

        <div className="active-users-section">
          <h3>Pengguna Aktif</h3>
          <div className="chart-container">
            <div className="percentage-axis">
              {[80, 70, 60, 50, 40, 30, 20, 10, 0].map((num) => (
                <div key={num} className="percentage-label">{num}%</div>
              ))}
            </div>
            <div className="chart">
              {activeUsersData.map((data, index) => (
                <div key={index} className="bar-container">
                  <div
                    className="bar"
                    style={{ height: `${data.percentage}%` }}
                  ></div>
                  <div className="month-label">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="user-table-section">
          <table>
            <thead>
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

        <div className="footer" style={{ marginTop: "32px" }}>
          <p>Made with 🍀 by Unotopia Team</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;