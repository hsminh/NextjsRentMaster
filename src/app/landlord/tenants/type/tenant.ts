export interface Consumer {
  gmail: string;
  password: string;
  Status: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string | null;
  isVerified: boolean;
  uid: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  isDelete: boolean;
}

export interface RealEstateUnit {
  landlordUid: string;
  price: number;
  pid: string;
  title: string;
  description: string;
  addressDivisionUid: string | null;
  areaLength: number;
  areaWidth: number;
  provinceDivisionUid: string;
  wardDivisionUid: string;
  streetUid: string;
  metaData: string;
  totalFloors: number | null;
  type: string;
  status: string;
  images: string[];
  province: string | null;
  ward: string | null;
  street: string | null;
  roomNumber?: string;
  uid: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  isDelete: boolean;
}

export interface TenantRequest {
  uid: string;
  status: string;
  type: string;
  createdAt: string;
  consumer: Consumer;
  realEstateUnit: RealEstateUnit;
}

export interface TenantFormValues {
  status: string;
  type: string;
  consumer: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  realEstateUnit: {
    title: string;
    price: number;
    type: string;
    status: string;
  };
}

export const tenantStatusOptions = [
  { value: 'Pending', label: 'Đang chờ' },
  { value: 'Approved', label: 'Đã duyệt' },
  { value: 'Rejected', label: 'Từ chối' },
];

export const tenantTypeOptions = [
  { value: 'FullApartment', label: 'Toàn bộ căn hộ' },
  { value: 'Room', label: 'Phòng trọ' },
  { value: 'SharedRoom', label: 'Phòng ghép' },
];
