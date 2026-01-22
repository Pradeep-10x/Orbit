import FeedList from '@/components/feed/FeedList';

export default function FeedPage() {
  return (
    <div className="min-h-screen">
      {/* Header Line - Shows Feed and Live Orbit */}
      <div className="sticky top-0 z-10 bg-[#0a0a12] border-b border-[rgba(168,85,247,0.1)] px-4 sm:px-6 xl:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="px-4 text-3xl font-bold text-[#e5e7eb]">Feed</h1>
          </div>
          <div className="hidden xl:flex items-center gap-2 text-[#9ca3af]">
            <div className="h-px w-12 bg-[rgba(168,85,247,0.2)]" />
            
            
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="px-4 sm:px-6 xl:px-8 py-6">
        <FeedList />
      </div>
    </div>
  );
}

