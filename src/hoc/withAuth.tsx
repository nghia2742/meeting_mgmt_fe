import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuthStore from "../stores/authStore";
import ClipLoader from "react-spinners/ClipLoader";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthWrappedComponent: React.FC<P> = (props) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace("/auth/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return (
        <div className='w-full h-full min-h-sceen flex justify-center items-center'>
          <ClipLoader color='#36d7b7' />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthWrappedComponent;
};

export default withAuth;
