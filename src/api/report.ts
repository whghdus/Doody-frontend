import apiClient from './apiClient';
import { authStorage } from '../utils/authStorage';

export interface ActivitySummary {
  summary: string;
  highlights: string[];
  generatedAt: string;
  source: string;
}

export interface ReportSummary {
  totalRecordCount: number;
  recordedDayCount: number;
  totalPoint: number;
}

export interface AxisSummary {
  axis: string;
  recordCount: number;
}

export interface RecordItem {
  recordId?: number;
  title?: string;
  reward?: number;
  recordDate?: string;
  recordedAt?: string;
  [key: string]: any;
}

export interface RecordGroup {
  axis: string;
  recordCount: number;
  records: RecordItem[];
}

export interface RecoveryReportResponse {
  period: 'month' | 'week';
  periodStart: string;
  periodEnd: string;
  activitySummary: ActivitySummary | null;
  summary: ReportSummary;
  axisSummaries: AxisSummary[];
  recordGroups: RecordGroup[];
}

export interface BackendRecoveryReportResponse {
  status: number;
  isSuccess: boolean;
  message: string;
  result: RecoveryReportResponse;
}

export const reportApi = {
  getRecoveryReport: async (period: 'month' | 'week' = 'month'): Promise<RecoveryReportResponse> => {
    const userId = await authStorage.getToken();
    if (!userId) throw new Error('User ID is not found. Please log in.');

    const response = await apiClient.get<BackendRecoveryReportResponse>(
      `/users/${userId}/reports/recovery`,
      { params: { period } }
    );
    return response.data.result;
  }
};
