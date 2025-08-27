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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải danh sách member...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                  Quản lý Member
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Quản lý tài khoản thành viên</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Floating background shapes */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-purple-400 bg-opacity-20 rounded-full blur-2xl animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-pink-400 bg-opacity-20 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                Quản lý Member
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Quản lý tài khoản thành viên hệ thống</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Tổng member: {accounts.length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Đang hiển thị: {filteredAccounts.length}</span>
                </div>
              </div>
            </div>
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
                      className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Tạo Member Mới</span>
                      </div>
                    </button>
                  );
                }
              }
              return null;
            })()}
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
                  placeholder="Nhập tên member..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lọc theo dịch vụ</label>
              <select
                value={service}
                onChange={e => setService(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Tất cả dịch vụ</option>
                <option value="Fitness">Fitness</option>
                <option value="Yoga">Yoga</option>
              </select>
            </div>
          </div>
        </div>

        {/* Member Cards Grid */}
        {filteredAccounts.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy member nào</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map(acc => {
              const savedUser = localStorage.getItem('nvh_user');
              const currentUser = savedUser ? JSON.parse(savedUser) : null;
              const normalizedRole = currentUser?.role?.toUpperCase();
              const isCurrentUser = currentUser?.email === acc.email;
              const canEdit = normalizedRole === 'MEMBER' && isCurrentUser;
              const canDelete = normalizedRole === 'STAFF' || normalizedRole === 'ADMIN';

              return (
                <div key={acc.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{acc.fullName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                              Member
                            </span>
                            {isCurrentUser && (
                              <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full font-medium">
                                Tài khoản của bạn
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(acc)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
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
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="font-semibold text-gray-900 text-sm truncate max-w-[150px]" title={acc.email}>
                        {acc.email}
                      </span>
                    </div>
                    
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
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dịch vụ:</span>
                      <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-md font-medium">
                        Fitness/Yoga
                      </span>
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Chỉnh sửa thông tin Member
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAccount(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên *</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính *</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({...editForm, gender: e.target.value as 'MALE' | 'FEMALE'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh *</label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CCCD *</label>
                  <input
                    type="text"
                    value={editForm.cccd}
                    onChange={(e) => setEditForm({...editForm, cccd: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Số căn cước công dân"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ *</label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAccount(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Tạo tài khoản Member mới
                </h3>
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
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email người tạo *</label>
                  <input
                    type="email"
                    value={createForm.emailOwner}
                    onChange={(e) => setCreateForm({...createForm, emailOwner: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Email của bạn"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên *</label>
                  <input
                    type="text"
                    value={createForm.fullName}
                    onChange={(e) => setCreateForm({...createForm, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu *</label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CCCD *</label>
                  <input
                    type="text"
                    value={createForm.cccd}
                    onChange={(e) => setCreateForm({...createForm, cccd: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="12 chữ số"
                    maxLength={12}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giới tính *</label>
                  <select
                    value={createForm.gender}
                    onChange={(e) => setCreateForm({...createForm, gender: e.target.value as 'MALE' | 'FEMALE'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh *</label>
                  <input
                    type="date"
                    value={createForm.dateOfBirth}
                    onChange={(e) => setCreateForm({...createForm, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="0xxxxxxxxx"
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ *</label>
                  <textarea
                    value={createForm.address}
                    onChange={(e) => setCreateForm({...createForm, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
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
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateAccount}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  Tạo tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberAccountsPage;
