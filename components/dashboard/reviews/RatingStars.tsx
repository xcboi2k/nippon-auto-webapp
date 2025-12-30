import { FaStar } from 'react-icons/fa'

export const RatingStars = ({ value }: { value: number }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
                key={star}
                size={14}
                className={star <= value ? 'text-yellow-400' : 'text-gray-300'}
            />
        ))}
    </div>
)
