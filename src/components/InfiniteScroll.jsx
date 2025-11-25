import { useEffect, useRef } from "react";
import { Loader } from "lucide-react";

const InfiniteScroll = ({ onLoadMore, hasMore, loading, children }) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px", // Charge 200px avant la fin
        threshold: 0.1,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  return (
    <>
      {children}

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center items-center py-8">
          {loading ? (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader className="w-6 h-6 animate-spin" />
              <span>Chargement...</span>
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Charger plus de chaînes
            </button>
          )}
        </div>
      )}

      {!hasMore && children && (
        <div className="text-center py-8 text-gray-500">
          Toutes les chaînes ont été chargées
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
