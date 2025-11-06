export enum ApartmentType {
  FULL_APARTMENT = 'full_apartment',
  PRIVATE_ROOM = 'private_room',
  SHARED_ROOM = 'shared_room',
}

export enum ApartmentStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
}

export const ApartmentTypeLabels: Record<ApartmentType, string> = {
  [ApartmentType.FULL_APARTMENT]: 'Căn hộ nguyên căn',
  [ApartmentType.PRIVATE_ROOM]: 'Phòng riêng',
  [ApartmentType.SHARED_ROOM]: 'Phòng chung',
}

export const ApartmentStatusLabels: Record<ApartmentStatus, string> = {
  [ApartmentStatus.AVAILABLE]: 'Có sẵn',
  [ApartmentStatus.RENTED]: 'Đã cho thuê',
  [ApartmentStatus.MAINTENANCE]: 'Đang bảo trì',
}

export const apartmentTypeOptions = Object.entries(ApartmentTypeLabels).map(([value, label]) => ({
  value,
  label,
}))

export const apartmentStatusOptions = Object.entries(ApartmentStatusLabels).map(([value, label]) => ({
  value,
  label,
}))
