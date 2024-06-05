import MainLayout from "@/components/main.layout";
import withAuth from "@/hoc/withAuth";

function Storage() {
  return (
    <MainLayout>
      <h1>Storage</h1>
    </MainLayout>
  );
}

export default withAuth(Storage);
