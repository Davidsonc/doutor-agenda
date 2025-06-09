import { Plus } from "lucide-react";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/page-container";
import { Button } from "@/components/ui/button";

const doctorsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>
            <Plus />
            Adicionar médico
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Médicos</h1>
      </PageContent>
    </PageContainer>
  );
};

export default doctorsPage;
