import axiosClient from './axiosClient';

export interface Inquiry {
  inquiryNo: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface InquiryPage {
  items: Inquiry[];
  page: number;
  totalPages: number;
  totalElements: number;
}

export const createInquiry = async (title: string, content: string): Promise<Inquiry> => {
  const response = await axiosClient.post<Inquiry>('/inquiries', { title, content });
  return response.data;
};

export const getMyInquiries = async (page: number): Promise<InquiryPage> => {
  const response = await axiosClient.get<InquiryPage>('/inquiries', { params: { page } });
  return response.data;
};
