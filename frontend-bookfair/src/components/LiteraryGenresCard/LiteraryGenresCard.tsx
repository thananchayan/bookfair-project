type Genre = { id?: string | number; name: string };

export interface LiteraryGenresCardProps {
  title?: string;
  genres?: Genre[];
  onRemove?: (genre: Genre, index: number) => void;
  onClickGenre?: (genre: Genre, index: number) => void;
  className?: string;
  emptyStateText?: string;
}

const LiteraryGenresCard = ({
  title = 'Literary Genres',
  genres = [],
  onRemove,
  onClickGenre,
  className = '',
  emptyStateText = 'No genres added yet.',
}: LiteraryGenresCardProps) => {
  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      <div className="px-4 py-3 border-b">
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        {genres.length === 0 ? (
          <p className="text-sm text-gray-500">{emptyStateText}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {genres.map((g, idx) => {
              const key = `${g.id ?? idx}`;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-800 px-3 py-1 text-sm"
                >
                  <button
                    type="button"
                    onClick={() => onClickGenre?.(g, idx)}
                    className="hover:underline"
                  >
                    {g.name}
                  </button>
                  {onRemove ? (
                    <button
                      type="button"
                      aria-label={`Remove ${g.name}`}
                      onClick={() => onRemove(g, idx)}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                    >
                      ×
                    </button>
                  ) : null}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiteraryGenresCard;

