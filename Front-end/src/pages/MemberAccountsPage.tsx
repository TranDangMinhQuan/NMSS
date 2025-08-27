import React, { useState, useEffect } from 'react';
import { getAccountsByRole, updateMemberProfile, deleteMemberAccount, createAccount, type AccountResponse, type AccountProfileDTO, type AccountCreateDTO } from '../services/api';

const MemberAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [service, setService] = useState('');
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<AccountResponse | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<AccountProfileDTO>({
    fullName: '',
    email: '',
    gender: 'MALE',
    dateOfBirth: '',
    cccd: '',
    phone: '',
    address: ''
  });
  
  // Create account modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<AccountCreateDTO>({
    subject: 'Tạo tài khoản Member mới',
    emailOwner: '',
    email: '',
    password: '',
    cccd: '',
    fullName: '',
    gender: 'MALE',
    role: 'MEMBER',
    bloodTypeId: 1, // Default blood type
    dateOfBirth: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAccountsByRole('MEMBER');
        setAccounts(data);
      } catch (err) {
        setError('Không thể tải danh sách member. Vui lòng thử lại.');
        console.error('Error fetching member accounts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(acc =>
    acc.fullName.toLowerCase().includes(search.toLowerCase()) &&
    (service === '' || service === 'Fitness' || service === 'Yoga')
  );

  const handleEdit = (account: AccountResponse) => {
    // Check if current user can edit this account
    const savedUser = localStorage.getItem('nvh_user');
    if (savedUser) {
      const currentUser = JSON.parse(savedUser);
      const normalizedRole = currentUser.role?.toUpperCase();
      
      // Members can only edit their own profile
      if (normalizedRole === 'MEMBER' && currentUser.email !== account.email) {
        alert('Bạn chỉ có thể chỉnh sửa thông tin của chính mình.');
        return;
      }
      
      // Staff and Admin cannot edit member profiles from this page
      if (normalizedRole === 'STAFF' || normalizedRole === 'ADMIN') {
        alert('Staff và Admin không thể chỉnh sửa thông tin member. Member cần tự chỉnh sửa thông tin của mình.');
        return;
      }
    }
    
    setEditingAccount(account);
    setEditForm({
      fullName: account.fullName,
      email: account.email,
      gender: account.gender || 'MALE', // Fix TypeScript error
      dateOfBirth: account.dateOfBirth ? account.dateOfBirth.split('T')[0] : '',
      cccd: '', // CCCD not available in AccountResponse
      phone: account.phone || '',
      address: account.address || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa member này?')) {
      try {
        await deleteMemberAccount(id);
        setAccounts(accounts.filter(acc => acc.id !== id));
        alert('Xóa member thành công!');
      } catch (err) {
        alert('Lỗi khi xóa member. Vui lòng thử lại.');
        console.error('Error deleting member:', err);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editingAccount) return;
    
    try {
      console.log('=== MEMBER UPDATE ATTEMPT ===');
      console.log('Editing Account ID:', editingAccount.id);
      console.log('Original Account Data:', editingAccount);
      console.log('Form Data:', editForm);
      
      // Validate required fields
      if (!editForm.fullName || !editForm.phone || !editForm.address || !editForm.email) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Email, SĐT, Địa chỉ)');
        return;
      }
      
      if (!editForm.cccd) {
        alert('Vui lòng nhập CCCD');
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
      
      console.log('Final formatted data to send:', JSON.stringify(formattedData, null, 2));
      
      // Check current user role and permissions
      const savedUser = localStorage.getItem('nvh_user');
      let currentUser = null;
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('Current user attempting update:', {
          email: currentUser.email,
          role: currentUser.role,
          isUpdatingOwnProfile: currentUser.email === editingAccount.email,
          targetMemberEmail: editingAccount.email
        });
        
        // Remove duplicate check - will be handled below with normalized role
        
        // Normalize role to uppercase for comparison
        const normalizedRole = currentUser.role?.toUpperCase();
        
        // Debug role validation
        console.log('Role validation check:', {
          originalRole: currentUser.role,
          normalizedRole: normalizedRole,
          isValidRole: ['MEMBER', 'ADMIN', 'STAFF'].includes(normalizedRole)
        });
        
        // Warning for cross-role updates
        if (!['MEMBER', 'ADMIN', 'STAFF'].includes(normalizedRole)) {
          console.error('Invalid role detected:', currentUser.role);
          alert(`Vai trò không hợp lệ: "${currentUser.role}". Chỉ MEMBER, ADMIN, hoặc STAFF mới có thể thực hiện cập nhật.`);
          return;
        }
        
        // Update role checks to use normalized role
        if (normalizedRole === 'MEMBER' && currentUser.email !== editingAccount.email) {
          alert('Bạn chỉ có thể chỉnh sửa thông tin của chính mình.');
          return;
        }
      } else {
        alert('Vui lòng đăng nhập để thực hiện thao tác này.');
        return;
      }
      
      const updateResult = await updateMemberProfile(formattedData);
      console.log('Update result:', updateResult);
      
      // Refresh the accounts list to verify changes
      console.log('Refreshing member list to verify update...');
      const data = await getAccountsByRole('MEMBER');
      setAccounts(data);
      
      // Find the updated account to verify changes
      const updatedAccount = data.find(acc => acc.id === editingAccount.id);
      if (updatedAccount) {
        console.log('Updated account data:', updatedAccount);
        console.log('Changes verification:', {
          nameChanged: updatedAccount.fullName !== editingAccount.fullName,
          phoneChanged: updatedAccount.phone !== editingAccount.phone,
          addressChanged: updatedAccount.address !== editingAccount.address
        });
      }
      
      setShowEditModal(false);
      setEditingAccount(null);
      alert('Cập nhật member thành công!');
    } catch (err: any) {
      console.error('=== UPDATE MEMBER ERROR ===');
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      
      let errorMessage = 'Lỗi khi cập nhật member. Vui lòng thử lại.';
      
      if (err.response?.status === 500) {
        if (err.response?.data?.message?.includes('Access Denied')) {
          errorMessage = 'Lỗi quyền truy cập: Bạn không có quyền cập nhật thông tin member này. Vui lòng đăng nhập với tài khoản có quyền phù hợp (ADMIN hoặc STAFF).';
        } else {
          errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        }
      } else if (err.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này. Vui lòng kiểm tra lại quyền truy cập.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (err.response?.status === 400) {
        if (err.response?.data?.message) {
          errorMessage = `Dữ liệu không hợp lệ: ${err.response.data.message}`;
        } else {
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleCreateAccount = async () => {
    try {
      console.log('=== CREATE MEMBER ACCOUNT ===');
      console.log('Form data:', createForm);
      
      // Validate required fields
      if (!createForm.fullName || !createForm.email || !createForm.password || 
          !createForm.cccd || !createForm.phone || !createForm.address || 
          !createForm.dateOfBirth || !createForm.emailOwner) {
        alert('Vui lòng điền đầy đủ tất cả thông tin bắt buộc');
        return;
      }
      
      // Validate CCCD format (12 digits)
      if (!/^\d{12}$/.test(createForm.cccd)) {
        alert('CCCD phải có đúng 12 chữ số');
        return;
      }
      
      // Validate phone format
      if (!/^0\d{9}$/.test(createForm.phone)) {
        alert('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số');
        return;
      }
      
      await createAccount(createForm);
      
      // Refresh the accounts list
      const data = await getAccountsByRole('MEMBER');
      setAccounts(data);
      setShowCreateModal(false);
      
      // Reset form
      setCreateForm({
        subject: 'Tạo tài khoản Member mới',
        emailOwner: '',
        email: '',
        password: '',
        cccd: '',
        fullName: '',
        gender: 'MALE',
        role: 'MEMBER',
        bloodTypeId: 1,
        dateOfBirth: '',
        phone: '',
        address: ''
      });
      
      alert('Tạo tài khoản Member thành công!');
    } catch (err: any) {
      console.error('=== CREATE ACCOUNT ERROR ===');
      console.error('Error:', err);
      
      let errorMessage = 'Lỗi khi tạo tài khoản. Vui lòng thử lại.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Bạn không có quyền tạo tài khoản.';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Danh sách Member</h2>
        {(() => {
          const savedUser = localStorage.getItem('nvh_user');
          if (savedUser) {
            const currentUser = JSON.parse(savedUser);
            const normalizedRole = currentUser.role?.toUpperCase();
            
            // Only ADMIN can create accounts
            if (normalizedRole === 'ADMIN') {
              return (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Tạo account
                </button>
              );
            }
          }
          return null;
        })()}
      </div>
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
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Giới tính</th>
              <th className="px-4 py-2 text-left">Số điện thoại</th>
              <th className="px-4 py-2 text-left">Ngày sinh</th>
              <th className="px-4 py-2 text-left">Địa chỉ</th>
              <th className="px-4 py-2 text-left">Dịch vụ</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredAccounts.map(acc => (
                <tr key={acc.id} className="border-b">
                  <td className="px-4 py-2">{acc.fullName}</td>
                  <td className="px-4 py-2">{acc.email}</td>
                  <td className="px-4 py-2">{acc.gender === 'MALE' ? 'Nam' : 'Nữ'}</td>
                  <td className="px-4 py-2">{acc.phone || 'N/A'}</td>
                  <td className="px-4 py-2">
                    {acc.dateOfBirth ? new Date(acc.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-4 py-2">{acc.address || 'N/A'}</td>
                  <td className="px-4 py-2">Fitness/Yoga</td>
                  <td className="px-4 py-2 space-x-2">
                    {(() => {
                      const savedUser = localStorage.getItem('nvh_user');
                      if (savedUser) {
                        const currentUser = JSON.parse(savedUser);
                        const normalizedRole = currentUser.role?.toUpperCase();
                        
                        return (
                          <>
                            {/* Member can only edit their own profile */}
                            {normalizedRole === 'MEMBER' && currentUser.email === acc.email && (
                              <button 
                                onClick={() => handleEdit(acc)}
                                className="px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                              >
                                Sửa
                              </button>
                            )}
                            
                            {/* Staff can delete members */}
                            {normalizedRole === 'STAFF' && (
                              <button 
                                onClick={() => handleDelete(acc.id)}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Xóa
                              </button>
                            )}
                            
                            {/* Admin can delete members */}
                            {normalizedRole === 'ADMIN' && (
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
            <h3 className="text-lg font-bold mb-4">Chỉnh sửa thông tin Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giới tính *</label>
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
                <label className="block text-sm font-medium mb-1">Ngày sinh *</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CCCD *</label>
                <input
                  type="text"
                  value={editForm.cccd}
                  onChange={(e) => setEditForm({...editForm, cccd: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Số căn cước công dân"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ *</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAccount(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Tạo tài khoản Member mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email người tạo *</label>
                <input
                  type="email"
                  value={createForm.emailOwner}
                  onChange={(e) => setCreateForm({...createForm, emailOwner: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Email của bạn"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                <input
                  type="text"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({...createForm, fullName: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu *</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CCCD *</label>
                <input
                  type="text"
                  value={createForm.cccd}
                  onChange={(e) => setCreateForm({...createForm, cccd: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="12 chữ số"
                  maxLength={12}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giới tính *</label>
                <select
                  value={createForm.gender}
                  onChange={(e) => setCreateForm({...createForm, gender: e.target.value as 'MALE' | 'FEMALE'})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày sinh *</label>
                <input
                  type="date"
                  value={createForm.dateOfBirth}
                  onChange={(e) => setCreateForm({...createForm, dateOfBirth: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0xxxxxxxxx"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ *</label>
                <textarea
                  value={createForm.address}
                  onChange={(e) => setCreateForm({...createForm, address: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({
                    subject: 'Tạo tài khoản Member mới',
                    emailOwner: '',
                    email: '',
                    password: '',
                    cccd: '',
                    fullName: '',
                    gender: 'MALE',
                    role: 'MEMBER',
                    bloodTypeId: 1,
                    dateOfBirth: '',
                    phone: '',
                    address: ''
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateAccount}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Tạo tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberAccountsPage;
