
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="p-4 bg-[#37475A] text-white">
        <div className="flex space-x-4">
          <div className="animate-pulse bg-white/20 h-8 w-20 rounded"></div>
          <div className="animate-pulse bg-white/20 h-8 w-24 rounded"></div>
          <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#37475A] text-white">
      <div className="flex space-x-4 overflow-x-auto">
        {categories.map((category) => (
          <Button 
            key={category.id}
            variant="ghost" 
            size="sm" 
            onClick={() => onCategoryChange(category.name)}
            className={`text-white whitespace-nowrap ${
              selectedCategory === category.name 
                ? 'bg-white/20 text-white font-semibold' 
                : 'hover:bg-white/10'
            }`}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
