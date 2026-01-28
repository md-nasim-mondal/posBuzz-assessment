
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import api from '../lib/axios';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'info' | 'success' | 'error'>('info');
  const [msg, setMsg] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
        setStatus('error');
        setMsg('Invalid verification link.');
        return;
    }

    const verify = async () => {
        try {
            await api.get(`/auth/verify-email?token=${token}`);
            setStatus('success');
            setMsg('Email verified successfully! You can now login.');
        } catch (error: any) {
            setStatus('error');
            setMsg(error.response?.data?.message || 'Verification failed.');
        }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Result
        status={status}
        title={status === 'success' ? 'Verified!' : status === 'error' ? 'Verification Failed' : 'Verifying...'}
        subTitle={msg}
        icon={status === 'info' ? <LoadingOutlined /> : undefined}
        extra={
            status === 'success' || status === 'error' ? (
                <Button type="primary" onClick={() => navigate('/login')}>
                    Go to Login
                </Button>
            ) : null
        }
      />
    </div>
  );
}
