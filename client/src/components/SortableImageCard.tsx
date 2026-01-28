import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Replace, Edit, Trash2, GripVertical, MapPin } from "lucide-react";

type SiteImage = {
  id: number;
  name: string;
  category: string;
  url: string;
  altText?: string | null;
  usedIn?: unknown;
};

type SortableImageCardProps = {
  image: SiteImage;
  onView: () => void;
  onReplace: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShowUsage: () => void;
  categoryLabel: string;
};

export function SortableImageCard({
  image,
  onView,
  onReplace,
  onEdit,
  onDelete,
  onShowUsage,
  categoryLabel,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const usedInCount = Array.isArray(image.usedIn) ? image.usedIn.length : 0;

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`overflow-hidden group ${isDragging ? 'z-50 shadow-xl' : ''}`}
    >
      <div className="aspect-square relative bg-gray-100">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-2 left-2 z-10 p-1 bg-white/80 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>
        
        {/* Usage Badge */}
        {usedInCount > 0 && (
          <button
            onClick={onShowUsage}
            className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
          >
            <MapPin className="w-3 h-3" />
            {usedInCount}
          </button>
        )}
        
        <img
          src={image.url}
          alt={image.altText || image.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-image.svg';
          }}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={onView}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={onReplace}>
            <Replace className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="font-medium text-sm truncate">{image.name}</p>
        <Badge variant="secondary" className="mt-1 text-xs">
          {categoryLabel}
        </Badge>
      </CardContent>
    </Card>
  );
}
