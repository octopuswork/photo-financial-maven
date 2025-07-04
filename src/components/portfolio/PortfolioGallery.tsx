import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Image as ImageIcon, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUploader } from "./FileUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

interface PortfolioGalleryProps {
  images: GalleryImage[];
  isEditing?: boolean;
  onImagesChange?: (images: GalleryImage[]) => void;
  onUploadComplete?: (url: string, fileName: string) => void;
  onRemoveImage?: (id: string) => void;
}

export function PortfolioGallery({ 
  images, 
  isEditing = false, 
  onImagesChange,
  onUploadComplete,
  onRemoveImage
}: PortfolioGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUploader, setShowUploader] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState("");
  const [newImageCategory, setNewImageCategory] = useState("Portfolio");
  const { toast } = useToast();

  // Extract unique categories from images
  const categories = ["all", ...Array.from(new Set(images.map(img => img.category)))];
  
  // Filter images by selected category
  const filteredImages = selectedCategory === "all" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const handleAddImage = () => {
    if (!onImagesChange) return;
    
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800",
      title: "New Image",
      category: "Portfolio"
    };
    
    onImagesChange([...images, newImage]);
    
    toast({
      title: "Image added",
      description: "New image has been added to your gallery."
    });
  };

  const handleUploadComplete = (url: string, fileName: string) => {
    if (onUploadComplete) {
      onUploadComplete(url, fileName);
    }
    
    // Reset form
    setNewImageTitle("");
    setNewImageCategory("Portfolio");
    setShowUploader(false);
  };

  const handleRemoveImage = (imageId: string) => {
    if (onRemoveImage) {
      onRemoveImage(imageId);
    } else if (onImagesChange) {
      onImagesChange(images.filter(img => img.id !== imageId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Portfolio Gallery
          </CardTitle>
          {isEditing && (
            <div className="flex gap-2">
              <Dialog open={showUploader} onOpenChange={setShowUploader}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Image to Gallery</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Image Title</label>
                      <Input
                        value={newImageTitle}
                        onChange={(e) => setNewImageTitle(e.target.value)}
                        placeholder="Enter image title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={newImageCategory}
                        onValueChange={setNewImageCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Portfolio">Portfolio</SelectItem>
                          <SelectItem value="Wedding">Wedding</SelectItem>
                          <SelectItem value="Portrait">Portrait</SelectItem>
                          <SelectItem value="Event">Event</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Nature">Nature</SelectItem>
                          <SelectItem value="Travel">Travel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FileUploader
                      onUploadComplete={handleUploadComplete}
                      acceptedFileTypes="image/*"
                      maxFileSize={10}
                      folder="portfolio"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button onClick={handleAddImage} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Sample
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-sm">{image.title}</h3>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {image.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No images in this category</p>
              {isEditing && (
                <div className="flex gap-2 justify-center mt-4">
                  <Button onClick={() => setShowUploader(true)} variant="outline">
                    Upload your first image
                  </Button>
                  <Button onClick={handleAddImage} variant="outline">
                    Add sample image
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}