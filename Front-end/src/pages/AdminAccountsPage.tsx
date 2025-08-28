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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải danh sách admin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Quản lý Admin
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Quản lý tài khoản admin hệ thống</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800">Lỗi tải dữ liệu</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating background shapes */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-blue-400 bg-opacity-20 rounded-full blur-2xl animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-purple-400 bg-opacity-20 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Quản lý Admin
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Quản lý tài khoản admin hệ thống</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Tổng admin: {accounts.length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Đang hiển thị: {filteredAccounts.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm theo tên</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên admin..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Cards Grid */}
        {filteredAccounts.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy admin nào</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map(acc => {
              const savedUser = localStorage.getItem('nvh_user');
              const currentUser = savedUser ? JSON.parse(savedUser) : null;
              const normalizedRole = currentUser?.role?.toUpperCase();
              const isCurrentUser = currentUser?.email === acc.email;
              const canEdit = normalizedRole === 'ADMIN' && isCurrentUser;
              const canDelete = normalizedRole === 'ADMIN' && !isCurrentUser;

              return (
                <div key={acc.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{acc.fullName}</h3>
                          {isCurrentUser && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              Tài khoản của bạn
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(acc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(acc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Giới tính:</span>
                      <span className="font-semibold text-gray-900">
                        {acc.gender === 'MALE' ? 'Nam' : acc.gender === 'FEMALE' ? 'Nữ' : '-'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ngày sinh:</span>
                      <span className="font-semibold text-gray-900">
                        {acc.dateOfBirth ? new Date(acc.dateOfBirth).toLocaleDateString('vi-VN') : '-'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Số điện thoại:</span>
                      <span className="font-semibold text-gray-900">{acc.phone || '-'}</span>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Địa chỉ:</span>
                      <p className="text-sm text-gray-900 mt-1 break-words">{acc.address || '-'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Modern Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sửa thông tin Admin
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ tên</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập họ tên"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({...editForm, gender: e.target.value as 'MALE' | 'FEMALE'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh</label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccountsPage;
