
import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', values);
      message.success(data.message || 'Check your email for reset instructions.');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-96 shadow-lg">
        <div className="text-center mb-6">
          <Title level={3}>Forgot Password?</Title>
          <Text type="secondary">Enter your email to reset password</Text>
        </div>
        <Form
          name="forgot"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading} size="large">
              Send Reset Link
            </Button>
          </Form.Item>
          <div className="text-center">
            <Link to="/login">Back to Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
