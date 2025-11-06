export interface ApartmentRequest {
  uid?: string
  price: number
  title: string
  description: string
  addressDivisionUid: string
  areaLength: number
  areaWidth: number
  quantity: number
  floorNumber: number
  totalFloors: number
  type: 'full_apartment' | 'private_room' | 'shared_room'
  status: 'available' | 'rented' | 'maintenance'
  images: string[]
  createdAt?: string
  updatedAt?: string
}


