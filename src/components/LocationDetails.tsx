"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HauntedLocation, LocationReview } from "@/types/location";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Skull,
  Heart,
  MessageCircle,
  MapPin,
  ArrowLeft,
  Send,
  Navigation,
  Eye,
  Trash2,
} from "lucide-react";

interface LocationDetailsProps {
  location: HauntedLocation;
  onBack: () => void;
  onViewStreetView: (location: HauntedLocation) => void;
  onLocationUpdate?: (updatedLocation: HauntedLocation) => void;
  onSaveStatusChange?: (locationId: string, isSaved: boolean) => void;
}

export default function LocationDetails({
  location: initialLocation,
  onBack,
  onViewStreetView,
  onLocationUpdate,
  onSaveStatusChange,
}: LocationDetailsProps) {
  const [reviews, setReviews] = useState<LocationReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [userExistingReview, setUserExistingReview] =
    useState<LocationReview | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [location, setLocation] = useState<HauntedLocation>(initialLocation);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { user } = useAuth();

  // Update local location when prop changes
  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  // Update location data in both local and parent state
  const updateLocationData = (updates: Partial<HauntedLocation>) => {
    const updatedLocation = { ...location, ...updates };
    setLocation(updatedLocation);

    if (onLocationUpdate) {
      onLocationUpdate(updatedLocation);
    }
  };

  // Helper function to handle different date formats from Firestore
  const formatFirestoreDate = useCallback((dateField: unknown): string => {
    if (!dateField) {
      return new Date().toISOString();
    }

    if (typeof dateField === "string") {
      return dateField;
    } else if (
      dateField &&
      typeof dateField === "object" &&
      "toDate" in dateField &&
      typeof (dateField as { toDate: () => Date }).toDate === "function"
    ) {
      // Firestore Timestamp
      return (dateField as { toDate: () => Date }).toDate().toISOString();
    } else if (dateField instanceof Date) {
      return dateField.toISOString();
    } else {
      return new Date().toISOString();
    }
  }, []);

  // Start editing existing review
  const startEditingReview = () => {
    if (userExistingReview) {
      setUserRating(userExistingReview.rating);
      setUserReview(userExistingReview.comment);
      setIsEditingReview(true);
    }
  };

  // Cancel editing review
  const cancelEditingReview = () => {
    setUserRating(0);
    setUserReview("");
    setIsEditingReview(false);
  };

  // Delete review
  const deleteReview = async () => {
    if (!user || !userExistingReview) {
      return;
    }

    if (!confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      // Delete review from Firestore
      await deleteDoc(doc(db, "reviews", userExistingReview.id));

      // Update location aggregates
      const currentTotal = location.totalReviews || 1;
      const currentAverage = location.averageRating || 0;
      const newTotal = Math.max(0, currentTotal - 1);

      if (newTotal === 0) {
        // No more reviews, reset average to 0
        await updateDoc(doc(db, "locations", location.id), {
          averageRating: 0,
          totalReviews: 0,
        });

        // Update local state immediately
        updateLocationData({
          averageRating: 0,
          totalReviews: 0,
        });
      } else {
        // Recalculate average without the deleted review
        const newAverage =
          (currentAverage * currentTotal - userExistingReview.rating) /
          newTotal;

        await updateDoc(doc(db, "locations", location.id), {
          averageRating: newAverage,
          totalReviews: newTotal,
        });

        // Update local state immediately
        updateLocationData({
          averageRating: newAverage,
          totalReviews: newTotal,
        });
      }

      // Remove from local state
      setReviews((prevReviews) =>
        prevReviews.filter((r) => r.id !== userExistingReview.id)
      );

      // Reset user review state
      setUserExistingReview(null);
      setUserRating(0);
      setUserReview("");
      setIsEditingReview(false);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  // Get directions to location
  const getDirections = async () => {
    setGettingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const destLat = location.position.latitude;
        const destLng = location.position.longitude;

        // Create Google Maps directions URL
        const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${destLat},${destLng}`;

        // Open in new tab
        window.open(directionsUrl, "_blank");
        setGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        // Fallback: open Google Maps with just the destination
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.position.latitude},${location.position.longitude}`;
        window.open(mapsUrl, "_blank");
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Fetch reviews and check if saved
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reviews
        const reviewsQuery = query(
          collection(db, "reviews"),
          where("locationId", "==", location.id),
          orderBy("createdAt", "desc"),
          limit(50) // Increased limit to ensure we get user's review if it exists
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const fetchedReviews: LocationReview[] = [];
        let currentUserReview: LocationReview | null = null;

        reviewsSnapshot.forEach((doc) => {
          const data = doc.data();

          const review: LocationReview = {
            id: doc.id,
            locationId: data.locationId,
            userId: data.userId,
            userDisplayName: data.userDisplayName || "Anonymous",
            rating: data.rating,
            comment: data.comment,
            createdAt: formatFirestoreDate(data.createdAt),
            updatedAt: formatFirestoreDate(data.updatedAt),
          };

          // Check if this is the current user's review
          if (user && data.userId === user.uid) {
            currentUserReview = review;
          }

          // Add all reviews to the list (including user's own review)
          fetchedReviews.push(review);
        });

        // Set all reviews (including user's own review)
        setReviews(fetchedReviews);

        // Set user's existing review but don't populate form automatically
        setUserExistingReview(currentUserReview);
        // Reset form to empty state
        setUserRating(0);
        setUserReview("");
        setIsEditingReview(false);

        // Check if location is saved by current user
        if (user) {
          const savesQuery = query(
            collection(db, "userSaves"),
            where("locationId", "==", location.id),
            where("userId", "==", user.uid)
          );
          const savesSnapshot = await getDocs(savesQuery);
          const isCurrentlySaved = !savesSnapshot.empty;
          setIsSaved(isCurrentlySaved);
        } else {
          setIsSaved(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.id, user, formatFirestoreDate]);

  // Toggle save status
  const toggleSave = async () => {
    if (!user) {
      return;
    }

    try {
      if (isSaved) {
        // Remove from saves
        const savesQuery = query(
          collection(db, "userSaves"),
          where("locationId", "==", location.id),
          where("userId", "==", user.uid)
        );
        const savesSnapshot = await getDocs(savesQuery);

        for (const saveDoc of savesSnapshot.docs) {
          await deleteDoc(saveDoc.ref);
        }

        // Decrement totalSaves in location document (ensure it exists first)
        const locationRef = doc(db, "locations", location.id);
        try {
          await updateDoc(locationRef, {
            totalSaves: increment(-1),
          });

          // Update local state immediately
          updateLocationData({
            totalSaves: Math.max(0, (location.totalSaves || 1) - 1),
          });
        } catch {
          // If field doesn't exist, initialize it
          const newTotalSaves = Math.max(0, (location.totalSaves || 1) - 1);
          await updateDoc(locationRef, {
            totalSaves: newTotalSaves,
          });

          // Update local state immediately
          updateLocationData({
            totalSaves: newTotalSaves,
          });
        }

        setIsSaved(false);

        // Notify parent about save status change
        if (onSaveStatusChange) {
          onSaveStatusChange(location.id, false);
        }
      } else {
        // Add to saves
        await addDoc(collection(db, "userSaves"), {
          locationId: location.id,
          userId: user.uid,
          createdAt: new Date(),
        });

        // Increment totalSaves in location document (ensure it exists first)
        const locationRef = doc(db, "locations", location.id);
        try {
          await updateDoc(locationRef, {
            totalSaves: increment(1),
          });

          // Update local state immediately
          updateLocationData({
            totalSaves: (location.totalSaves || 0) + 1,
          });
        } catch {
          // If field doesn't exist, initialize it
          const newTotalSaves = (location.totalSaves || 0) + 1;
          await updateDoc(locationRef, {
            totalSaves: newTotalSaves,
          });

          // Update local state immediately
          updateLocationData({
            totalSaves: newTotalSaves,
          });
        }

        setIsSaved(true);

        // Notify parent about save status change
        if (onSaveStatusChange) {
          onSaveStatusChange(location.id, true);
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      alert("Failed to save/unsave location. Please try again.");
    }
  };

  // Submit review
  const submitReview = async () => {
    if (!user || !userRating || !userReview.trim()) {
      return;
    }

    const isUpdating = userExistingReview !== null;
    setIsSubmitting(true);

    try {
      if (isUpdating && userExistingReview) {
        // Update existing review
        await updateDoc(doc(db, "reviews", userExistingReview.id), {
          rating: userRating,
          comment: userReview.trim(),
          updatedAt: new Date(),
        });

        // Update the current user review state
        const updatedReview: LocationReview = {
          ...userExistingReview,
          rating: userRating,
          comment: userReview.trim(),
          updatedAt: new Date().toISOString(),
        };
        setUserExistingReview(updatedReview);

        // Update the review in the reviews list
        setReviews((prevReviews) =>
          prevReviews.map((r) =>
            r.id === userExistingReview.id ? updatedReview : r
          )
        );

        // Reset form after successful update
        setUserRating(0);
        setUserReview("");
        setIsEditingReview(false);

        // Only update location aggregates if rating changed
        if (userExistingReview.rating !== userRating) {
          const currentTotal = location.totalReviews || 1;
          const currentAverage =
            location.averageRating || userExistingReview.rating;
          // Remove old rating and add new rating
          const newAverage =
            (currentAverage * currentTotal -
              userExistingReview.rating +
              userRating) /
            currentTotal;

          await updateDoc(doc(db, "locations", location.id), {
            averageRating: newAverage,
          });

          // Update local state immediately
          updateLocationData({
            averageRating: newAverage,
          });
        }
      } else {
        // Create new review
        const reviewDoc = await addDoc(collection(db, "reviews"), {
          locationId: location.id,
          userId: user.uid || "",
          userDisplayName: user.displayName || user.email || "Anonymous",
          rating: userRating,
          comment: userReview.trim(),
          createdAt: new Date(),
        });

        // Create new review object for state
        const displayName = user.displayName || user.email || "Anonymous";
        const newReview: LocationReview = {
          id: reviewDoc.id,
          locationId: location.id,
          userId: user.uid || "",
          userDisplayName: displayName || "Anonymous",
          rating: userRating,
          comment: userReview.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUserExistingReview(newReview);

        // Add the new review to the reviews list
        setReviews((prevReviews) => [newReview, ...prevReviews]);

        // Reset form after successful creation
        setUserRating(0);
        setUserReview("");
        setIsEditingReview(false);

        // Update location aggregates for new review
        const currentTotal = location.totalReviews || 0;
        const currentAverage = location.averageRating || 0;
        const newTotal = currentTotal + 1;
        const newAverage =
          (currentAverage * currentTotal + userRating) / newTotal;

        await updateDoc(doc(db, "locations", location.id), {
          averageRating: newAverage,
          totalReviews: newTotal,
        });

        // Update local state immediately
        updateLocationData({
          averageRating: newAverage,
          totalReviews: newTotal,
        });
      }

      // Don't reset form for editing - keep the values
      // setUserRating(0);
      // setUserReview('');

      // Don't refresh all reviews since we're not showing user's review in the list anyway
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render skull rating
  const renderSkulls = (
    rating: number,
    interactive = false,
    onRate?: (rating: number) => void
  ) => {
    const handleMouseEnter = (skull: number) => {
      if (interactive) {
        setHoveredRating(skull);
      }
    };

    const handleMouseLeave = () => {
      if (interactive) {
        setHoveredRating(0);
      }
    };

    const displayRating =
      interactive && hoveredRating > 0 ? hoveredRating : rating;

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((skull) => (
          <Skull
            key={skull}
            className={`w-4 h-4 ${
              skull <= displayRating
                ? "text-red-500 fill-red-50"
                : "text-gray-400"
            } ${
              interactive ? "cursor-pointer transition-colors duration-150" : ""
            }`}
            onClick={interactive && onRate ? () => onRate(skull) : undefined}
            onMouseEnter={() => handleMouseEnter(skull)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
    );
  };

  // Generate user avatar with initials
  const generateUserAvatar = (userDisplayName: string) => {
    const initials = userDisplayName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

    return (
      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400 text-sm">Loading location details...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Regular Details Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-red-900/30">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-red-400 mb-3 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to locations
          </Button>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">{location.name}</h2>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>
                {location.position.latitude.toFixed(6)},{" "}
                {location.position.longitude.toFixed(6)}
              </span>
            </div>

            {/* Rating */}
            {location.averageRating ? (
              <div className="flex items-center space-x-1">
                {renderSkulls(Math.round(location.averageRating))}
                <span className="text-sm text-gray-300">
                  {location.averageRating.toFixed(1)} (
                  {location.totalReviews || 0} reviews)
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No reviews yet</p>
            )}

            <p className="text-gray-300 text-sm leading-relaxed">
              {location.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={toggleSave}
                variant={isSaved ? "default" : "outline"}
                size="sm"
                className={
                  isSaved
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/30 hover:text-red-400"
                }
                disabled={!user}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isSaved ? "fill-white" : ""}`}
                />
                {isSaved ? "Saved" : "Save"}
              </Button>

              <Button
                onClick={getDirections}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/30 hover:text-red-400"
                disabled={gettingLocation}
              >
                <Navigation className="w-4 h-4 mr-2" />
                {gettingLocation ? "Getting location..." : "Directions"}
              </Button>

              <Button
                onClick={() => onViewStreetView(location)}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/30 hover:text-red-400"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-red-500" />
            Reviews ({reviews.length})
          </h3>

          {/* Message for users who have already reviewed */}
          {user && userExistingReview && !isEditingReview && (
            <div className="text-center py-2">
              <p className="text-sm text-gray-400">
                You have already reviewed this location. Click &quot;Edit&quot;
                on your review to modify it.
              </p>
            </div>
          )}

          {/* Write/Edit Review (for authenticated users) */}
          {user && (!userExistingReview || isEditingReview) && (
            <Card className="bg-black/40 border-red-900/30">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3">
                  {isEditingReview ? "Edit Your Review" : "Write a Review"}
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Rating
                    </label>
                    {renderSkulls(userRating, true, setUserRating)}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Comment
                    </label>
                    <textarea
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      placeholder="Share your experience..."
                      rows={3}
                      className="w-full p-3 bg-black/50 border border-red-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={submitReview}
                      disabled={
                        !userRating || !userReview.trim() || isSubmitting
                      }
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting
                        ? isEditingReview
                          ? "Updating..."
                          : "Posting..."
                        : isEditingReview
                        ? "Update Review"
                        : "Post Review"}
                    </Button>

                    {isEditingReview && (
                      <Button
                        onClick={cancelEditingReview}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/30 hover:text-red-400"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 text-4xl mb-2">💭</div>
                <p className="text-gray-400 text-sm">No reviews yet</p>
                <p className="text-gray-500 text-xs mt-1">
                  Be the first to share your experience!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="bg-black/40 border-red-900/30">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header with avatar, name, and actions */}
                      <div className="flex items-start gap-3">
                        {/* User Avatar */}
                        {generateUserAvatar(review.userDisplayName)}

                        {/* User info and content */}
                        <div className="flex-1 min-w-0">
                          {/* User name and date/actions row */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              {/* User name */}
                              <div className="mb-1">
                                <span className="font-medium text-white text-sm">
                                  {review.userDisplayName}
                                  {user && review.userId === user.uid && (
                                    <span className="text-red-400 text-xs ml-1">
                                      (You)
                                    </span>
                                  )}
                                </span>
                              </div>
                              {/* Rating skulls */}
                              <div className="flex items-center">
                                {renderSkulls(review.rating)}
                              </div>
                            </div>

                            {/* Date and actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                              {user &&
                                review.userId === user.uid &&
                                !isEditingReview && (
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={startEditingReview}
                                      variant="outline"
                                      size="sm"
                                      className="border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/30 hover:text-red-400 text-xs px-2 py-1 h-6"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      onClick={deleteReview}
                                      variant="outline"
                                      size="sm"
                                      className="border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/30 hover:text-red-400 text-xs px-1 py-1 h-6"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Comment */}
                          <p className="text-gray-300 text-sm leading-relaxed break-words">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
