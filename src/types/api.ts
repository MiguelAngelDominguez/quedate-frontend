export type RoleName = 'USER' | 'LANDLORD' | 'ADMIN'

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface ErrorResponseDTO {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export interface UserResponseDTO {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  roles: RoleName[]
}

export interface AuthResponseDTO {
  accessToken: string
  refreshToken: string
  userInfo: UserResponseDTO
}

export interface RoomStatus {
  // backend enum string
  value: string
}

export type RoomStatusValue = 'AVAILABLE' | 'UNAVAILABLE' | 'ARCHIVED'

export interface RoomSummaryDTO {
  id: number
  title: string
  price: number
  image?: string
  district?: string
  universityName?: string
  distanceKm?: number
  latitude?: number
  longitude?: number
}

export interface RoomDetailDTO {
  id: number
  title: string
  description?: string
  price: number
  capacity?: number
  sizeM2?: number
  images?: string[]
  status: string
  ownerName?: string
  district?: string
  universityName?: string
  averageRating?: number
  isVerified: boolean
  distanceKm?: number
  latitude?: number
  longitude?: number
}

export interface LocationDTO {
  id: number
  district: string
  address?: string
  latitude?: number
  longitude?: number
  distanceToUniversityKm?: number
}

export interface UniversityDTO {
  id: number
  name: string
  campusName?: string
  address?: string
  latitude?: number
  longitude?: number
  website?: string
}

export interface LandlordResponseDTO {
  id: number
  userId: number
  dni?: string
  bio?: string
  verified: boolean
}

export interface StudentResponseDTO {
  id: number
  userId: number
  dni?: string
  program?: string
  entryYear?: number
  scholarshipCode?: string
}

export type RentalRequestStatusValue = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED'

export interface RentalRequestResponseDTO {
  id: number
  message?: string
  startDate: string
  endDate: string
  status: string
  studentId: number
  roomId: number
  createdAt: string
}

export interface VisitResponseDTO {
  id: number
  scheduledAt: string
  notes?: string
  status: string
  rentalRequestId: number
  createdAt: string
}

export interface ReviewResponseDTO {
  id: number
  rating: number
  comment?: string
  studentId: number
  roomId: number
  createdAt: string
}

export interface RatingSummaryDTO {
  average: number
  count: number
}

export interface VerificationResponseDTO {
  id: number
  type: string
  documentReference: string
  status: string
  landlordId: number
  reviewedById?: number
  reviewedAt?: string
  createdAt: string
}

export interface RoomCreateDTO {
  title: string
  description?: string
  price: number
  capacity?: number
  sizeM2?: number
  images?: string[]
  locationId?: number
  universityId?: number
}

export interface RoomUpdateDTO {
  title?: string
  description?: string
  price?: number
  capacity?: number
  sizeM2?: number
  images?: string[]
  locationId?: number
  universityId?: number
  status?: string
}

export interface PublicationResponseDTO {
  id: number
  roomId: number
  roomTitle: string
  status: string
  publishedAt?: string
  archivedAt?: string
}