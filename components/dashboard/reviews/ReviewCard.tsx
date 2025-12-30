/* eslint-disable @typescript-eslint/no-explicit-any */

import { RatingStars } from './RatingStars'

export const ReviewCard = ({
    avatar,
    name,
    rating,
    comment,
    relatedItem,
    date,
}: any) => (
    <div className="bg-white rounded-lg p-4 shadow mb-4">
        <div className="flex items-center gap-3 mb-2">
            <img
                src={avatar}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
                <p className="font-semibold text-[#153A56]">{name}</p>
                <p className="text-xs text-gray-400">{date}</p>
            </div>
            <RatingStars value={rating} />
        </div>

        <p className="text-sm text-gray-600 mb-2">{comment}</p>

        <p className="text-xs text-gray-400 italic">
            Related to: {relatedItem}
        </p>
    </div>
)
