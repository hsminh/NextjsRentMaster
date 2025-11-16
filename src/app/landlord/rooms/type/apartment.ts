export interface ApartmentRoomRequest {
  uid?: string
  apartmentUid: string
  price: number
  description: string
  areaLength: number
  areaWidth: number
  status: 'available' | 'rented' | 'maintenance'
  Files: string[]
  images: string[]
}


