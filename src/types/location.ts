export interface HauntedLocation {
  id: string;
  name: string;
  description: string;
  position: {
    latitude: number;
    longitude: number;
  };
  averageRating?: number;
  totalReviews?: number;
  totalSaves?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationReview {
  id: string;
  locationId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSave {
  id: string;
  locationId: string;
  userId: string;
  createdAt: string;
}
