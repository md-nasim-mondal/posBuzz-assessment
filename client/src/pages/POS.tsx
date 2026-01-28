
import { useState } from 'react';
import { Card, Button, List, Typography, Row, Col, Input, message } from 'antd';
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

const { Meta } = Card;
const { Text, Title } = Typography;

export default function POSPage() {
  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    },
  });

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
            message.warning('Not enough stock');
            return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item; // or remove? currently keep min 1
          if (newQty > item.product.stockQuantity) {
             message.warning('Not enough stock');
             return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };
      await api.post('/sales', payload);
    },
    onSuccess: () => {
      message.success('Sale completed!');
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Refresh stock
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Checkout failed');
    },
  });

  const filteredProducts = products?.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-4">
      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto pr-2">
        <Input.Search
          placeholder="Search products..."
          className="mb-4"
          size="large"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Row gutter={[16, 16]}>
          {filteredProducts?.map((product: any) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={product.id}>
              <Card
                hoverable
                className="h-full flex flex-col shadow-sm"
                cover={<div className="h-32 bg-gray-100 flex items-center justify-center text-4xl rounded-t-lg">📦</div>}
                actions={[
                  <div className="px-2 w-full">
                    <Button
                      type="primary"
                      disabled={product.stockQuantity <= 0}
                      onClick={() => addToCart(product)}
                      className="w-full"
                    >
                      {product.stockQuantity > 0 ? 'Add' : 'Out'}
                    </Button>
                  </div>
                ]}
              >
                <Meta
                  title={<div className="text-lg font-medium truncate">{product.name}</div>}
                  description={
                    <div className="flex justify-between items-center mt-2">
                       <Text strong className="text-blue-600 text-lg">${Number(product.price).toFixed(2)}</Text>
                       <Text type="secondary" className="text-xs">Stock: {product.stockQuantity}</Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96 bg-white p-4 rounded-lg shadow-md flex flex-col h-[40%] lg:h-auto border-t lg:border-t-0 border-gray-200 flex-shrink-0">
        <Title level={4}>Current Sale</Title>
        <List
          className="flex-1 overflow-y-auto min-h-0" 
          itemLayout="horizontal"
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              actions={[
                 <div className="flex items-center gap-1 mt-2 sm:mt-0">
                     <Button size="small" icon={<MinusOutlined />} onClick={() => updateQuantity(item.product.id, -1)} disabled={item.quantity <= 1} />
                     <span className="w-6 text-center text-sm">{item.quantity}</span>
                     <Button size="small" icon={<PlusOutlined />} onClick={() => updateQuantity(item.product.id, 1)} />
                     <Button size="small" danger icon={<div className="pb-1">x</div>} onClick={() => removeFromCart(item.product.id)} />
                 </div>
              ]}
              className="flex-col sm:flex-row items-start sm:items-center"
            >
              <List.Item.Meta
                title={<span className="text-sm font-medium">{item.product.name}</span>}
                description={<span className="text-xs text-gray-500">{`$${Number(item.product.price).toFixed(2)} x ${item.quantity}`}</span>}
              />
              <div className="font-bold">${(Number(item.product.price) * item.quantity).toFixed(2)}</div>
            </List.Item>
          )}
        />
        
        <div className="border-t pt-4 mt-4 pb-2">
          <div className="flex justify-between text-xl font-bold mb-4 px-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button
            type="primary"
            size="large"
            block
            icon={<ShoppingCartOutlined />}
            disabled={cart.length === 0}
            loading={checkoutMutation.isPending}
            onClick={() => checkoutMutation.mutate()}
            className="mb-1"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
