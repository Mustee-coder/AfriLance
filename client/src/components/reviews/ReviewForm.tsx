import { useState } from "react";
import { Star } from "lucide-react";
import { useCreateReview } from "@/hooks/useReviews";

interface ReviewFormProps {
revieweeId: string;
jobId: string;
onSuccess?: () => void;
}

const ReviewForm = ({
revieweeId,
jobId,
onSuccess,
}: ReviewFormProps) => {
const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");

const createReviewMutation = useCreateReview();

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();

if (rating === 0 || !comment.trim()) {
return;
}

createReviewMutation.mutate(
{
reviewee: revieweeId,
job: jobId,
rating,
comment: comment.trim(),
},
{
onSuccess: () => {
setRating(0);
setComment("");
onSuccess?.();
},
},
);

};

return (

<form  
onSubmit={handleSubmit}  
className="rounded-xl border border-gray-200 bg-white p-6"  
>  
<h2 className="text-lg font-bold text-gray-900">  
Leave a Review  
</h2>    <div className="mt-5">  
    <p className="mb-2 text-sm font-medium text-gray-700">  
      Rating  
    </p>  <div className="flex gap-1">  
  {Array.from({ length: 5 }).map((_, index) => {  
    const value = index + 1;  

    return (  
      <button  
        key={value}  
        type="button"  
        onClick={() => setRating(value)}  
        aria-label={`Rate ${value} out of 5`}  
        className="rounded p-1 transition hover:scale-110"  
      >  
        <Star  
          className={`h-7 w-7 ${  
            value <= rating  
              ? "fill-yellow-400 text-yellow-400"  
              : "text-gray-300"  
          }`}  
        />  
      </button>  
    );  
  })}  
</div>

  </div>    <div className="mt-5">  
    <label  
      htmlFor="review-comment"  
      className="mb-2 block text-sm font-medium text-gray-700"  
    >  
      Comment  
    </label>  <textarea  
  id="review-comment"  
  value={comment}  
  onChange={(e) => setComment(e.target.value)}  
  rows={4}  
  maxLength={1000}  
  placeholder="Share your experience..."  
  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500"  
/>  

<p className="mt-1 text-right text-xs text-gray-400">  
  {comment.length}/1000  
</p>

  </div>  {createReviewMutation.isError && (
<p className="mt-3 text-sm text-red-600">
Failed to submit review. Please try again.
</p>
)}

<button
type="submit"
disabled={
rating === 0 ||
!comment.trim() ||
createReviewMutation.isPending
}
className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"

> 

{createReviewMutation.isPending  
  ? "Submitting..."  
  : "Submit Review"}

  </button>  
</form>  );
};

export default ReviewForm;
