"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

interface LocationDetailsProps {
  location: HauntedLocation;
  onBack: () => void;
}

export default function LocationDetails({
  location,
  onBack,
}: LocationDetailsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<LocationReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews and check if location is saved
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reviews
        const reviewsQuery = query(
          collection(db, "reviews"),
          where("locationId", "==", location.id),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const fetchedReviews: LocationReview[] = [];

        reviewsSnapshot.forEach((doc) => {
          fetchedReviews.push({ id: doc.id, ...doc.data() } as LocationReview);
        });

        setReviews(fetchedReviews);

        // Check if location is saved by current user
        if (user) {
          const savesQuery = query(
            collection(db, "userSaves"),
            where("locationId", "==", location.id),
            where("userId", "==", user.uid)
          );
          const savesSnapshot = await getDocs(savesQuery);
          setIsSaved(!savesSnapshot.empty);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.id, user]);

  // Handle save/unsave location
  const handleSaveToggle = async () => {
    if (!user) return;

    try {
      if (isSaved) {
        // Unsave - find and delete the save document
        const savesQuery = query(
          collection(db, "userSaves"),
          where("locationId", "==", location.id),
          where("userId", "==", user.uid)
        );
        const savesSnapshot = await getDocs(savesQuery);

        if (!savesSnapshot.empty) {
          const saveDoc = savesSnapshot.docs[0];
          await deleteDoc(doc(db, "userSaves", saveDoc.id));

          // Update location totalSaves count
          await updateDoc(doc(db, "locations", location.id), {
            totalSaves: increment(-1),
          });
        }
      } else {
        // Save location
        await addDoc(collection(db, "userSaves"), {
          locationId: location.id,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });

        // Update location totalSaves count
        await updateDoc(doc(db, "locations", location.id), {
          totalSaves: increment(1),
        });
      }

      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!user || !user.uid || !userRating || !userComment.trim()) return;

    setSubmitting(true);
    try {
      // Add new review
      const newReview = {
        locationId: location.id,
        userId: user.uid,
        userDisplayName: user.displayName || user.email || "Anonymous",
        userPhotoURL: user.photoURL || "",
        rating: userRating,
        comment: userComment.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "reviews"), newReview);

      // Add to local state
      setReviews([{ id: docRef.id, ...newReview }, ...reviews]);

      // Update location aggregate data
      const newTotalReviews = (location.totalReviews || 0) + 1;
      const currentAverage = location.averageRating || 0;
      const newAverage =
        (currentAverage * (location.totalReviews || 0) + userRating) /
        newTotalReviews;

      await updateDoc(doc(db, "locations", location.id), {
        averageRating: newAverage,
        totalReviews: increment(1),
        updatedAt: new Date().toISOString(),
      });

      // Reset form
      setUserRating(0);
      setUserComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Render skull rating instead of stars
  const renderSkulls = (
    rating: number,
    interactive = false,
    onRate?: (rating: number) => void
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((skull) => (
          <Skull
            key={skull}
            className={`w-4 h-4 ${
              skull <= rating ? "text-red-500 fill-red-50" : "text-gray-400"
            } ${
              interactive
                ? "cursor-pointer hover:text-red-500 hover:fill-red-50"
                : ""
            }`}
            onClick={interactive && onRate ? () => onRate(skull) : undefined}
          />
        ))}
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
      {/* Header */}
      <div className="p-4 border-b border-red-900/30">
        <div className="flex items-center space-x-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-400 hover:text-red-400 p-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white truncate">
              {location.name}
            </h2>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>
                {location.position.latitude.toFixed(4)},{" "}
                {location.position.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Rating and Save */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {location.averageRating ? (
              <div className="flex items-center space-x-1">
                {renderSkulls(Math.round(location.averageRating))}
                <span className="text-sm text-gray-300">
                  {location.averageRating.toFixed(1)} (
                  {location.totalReviews || 0})
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">No reviews yet</span>
            )}
          </div>

          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveToggle}
              className={`${
                isSaved
                  ? "text-red-400 hover:text-red-300"
                  : "text-gray-400 hover:text-red-400"
              }`}
            >
              <Heart
                className={`w-4 h-4 mr-1 ${isSaved ? "fill-current" : ""}`}
              />
              {isSaved ? "Saved" : "Save"}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Description */}
        <div className="p-4 border-b border-red-900/30">
          <p className="text-gray-300 text-sm leading-relaxed">
            {location.description}
          </p>
        </div>

        {/* Add Review (if user is logged in) */}
        {user && (
          <div className="p-4 border-b border-red-900/30">
            <h3 className="text-sm font-semibold text-white mb-3">
              Write a Review
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Rating
                </label>
                {renderSkulls(userRating, true, setUserRating)}
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Comment
                </label>
                <textarea
                  value={userComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setUserComment(e.target.value)
                  }
                  placeholder="Share your spooky experience..."
                  className="w-full bg-black/50 border border-red-900/30 rounded-lg text-white placeholder-gray-400 text-sm p-2 focus:outline-none focus:border-red-500"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleReviewSubmit}
                disabled={!userRating || !userComment.trim() || submitting}
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Send className="w-3 h-3 mr-1" />
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <MessageCircle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-white">
              Reviews ({reviews.length})
            </h3>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">
              No reviews yet. Be the first to share your experience!
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <Card key={review.id} className="bg-black/40 border-red-900/30">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">
                          {review.userDisplayName.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-white truncate">
                            {review.userDisplayName}
                          </span>
                          {renderSkulls(review.rating)}
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed mb-2">
                          {review.comment}
                        </p>

                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
