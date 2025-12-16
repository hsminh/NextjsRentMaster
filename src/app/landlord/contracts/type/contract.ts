export interface ContractRequest {
  uid?: string;
  consumerUid: string;
  apartmentUid: string;
  type: 'RoomBased' | 'FullApartment';
  responsibleUid: string;
  participantUids: string[];
  monthlyPrice: number;
  depositAmount: number;
  startDate: string;
  endDate: string;
  isPayment?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  isDelete?: boolean;
}

export const contractTypeOptions = [
  { value: 'RoomBased', label: 'Phòng trọ' },
  { value: 'FullApartment', label: 'Toàn bộ căn hộ' },
];
