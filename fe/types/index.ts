export interface Submission {
  id: string;
  submissionCode: string;
  name: string;
  email: string;
  whatsapp: string;
  title: string;
  description: string;
  ktpFilePath: string;
  logoFilePath: string;
  createdAt: string;
}

export interface SubmissionDetail extends Submission {
  ktpFileUrl: string;
  logoFileUrl: string;
}

export interface SubmissionListResponse {
  success: boolean;
  data: {
    submissions: Submission[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SubmissionDetailResponse {
  success: boolean;
  data: SubmissionDetail;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
    };
  };
}

export interface SubmissionCreateResponse {
  success: boolean;
  data: {
    submissionCode: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface DeadlineResponse {
  deadline: string;
  status: 'open' | 'closed';
  remainingDays: number;
  remainingHours: number;
}

export interface VerifyCodeResponse {
  valid: boolean;
  error?: string;
}
