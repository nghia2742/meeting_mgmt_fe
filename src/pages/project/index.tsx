import MainLayout from "@/components/main.layout";
import withAuth from "@/hoc/withAuth";

function Project() {
  return (
    <MainLayout>
      <h1>Project</h1>
    </MainLayout>
  );
}

export default withAuth(Project);
