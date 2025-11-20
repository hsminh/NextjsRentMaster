export interface ApartmentRequest {
  uid?: string
  price: number
  title: string
  description: string
  areaLength: number
  areaWidth: number
  type: 'FullApartment' | 'RoomBased'
  status: 'available' | 'rented' | 'maintenance'
  Files: string[]
  images: string[]
  provinceDivisionUid: string
  wardDivisionUid: string
  MetaData?: string
  metaData?: string
}


