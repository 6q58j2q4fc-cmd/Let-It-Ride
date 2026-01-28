import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, LogOut, Image as ImageIcon, Upload, Trash2, Edit, Search, 
  Grid, List, Zap, User, Settings, RefreshCw, Eye, Download
} from "lucide-react";
import { toast } from "sonner";

type SiteImage = {
  id: number;
  name: string;
  category: string;
  url: string;
  fileKey?: string | null;
  altText?: string | null;
  description?: string | null;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
  mimeType?: string | null;
  usedIn?: unknown;
  isActive: boolean;
  uploadedBy?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

const CATEGORIES = [
  { value: "tours", label: "Tours" },
  { value: "rentals", label: "Rentals" },
  { value: "products", label: "Products" },
  { value: "blog", label: "Blog" },
  { value: "gallery", label: "Gallery" },
  { value: "hero", label: "Hero Sections" },
  { value: "about", label: "About" },
  { value: "general", label: "General" },
] as const;

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SiteImage | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for upload
  const [uploadForm, setUploadForm] = useState({
    name: "",
    category: "general" as typeof CATEGORIES[number]["value"],
    altText: "",
    description: "",
    file: null as File | null,
  });

  // Form state for edit
  const [editForm, setEditForm] = useState({
    name: "",
    category: "general" as typeof CATEGORIES[number]["value"],
    altText: "",
    description: "",
  });

  // Check admin auth
  const { data: admin, isLoading: authLoading } = trpc.adminAuth.me.useQuery();
  
  // Fetch images
  const { data: images, isLoading: imagesLoading, refetch: refetchImages } = trpc.siteImages.getAll.useQuery(
    undefined,
    { enabled: !!admin }
  );

  // Mutations
  const logoutMutation = trpc.adminAuth.logout.useMutation({
    onSuccess: () => {
      setLocation("/admin-login");
    }
  });

  const createImageMutation = trpc.siteImages.create.useMutation({
    onSuccess: () => {
      toast.success("Image uploaded successfully");
      setIsUploadOpen(false);
      setUploadForm({ name: "", category: "general", altText: "", description: "", file: null });
      setPreviewImage(null);
      refetchImages();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const updateImageMutation = trpc.siteImages.update.useMutation({
    onSuccess: () => {
      toast.success("Image updated successfully");
      setIsEditOpen(false);
      setSelectedImage(null);
      refetchImages();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const deleteImageMutation = trpc.siteImages.delete.useMutation({
    onSuccess: () => {
      toast.success("Image deleted successfully");
      refetchImages();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !admin) {
      setLocation("/admin-login");
    }
  }, [admin, authLoading, setLocation]);

  // Filter images
  const filteredImages = images?.filter((img) => {
    const matchesSearch = searchQuery === "" || 
      img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.altText?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || img.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file, name: prev.name || file.name.split('.')[0] }));
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle upload
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = async () => {
    if (!uploadForm.file) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload file to S3 via server endpoint
      const formData = new FormData();
      formData.append('file', uploadForm.file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Upload failed');
      }

      const uploadResult = await uploadResponse.json();

      // Create image record in database
      createImageMutation.mutate({
        name: uploadForm.name,
        category: uploadForm.category,
        url: uploadResult.url,
        fileKey: uploadResult.fileKey,
        altText: uploadForm.altText || undefined,
        description: uploadForm.description || undefined,
        mimeType: uploadResult.mimeType,
        fileSize: uploadResult.fileSize,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle edit
  const handleEdit = (image: SiteImage) => {
    setSelectedImage(image);
    setEditForm({
      name: image.name,
      category: image.category as typeof CATEGORIES[number]["value"],
      altText: image.altText || "",
      description: image.description || "",
    });
    setIsEditOpen(true);
  };

  // Handle update
  const handleUpdate = () => {
    if (!selectedImage) return;
    
    updateImageMutation.mutate({
      id: selectedImage.id,
      name: editForm.name,
      category: editForm.category,
      altText: editForm.altText || undefined,
      description: editForm.description || undefined,
    });
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteImageMutation.mutate({ id });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">Let It Ride Electric Bikes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{admin.displayName || admin.username}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="images" className="space-y-6">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Photo Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Photo Management Tab */}
          <TabsContent value="images" className="space-y-6">
            {/* Toolbar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Refresh */}
                  <Button variant="outline" size="sm" onClick={() => refetchImages()}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>

                  {/* Upload Button */}
                  <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Upload New Image</DialogTitle>
                        <DialogDescription>
                          Add a new image to the website library
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* File Input */}
                        <div 
                          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {previewImage ? (
                            <img src={previewImage} alt="Preview" className="max-h-40 mx-auto rounded" />
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">Click to select an image</p>
                            </>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={uploadForm.name}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Image name"
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select 
                            value={uploadForm.category} 
                            onValueChange={(v) => setUploadForm(prev => ({ ...prev, category: v as typeof CATEGORIES[number]["value"] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Alt Text */}
                        <div className="space-y-2">
                          <Label>Alt Text (for SEO)</Label>
                          <Input
                            value={uploadForm.altText}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, altText: e.target.value }))}
                            placeholder="Describe the image"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label>Description (Optional)</Label>
                          <Textarea
                            value={uploadForm.description}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Additional notes about this image"
                            rows={2}
                          />
                        </div>

                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={handleUpload}
                          disabled={isUploading || createImageMutation.isPending || !uploadForm.file}
                        >
                          {isUploading || createImageMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Image
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Image Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{images?.length || 0}</div>
                  <div className="text-sm text-gray-500">Total Images</div>
                </CardContent>
              </Card>
              {CATEGORIES.slice(0, 3).map((cat) => (
                <Card key={cat.value}>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-gray-700">
                      {images?.filter(img => img.category === cat.value).length || 0}
                    </div>
                    <div className="text-sm text-gray-500">{cat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Image Grid/List */}
            {imagesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : filteredImages.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || selectedCategory !== "all" 
                      ? "Try adjusting your filters"
                      : "Upload your first image to get started"
                    }
                  </p>
                  <Button onClick={() => setIsUploadOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </CardContent>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden group">
                    <div className="aspect-square relative bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.altText || image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => window.open(image.url, '_blank')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(image)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(image.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm truncate">{image.name}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {CATEGORIES.find(c => c.value === image.category)?.label || image.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <div className="divide-y">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                      <img
                        src={image.url}
                        alt={image.altText || image.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{image.name}</p>
                        <p className="text-sm text-gray-500 truncate">{image.altText || "No alt text"}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {CATEGORIES.find(c => c.value === image.category)?.label || image.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => window.open(image.url, '_blank')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(image)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(image.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Manage your admin account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={admin.username} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input value={admin.displayName || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={admin.email || ""} disabled />
                </div>
                <Alert>
                  <AlertDescription>
                    To change your password, please contact the system administrator.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Update image details
            </DialogDescription>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.altText || selectedImage.name}
                className="w-full h-40 object-cover rounded"
              />

              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={editForm.category} 
                  onValueChange={(v) => setEditForm(prev => ({ ...prev, category: v as typeof CATEGORIES[number]["value"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  value={editForm.altText}
                  onChange={(e) => setEditForm(prev => ({ ...prev, altText: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleUpdate}
                  disabled={updateImageMutation.isPending}
                >
                  {updateImageMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
