import React, { useState, useEffect } from 'react';
import { getAccountsByRole, updateAdminAccount, deleteAdminAccount, type AccountResponse, type AccountUpdateDTO } from '../services/api';

const AdminAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [service, setService] = useState('');
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<AccountResponse | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<AccountUpdateDTO>({
    fullName: '',
    gender: 'MALE',
    dateOfBirth: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAccountsByRole('ADMIN');
        setAccounts(data);
      } catch (err) {
        setError('Không thể tải danh sách admin. Vui lòng thử lại.');
        console.error('Error fetching admin accounts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(acc =>
    acc.fullName.toLowerCase().includes(search.toLowerCase()) &&
    (service === '' || service === 'All')
  );

  const handleEdit = (account: AccountResponse) => {
    setEditingAccount(account);
    
    // Format dateOfBirth for input[type="date"] (YYYY-MM-DD)
    let formattedDate = '';
    if (account.dateOfBirth) {
      const date = new Date(account.dateOfBirth);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0];
      }
    }
    
    setEditForm({
      fullName: account.fullName,
      gender: account.gender || 'MALE',
      dateOfBirth: formattedDate,
      phone: account.phone || '',
      address: account.address || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa admin này?')) {
      try {
        await deleteAdminAccount(id);
        setAccounts(accounts.filter(acc => acc.id !== id));
        alert('Xóa admin thành công!');
      } catch (err) {
        alert('Lỗi khi xóa admin. Vui lòng thử lại.');
        console.error('Error deleting admin:', err);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editingAccount) return;
    
    try {
      console.log('Sending update data:', editForm);
      
      // Validate required fields
      if (!editForm.fullName || !editForm.phone || !editForm.address) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }
      
      if (!editForm.dateOfBirth) {
        alert('Vui lòng chọn ngày sinh');
        return;
      }
      
      // Format date to backend format (yyyy-mm-dd)
      const formattedData = {
        ...editForm,
        dateOfBirth: editForm.dateOfBirth.includes('T') 
          ? editForm.dateOfBirth.split('T')[0] 
          : editForm.dateOfBirth
      };
      
      console.log('Formatted data:', formattedData);
      
      await updateAdminAccount(formattedData);
      
      // Refresh the accounts list
      const data = await getAccountsByRole('ADMIN');
      setAccounts(data);
      setShowEditModal(false);
      setEditingAccount(null);
      alert('Cập nhật admin thành công!');
    } catch (err: any) {
      console.error('Full error details:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = 'Lỗi khi cập nhật admin. Vui lòng thử lại.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Bạn không có quyền cập nhật thông tin này.';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách Admin</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          className="border rounded px-3 py-2"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tìm theo dịch vụ..."
          className="border rounded px-3 py-2"
          value={service}
          onChange={e => setService(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Tên</th>
              <th className="px-4 py-2 text-left">Giới tính</th>
              <th className="px-4 py-2 text-left">Ngày sinh</th>
              <th className="px-4 py-2 text-left">Số điện thoại</th>
              <th className="px-4 py-2 text-left">Địa chỉ</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredAccounts.map(acc => (
                <tr key={acc.id} className="border-b">
                  <td className="px-4 py-2">{acc.fullName}</td>
                  <td className="px-4 py-2">{acc.gender === 'MALE' ? 'Nam' : acc.gender === 'FEMALE' ? 'Nữ' : '-'}</td>
                  <td className="px-4 py-2">{acc.dateOfBirth ? new Date(acc.dateOfBirth).toLocaleDateString('vi-VN') : '-'}</td>
                  <td className="px-4 py-2">{acc.phone || '-'}</td>
                  <td className="px-4 py-2">{acc.address || '-'}</td>
                  <td className="px-4 py-2 space-x-2">
                    {(() => {
                      const savedUser = localStorage.getItem('nvh_user');
                      if (savedUser) {
                        const currentUser = JSON.parse(savedUser);
                        const normalizedRole = currentUser.role?.toUpperCase();
                        
                        return (
                          <>
                            {/* Admin can only edit their own profile */}
                            {normalizedRole === 'ADMIN' && currentUser.email === acc.email && (
                              <button 
                                onClick={() => handleEdit(acc)}
                                className="px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                              >
                                Sửa
                              </button>
                            )}
                            
                            {/* Admin can delete other admins */}
                            {normalizedRole === 'ADMIN' && currentUser.email !== acc.email && (
                              <button 
                                onClick={() => handleDelete(acc.id)}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Xóa
                              </button>
                            )}
                          </>
                        );
                      }
                      return null;
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Sửa thông tin Admin</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Giới tính</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({...editForm, gender: e.target.value as 'MALE' | 'FEMALE'})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex space-x-2 mt-6">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Lưu
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccountsPage;
