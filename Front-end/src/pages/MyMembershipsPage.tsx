import React, { useEffect, useState } from 'react';
import { getMyMemberships, type MembershipDTO } from '../services/api';

const MyMembershipsPage: React.FC = () => {
  console.log('MyMembershipsPage component is rendering!');
  const [memberships, setMemberships] = useState<MembershipDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        console.log('Fetching memberships data...');
        const data = await getMyMemberships();
        console.log('Memberships data received:', data);
        setMemberships(data);
      } catch (error) {
        console.error('Failed to fetch memberships:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberships();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Thẻ thành viên của tôi</h1>
      {memberships.length === 0 ? (
        <div className="text-center text-gray-500">Bạn chưa có thẻ thành viên nào.</div>
      ) : (
        <div className="space-y-6">
          {memberships.map((m) => (
            <div key={m.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="text-lg font-semibold text-primary-700">{m.planName}</div>
                  <div className="text-sm text-gray-500">Thời hạn: {m.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Ngày kích hoạt: {new Date(m.activatedAt).toLocaleDateString('vi-VN')}</div>
                  <div className="text-sm text-gray-600">Ngày hết hạn: {new Date(m.expiredAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              <div className="mt-2 text-gray-700">{m.description}</div>
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {m.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã hết hạn'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMembershipsPage;
