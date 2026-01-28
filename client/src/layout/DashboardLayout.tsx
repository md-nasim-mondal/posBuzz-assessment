
import { useState } from 'react';
import { Layout, Menu, Button, theme, Grid, Drawer, Popover, Avatar, Typography } from 'antd'; // Added Popover, Avatar, Typography
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  
  const isMobile = screens.lg === false;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user?.name 
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const profileContent = (
    <div className="w-64">
      <div className="flex flex-col items-center p-4 border-b border-gray-100">
        <Avatar size={64} style={{ backgroundColor: '#1890ff', fontSize: '24px' }}>
          {userInitials}
        </Avatar>
        <Title level={4} style={{ marginTop: '16px', marginBottom: '4px' }}>
          {user?.name || 'User'}
        </Title>
        <Text type="secondary">{user?.email || 'email@example.com'}</Text>
      </div>
      <div className="p-2">
        <Button type="text" danger block icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );

  const menuItems = [
    {
      key: '/pos',
      icon: <ShoppingOutlined />,
      label: 'Point of Sale',
    },
    {
      key: '/products',
      icon: <AppstoreOutlined />,
      label: 'Products Management',
    },
  ];

  const SidebarContent = (
    <>
      <div className="flex items-center justify-center p-4 border-b border-gray-700">
           <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
              <ShoppingOutlined style={{ fontSize: '24px', color: 'white' }} />
           </div>
           <div className="text-white text-xl font-bold tracking-wide">POSBuzz</div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
        onClick={({ key }) => {
          navigate(key);
          if (isMobile) setMobileMenuOpen(false);
        }}
        className="mt-4 border-none"
        items={menuItems}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          }}
          theme="dark"
          trigger={null}
        >
          {SidebarContent}
        </Sider>
      )}

      <Drawer
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{ body: { padding: 0, backgroundColor: '#001529' } }}
        width={250}
        closeIcon={null} 
      >
        <div className="h-full relative text-white">
           {SidebarContent}
           <div className="absolute bottom-4 w-full px-4">
             <Button 
                type="primary" 
                danger 
                icon={<LogoutOutlined />} 
                block 
                onClick={handleLogout}
             >
                Logout
             </Button>
            </div>
        </div>
      </Drawer>

      <Layout style={{ marginLeft: isMobile ? 0 : 200, transition: 'all 0.2s' }}>
        <Header 
            style={{ 
                padding: isMobile ? '0 12px' : '0 24px', 
                background: colorBgContainer, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', 
                zIndex: 900,
                position: 'sticky', 
                top: 0
            }}
        >
           {isMobile ? (
             <Button 
               type="text" 
               icon={<MenuOutlined />} 
               onClick={() => setMobileMenuOpen(true)}
               style={{ fontSize: '18px', width: 46, height: 46 }}
             />
           ) : <div />} 

           <div className="flex items-center gap-2 sm:gap-4">
               <span className="text-gray-500 hidden sm:block">Welcome, {user?.name || 'User'}</span>
               <Popover 
                 content={profileContent} 
                 trigger="click" 
                 open={openProfile} 
                 onOpenChange={setOpenProfile}
                 placement="bottomRight"
                 arrow={false}
               >
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 cursor-pointer hover:bg-blue-200 transition-colors">
                    {userInitials}
                 </div>
               </Popover>
           </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Outlet />
          </div>
          <div className="text-center text-gray-400 mt-8 mb-4">
            POSBuzz ©2026 Created by Nasim
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
