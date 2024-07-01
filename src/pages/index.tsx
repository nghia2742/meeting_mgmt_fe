import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Home() {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/dashboard");
  }, []);
  return (
    <></>
  );
}

export default Home;
