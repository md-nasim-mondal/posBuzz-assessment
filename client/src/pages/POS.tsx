
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
    <div className="h-[calc(100vh-100px)] flex gap-4">
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
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                className="h-full flex flex-col"
                cover={<div className="h-32 bg-gray-200 flex items-center justify-center text-4xl">📦</div>}
                actions={[
                  <Button
                    type="primary"
                    disabled={product.stockQuantity <= 0}
                    onClick={() => addToCart(product)}
                    className="w-11/12"
                  >
                    {product.stockQuantity > 0 ? 'Add' : 'Out of Stock'}
                  </Button>
                ]}
              >
                <Meta
                  title={product.name}
                  description={
                    <div className="flex justify-between">
                       <Text strong>${Number(product.price).toFixed(2)}</Text>
                       <Text type="secondary">Stock: {product.stockQuantity}</Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white p-4 rounded-lg shadow-md flex flex-col">
        <Title level={4}>Current Sale</Title>
        <List
          className="flex-1 overflow-y-auto"
          itemLayout="horizontal"
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              actions={[
                 <div className="flex items-center gap-1">
                     <Button size="small" icon={<MinusOutlined />} onClick={() => updateQuantity(item.product.id, -1)} disabled={item.quantity <= 1} />
                     <span className="w-6 text-center">{item.quantity}</span>
                     <Button size="small" icon={<PlusOutlined />} onClick={() => updateQuantity(item.product.id, 1)} />
                     <Button size="small" danger onClick={() => removeFromCart(item.product.id)}>x</Button>
                 </div>
              ]}
            >
              <List.Item.Meta
                title={item.product.name}
                description={`$${Number(item.product.price).toFixed(2)} x ${item.quantity}`}
              />
              <div>${(Number(item.product.price) * item.quantity).toFixed(2)}</div>
            </List.Item>
          )}
        />
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-xl font-bold mb-4">
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
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
