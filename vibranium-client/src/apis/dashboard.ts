import axios from "axios";

export interface ThreatType {
  _id: string;
  count: number;
}

export interface DashboardData {
  endpoint_count: number;
  threats_count: number;
  passed_tests_count: number;
  failed_tests_count: number;
  high_severity_threats: number;
  medium_severity_threats: number;
  low_severity_threats: number;
  threast_by_type: ThreatType[];
}

type DashboardOutput =
  | {
      success: false;
    }
  | {
      success: true;
      data: DashboardData;
    };

export async function getDashboardData(): Promise<DashboardOutput> {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/test/dashboard`
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
