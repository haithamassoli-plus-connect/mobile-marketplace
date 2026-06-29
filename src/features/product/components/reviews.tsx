import type { RatingBar, Review } from '../data';

import { Image, Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { Stars } from './stars';

const GOLD = '#dbb42c'; // gold-500
const SUCCESS_700 = '#027a48';
const NEUTRAL_500 = '#717680';
const NEUTRAL_600 = '#535862';

type Summary = { rating: number; reviewCount: number; bars: RatingBar[] };

// B5 — header, score + histogram summary, then the review cards.
export function Reviews({ summary, reviews }: { summary: Summary; reviews: Review[] }) {
  return (
    <View className="gap-4 px-4 pt-[18px] pb-2">
      <ReviewsHeader reviewCount={summary.reviewCount} />
      <RatingSummary summary={summary} />
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </View>
  );
}

function ReviewsHeader({ reviewCount }: { reviewCount: number }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-1.5">
        <Text variant="title-3" emphasized className="text-neutral-900">Customer Reviews</Text>
        <Text variant="footnote" className="text-neutral-500">{`(${reviewCount})`}</Text>
      </View>
      {/* ponytail: decorative — View All list not built. */}
      <Pressable className="flex-row items-center gap-1 rounded-full border border-neutral-300 py-2 pr-2.5 pl-3">
        <Text variant="footnote" emphasized className="text-neutral-700">View All</Text>
        <Icon name="chevron-right" size={14} color={NEUTRAL_500} />
      </Pressable>
    </View>
  );
}

function RatingSummary({ summary }: { summary: Summary }) {
  return (
    <View className="flex-row items-center gap-[18px]">
      <View className="items-center gap-1">
        <Text variant="title-1" emphasized className="text-neutral-900">{summary.rating.toFixed(1)}</Text>
        <Stars value={summary.rating} size={15} />
        <Text variant="caption-2" className="text-neutral-500">{`${summary.reviewCount} reviews`}</Text>
      </View>
      <View className="flex-1 gap-[7px]">
        {summary.bars.map(bar => (
          <HistogramRow key={bar.stars} stars={bar.stars} percent={bar.percent} />
        ))}
      </View>
    </View>
  );
}

function HistogramRow({ stars, percent }: { stars: number; percent: number }) {
  return (
    <View className="flex-row items-center gap-2">
      <Text variant="caption-1" className="text-neutral-600">{stars}</Text>
      <Icon name="star" size={11} color={GOLD} />
      <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
        <View className="h-full rounded-full bg-gold-500" style={{ width: `${percent}%` }} />
      </View>
      <Text variant="caption-2" className="w-8 text-right text-neutral-500">{`${percent}%`}</Text>
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View className="gap-[11px] rounded-xl border border-neutral-200 p-[14px]">
      <View className="flex-row items-start justify-between">
        <View className="flex-row gap-2.5">
          <Image source={review.avatar} contentFit="cover" className="size-[38px] rounded-full" />
          <View className="gap-1">
            <Text variant="subheadline" emphasized className="text-neutral-900">{review.name}</Text>
            {review.verified
              ? (
                  <View className="flex-row items-center gap-1">
                    <Icon name="badge-check" size={13} color={SUCCESS_700} />
                    <Text variant="caption-2" emphasized className="text-success-700">Verified Buyer</Text>
                  </View>
                )
              : null}
            <Stars value={review.rating} size={12} />
          </View>
        </View>
        <Text variant="caption-2" className="text-neutral-500">{review.date}</Text>
      </View>
      <Text variant="footnote" className="text-neutral-700">{review.body}</Text>
      {review.photos.length > 0
        ? (
            <View className="flex-row gap-2">
              {review.photos.map(photo => (
                <Image key={photo} source={photo} contentFit="cover" className="size-[54px] rounded-lg" />
              ))}
            </View>
          )
        : null}
      {/* ponytail: decorative — "Helpful" vote not wired. */}
      <Pressable className="flex-row items-center gap-1.5 self-start rounded-full border border-neutral-300 py-2 pr-3.5 pl-3">
        <Icon name="thumbs-up" size={15} color={NEUTRAL_600} />
        <Text variant="footnote" emphasized className="text-neutral-600">{`Helpful (${review.helpful})`}</Text>
      </Pressable>
    </View>
  );
}
