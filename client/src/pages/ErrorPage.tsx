import { Button, Result } from 'antd';
import { useNavigate, useRouteError } from 'react-router';

export default function ErrorPage() {
  const navigate = useNavigate();
  const error: any = useRouteError();

  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Result
        status="500"
        title="Something went wrong"
        subTitle={error?.statusText || error?.message || "An unexpected error occurred."}
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Back Home
          </Button>
        }
      />
    </div>
  );
}
