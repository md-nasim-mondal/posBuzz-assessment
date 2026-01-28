
import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/axios';

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const onFinish = async (values: any) => {
    if (!token) {
        message.error('Invalid token');
        return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { ...values, token });
      message.success(data.message || 'Password reset successfully!');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-96 shadow-lg">
        <div className="text-center mb-6">
          <Title level={3}>Reset Password</Title>
          <Text type="secondary">Enter your new password</Text>
        </div>
        <Form
          name="reset"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="password"
            rules={[
                { required: true, message: 'Please input your new Password!' },
                { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="New Password" size="large" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading} size="large">
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
