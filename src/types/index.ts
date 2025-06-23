export interface RantCardProps {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  text: string;
  city: string;
  upvotes: number;
  commentCount: number;
  timeAgo: string;
  imageUrl?: string;
  onUpvote: (id: string) => void;
  title: string;
  // Add any other props you need for the card
} 