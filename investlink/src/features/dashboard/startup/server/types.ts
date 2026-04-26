export interface KpiCardVm {
    label: string;
    value: string;
    badge: string;
  }
  
  export interface InvestorVm {
    id: string;
    name: string;
    organization: string;
    amount: string;
    equity: string;
  }
  
  export interface ExpertVm {
    id: string;
    name: string;
    role: string;
    paid: string;
    projects: number;
  }
  
  export interface InvestmentVm {
    id: string;
    investor: string;
    amount: string;
    date: string;
    status: string;
  }
  
  export interface DashboardVm {
    profile: {
      companyName: string;
      initials: string;
    };
    kpis: KpiCardVm[];
    investors: InvestorVm[];
    experts: ExpertVm[];
    investments: InvestmentVm[];
  }