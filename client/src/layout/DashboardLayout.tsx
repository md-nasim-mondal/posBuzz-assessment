
import { useState } from 'react';
import { Layout, Menu, Button, theme, Grid, Drawer } from 'antd'; // Added Grid, Drawer
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

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // screens.lg might be undefined on first render during hydration, so we default to true (desktop) to avoid layout shift,
  // or handle usage carefully. safest is checking !screens.lg for mobile.
  // Note: antd useBreakpoint sometimes returns empty object on initial render.
  const isMobile = screens.lg === false;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        closeIcon={null} // custom styling if needed, or default
      >
        <div className="h-full relative text-white">
           {SidebarContent}
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
               <span className="text-gray-500 hidden sm:block">Welcome, Admin</span>
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                  A
               </div>
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
