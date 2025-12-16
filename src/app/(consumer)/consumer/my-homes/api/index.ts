import AbstractRestApiClient from '@/app/utils/api/base-api-client';
import { ApartmentRequest } from '@/app/landlord/apartments/type/apartment';
import { ApartmentRoomRequest } from '@/app/landlord/rooms/type/apartment';
export interface JoinApartmentPayload {
    LandlordUid: string;
    ApartmentUid: string;
    Type: string;
}

export interface JoinResponse {
    success: boolean;
    message?: string;
}

export interface MyRental {
    uid: string;
    status: string;
    type: 'FullApartment' | 'RoomBased';
    createdAt: string;
    consumer: {
        gmail: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        uid: string;
    };
    realEstateUnit: {
        uid: string;
        title: string;
        description: string;
        price: number;
        images: string[];
        status: string;
    };
}

export class ContactAPI extends AbstractRestApiClient {
    protected protectedResource = true;
    private base = 'consumer/api/contact';

    join(payload: JoinApartmentPayload): Promise<JoinResponse> {
        return this.post<JoinResponse>(`${this.base}/join`, undefined, payload);
    }

    getMyRentals(): Promise<MyRental[]> {
        return this.get<MyRental[]>(`${this.base}/my-rentals`);
    }
}


export interface MyContract {
    uid: string;
    consumerUid: string;
    landlordUid: string;
    apartmentUid: string;
    type: 'FullApartment' | 'RoomBased';
    responsibleUid: string;
    participantUids: string[];
    monthlyPrice: number;
    depositAmount: number;
    startDate: string;
    endDate: string;
    isPayment?: boolean;
    status: string;
    createdAt: string;
    apartmentDetails: {
        uid: string;
        title: string;
        description: string;
        price: number;
        images: string[];
        status: string;
        totalFloors: number;
        areaLength: number;
        areaWidth: number;
        type: string;
    };
}

export class ContractAPI extends AbstractRestApiClient {
    protected protectedResource = true;
    private base = 'consumers/api/contracts';

    getContracts(): Promise<MyContract[]> {
        return this.get<MyContract[]>(this.base);
    }

    getContractById(contractUid: string): Promise<MyContract> {
        return this.get<MyContract>(`${this.base}/${contractUid}`);
    }
}

export interface PaymentHistory {
    uid: string;
    contractUid: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: 'Pending' | 'Paid' | 'Overdue';
    paymentMethod?: string;
    notes?: string;
    createdAt: string;
}

export class PaymentAPI extends AbstractRestApiClient {
    protected protectedResource = true;
    private base = 'consumers/api/payments';

    getPaymentHistory(): Promise<PaymentHistory[]> {
        return this.get<PaymentHistory[]>(this.base);
    }

    getPaymentsByContract(contractUid: string): Promise<PaymentHistory[]> {
        return this.get<PaymentHistory[]>(`${this.base}`, { contractUid });
    }
}

export const contactAPI = new ContactAPI();
export const contractAPI = new ContractAPI();
export const paymentAPI = new PaymentAPI();