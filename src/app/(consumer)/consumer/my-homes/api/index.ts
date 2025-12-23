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

export interface PaymentItem {
    uid: string;
    rentalContractUid: string;

    year: number;
    month: number;

    amount: number;

    isPaid: boolean;
    paidAt: string | null;

    method: string | null;
    note: string | null;

    collectedByUid: string | null;

    createdAt: string;
}
export interface PaymentResponse {
    success: boolean;
    message: string;
    data: PaymentItem[];
}

export class PaymentAPI extends AbstractRestApiClient {
    protected protectedResource = true;
    private base = 'consumer/api/rental-payments';

    getPaymentHistory(): Promise<PaymentResponse> {
        return this.get<PaymentResponse>(this.base);
    }

    getPaymentsByContract(contractUid: string): Promise<PaymentResponse> {
        return this.get<PaymentResponse>(this.base, { contractUid });
    }
}


export const contactAPI = new ContactAPI();
export const contractAPI = new ContractAPI();
export const paymentAPI = new PaymentAPI();