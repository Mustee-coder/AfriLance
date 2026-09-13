import { Star } from "lucide-react";
import type { Review } from "@/api/reviews.api";

interface ReviewListProps {
reviews: Review[];
averageRating?: number;
count?: number;
}

const ReviewList = ({
reviews,
averageRating = 0,
count = reviews.length,
}: ReviewListProps) => {
return (
<section className="space-y-6">
<div>
<h2 className="text-xl font-bold text-gray-900">
Reviews & Ratings
</h2>

    <div className="mt-3 flex items-center gap-3">
      <div className="flex items-center gap-1">
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold text-gray-900">
          {averageRating.toFixed(1)}
        </span>
      </div>

      <span className="text-sm text-gray-500">
        ({count} {count === 1 ? "review" : "reviews"})
      </span>
    </div>
  </div>

  {reviews.length === 0 ? (
    <div className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center">
      <p className="text-sm text-gray-500">
        No reviews yet.
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article
          key={review._id}
          className="rounded-xl border border-gray-200 bg-white p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                {review.reviewer.firstName}{" "}
                {review.reviewer.lastName}
              </h3>

              <p className="text-xs capitalize text-gray-500">
                {review.reviewer.role}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            {review.comment}
          </p>

          <p className="mt-3 text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </article>
      ))}
    </div>
  )}
</section>

);
};

export default ReviewList;
