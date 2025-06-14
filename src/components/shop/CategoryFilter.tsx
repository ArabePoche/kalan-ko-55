
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="p-4 bg-[#37475A] text-white">
      <div className="flex space-x-4 overflow-x-auto">
        {categories.map((category) => (
          <Button 
            key={category.id}
            variant="ghost" 
            size="sm" 
            onClick={() => onCategoryChange(category.id)}
            className={`text-white whitespace-nowrap ${
              selectedCategory === category.id 
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
