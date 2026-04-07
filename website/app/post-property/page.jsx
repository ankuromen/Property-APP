import { siteUrl } from '@/lib/api';
import PostPropertyLanding from './PostPropertyLanding';

export const metadata = {
  title: 'For brokers & owners — List on the marketplace',
  description:
    'One account to list properties, manage leads, and grow on a verified marketplace. Admin-reviewed listings, fair plans, and tools for brokers and property owners.',
  alternates: { canonical: `${siteUrl()}/post-property` },
};

export default function PostPropertyPage() {
  return <PostPropertyLanding />;
}
