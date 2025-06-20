import { useQuery } from '@tanstack/react-query';
import { getBoards } from '@/api/get-boards';
import { BoardCard } from '@/components/ui/BoardCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { userAuthStore } from '@/store/auth.store';

const DashboardPage = () => {
  const accessToken = userAuthStore((state) => state.accessToken);

  const { data: boards, isLoading, isError, error } = useQuery({
    queryKey: ['boards-list'],
    queryFn: getBoards,
    enabled: !!accessToken,
  });

  console.log('TanStack Query Data:', boards); 

  return (
    <div className="pt-[4.5rem]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader />

        {isLoading && (
           <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
           </div>
        )}

        {isError && (
          <div className="mt-8 text-center text-red-500 bg-red-500/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h3>
              <p>We couldn't load your boards. Please try again later.</p>
              <p className="text-xs mt-4 font-mono bg-red-500/20 p-2 rounded">Error: {error.message}</p>
          </div>
        )}
      
        {boards && boards.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boards.map((board) => (
            <BoardCard 
                key={board._id}
                boardId={board._id}
                title={board.name} 
                authorName={board.owner?.username || 'Unknown'}
                background={board.background || '#6d28d9'}
                memberCount={board.members?.length || 0}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && boards?.length === 0 && (
          <div className="mt-16 text-center border-2 border-dashed border-muted-foreground/30 p-12 rounded-xl">
              <h2 className="text-2xl font-semibold text-foreground">No Boards Yet!</h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  It looks a bit empty here. Click the button above to create your first board and start organizing your tasks.
              </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default DashboardPage;
