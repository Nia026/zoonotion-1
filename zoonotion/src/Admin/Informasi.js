import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Informasi() {
  return (
    <div className="container min-vh-100 bg-light py-5">
      <div className="table-responsive">
        <table className="table table-bordered table-striped bg-white shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Nama</th>
              <th>Role</th>
              <th>ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Asep Yudistira</td>
              <td>Manager</td>
              <td>22051214029</td>
              <td>Aktif</td>
            </tr>
            <tr>
              <td>Aldolf Hitler</td>
              <td>Marketing</td>
              <td>22051214029</td>
              <td>Aktif</td>
            </tr>
            <tr>
              <td>Shawn Mendes</td>
              <td>Maintenance</td>
              <td>22051214029</td>
              <td>Aktif</td>
            </tr>
            <tr>
              <td>Juliana Winata</td>
              <td>Marketing</td>
              <td>22051214029</td>
              <td>Aktif</td>
            </tr>
            <tr>
              <td>Michael Owen</td>
              <td>Desainer</td>
              <td>22051214029</td>
              <td>Aktif</td>
            </tr>
            <tr>
              <td>Anastasia Adeline</td>
              <td>Web Development</td>
              <td>22051214029</td>
              <td>Aktif</td>
            </tr>
            <tr>
              <td>Cristiano Ronaldo</td>
              <td>Desainer</td>
              <td>22051214029</td>
              <td>Aktif</td>
            </tr>
            <tr>
              <td>Albert Einstein</td>
              <td>Marketing</td>
              <td>22051214029</td>
              <td>Aktif</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button className="page-link">&lt;</button>
          </li>
          <li className="page-item active">
            <button className="page-link">1</button>
          </li>
          <li className="page-item">
            <button className="page-link">2</button>
          </li>
          <li className="page-item">
            <button className="page-link">3</button>
          </li>
          <li className="page-item">
            <button className="page-link">4</button>
          </li>
          <li className="page-item">
            <button className="page-link">&gt;</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
