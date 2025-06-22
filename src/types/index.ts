export interface RantCardProps {
  id: string;
  text: string;
  city: string;
  upvotes: number;
  timeAgo: string;
  imageUrl?: string;
  onUpvote: (id: string) => void;
  // Add any other props you need for the card
} 