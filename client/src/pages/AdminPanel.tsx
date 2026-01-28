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
  Grid, List, Zap, User, Settings, RefreshCw, Eye, Download, FolderUp, Replace, Crop, GripVertical, MapPin
} from "lucide-react";
import { toast } from "sonner";
import { ImageEditor } from "@/components/ImageEditor";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableImageCard } from '@/components/SortableImageCard';

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
  displayOrder?: number;
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
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkCategory, setBulkCategory] = useState<typeof CATEGORIES[number]["value"]>("general");
  const [bulkUploadProgress, setBulkUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacePreview, setReplacePreview] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorFile, setEditorFile] = useState<File | null>(null);
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null);
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [usageImage, setUsageImage] = useState<SiteImage | null>(null);

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

  const reorderMutation = trpc.siteImages.reorder.useMutation({
    onSuccess: () => {
      toast.success("Images reordered successfully");
      refetchImages();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = filteredImages.findIndex((img) => img.id === active.id);
      const newIndex = filteredImages.findIndex((img) => img.id === over.id);
      
      const newOrder = arrayMove(filteredImages, oldIndex, newIndex);
      const imageIds = newOrder.map(img => img.id);
      
      reorderMutation.mutate({ imageIds });
    }
  };

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

  // Open image editor
  const openImageEditor = () => {
    if (uploadForm.file) {
      setEditorFile(uploadForm.file);
      setIsEditorOpen(true);
    }
  };

  // Handle edited image from editor
  const handleEditorSave = (editedFile: File) => {
    setUploadForm(prev => ({ ...prev, file: editedFile }));
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(editedFile);
    setIsEditorOpen(false);
    toast.success("Image edited successfully");
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

  // Handle bulk file selection
  const handleBulkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setBulkFiles(files);
  };

  // Handle bulk upload
  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setBulkUploadProgress({ current: 0, total: bulkFiles.length });
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < bulkFiles.length; i++) {
      const file = bulkFiles[i];
      setBulkUploadProgress({ current: i + 1, total: bulkFiles.length });

      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }

        const uploadResult = await uploadResponse.json();

        await createImageMutation.mutateAsync({
          name: file.name.split('.')[0],
          category: bulkCategory,
          url: uploadResult.url,
          fileKey: uploadResult.fileKey,
          mimeType: uploadResult.mimeType,
          fileSize: uploadResult.fileSize,
        });

        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        errorCount++;
      }
    }

    setBulkUploadProgress(null);
    setBulkFiles([]);
    setIsBulkImportOpen(false);
    refetchImages();

    if (errorCount === 0) {
      toast.success(`Successfully uploaded ${successCount} images`);
    } else {
      toast.warning(`Uploaded ${successCount} images, ${errorCount} failed`);
    }
  };

  // Handle replace file selection
  const handleReplaceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReplaceFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setReplacePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle image replacement
  const [isReplacing, setIsReplacing] = useState(false);
  
  const handleReplace = async () => {
    if (!selectedImage || !replaceFile) {
      toast.error("Please select a file");
      return;
    }

    setIsReplacing(true);

    try {
      const formData = new FormData();
      formData.append('file', replaceFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await uploadResponse.json();

      // Update the image record with new URL but keep same ID
      await updateImageMutation.mutateAsync({
        id: selectedImage.id,
        name: selectedImage.name,
        category: selectedImage.category as typeof CATEGORIES[number]["value"],
        url: uploadResult.url,
        fileKey: uploadResult.fileKey,
        mimeType: uploadResult.mimeType,
        fileSize: uploadResult.fileSize,
      });

      toast.success("Image replaced successfully");
      setIsReplaceOpen(false);
      setReplaceFile(null);
      setReplacePreview(null);
      setSelectedImage(null);
      refetchImages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Replace failed');
    } finally {
      setIsReplacing(false);
    }
  };

  // Open replace dialog
  const openReplaceDialog = (image: SiteImage) => {
    setSelectedImage(image);
    setReplaceFile(null);
    setReplacePreview(null);
    setIsReplaceOpen(true);
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

                        {/* Crop/Edit Button */}
                        {uploadForm.file && (
                          <Button 
                            variant="outline"
                            className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                            onClick={openImageEditor}
                          >
                            <Crop className="w-4 h-4 mr-2" />
                            Crop / Resize Image
                          </Button>
                        )}

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
                  {/* Bulk Import Button */}
                  <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                        <FolderUp className="w-4 h-4 mr-2" />
                        Bulk Import
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Bulk Import Images</DialogTitle>
                        <DialogDescription>
                          Upload multiple images at once to the website library
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* File Input */}
                        <div 
                          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
                          onClick={() => bulkFileInputRef.current?.click()}
                        >
                          {bulkFiles.length > 0 ? (
                            <div className="space-y-2">
                              <FolderUp className="w-8 h-8 mx-auto text-green-500" />
                              <p className="text-sm font-medium text-green-600">{bulkFiles.length} files selected</p>
                              <p className="text-xs text-gray-500">
                                {bulkFiles.map(f => f.name).slice(0, 3).join(', ')}
                                {bulkFiles.length > 3 && ` +${bulkFiles.length - 3} more`}
                              </p>
                            </div>
                          ) : (
                            <>
                              <FolderUp className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">Click to select multiple images</p>
                            </>
                          )}
                          <input
                            ref={bulkFileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleBulkFileSelect}
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                          <Label>Category for all images</Label>
                          <Select 
                            value={bulkCategory} 
                            onValueChange={(v) => setBulkCategory(v as typeof CATEGORIES[number]["value"])}
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

                        {/* Progress */}
                        {bulkUploadProgress && (
                          <Alert>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <AlertDescription>
                              Uploading {bulkUploadProgress.current} of {bulkUploadProgress.total} images...
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={handleBulkUpload}
                          disabled={!!bulkUploadProgress || bulkFiles.length === 0}
                        >
                          {bulkUploadProgress ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <FolderUp className="w-4 h-4 mr-2" />
                              Upload {bulkFiles.length || ''} Images
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredImages.map(img => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.map((image) => (
                      <SortableImageCard
                        key={image.id}
                        image={image}
                        onView={() => window.open(image.url, '_blank')}
                        onReplace={() => openReplaceDialog(image)}
                        onEdit={() => handleEdit(image)}
                        onDelete={() => handleDelete(image.id)}
                        onShowUsage={() => {
                          setUsageImage(image);
                          setIsUsageOpen(true);
                        }}
                        categoryLabel={CATEGORIES.find(c => c.value === image.category)?.label || image.category}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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
                        <Button size="sm" variant="ghost" onClick={() => openReplaceDialog(image)}>
                          <Replace className="w-4 h-4" />
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

      {/* Image Editor */}
      <ImageEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        imageFile={editorFile}
        onSave={handleEditorSave}
      />

      {/* Replace Image Dialog */}
      <Dialog open={isReplaceOpen} onOpenChange={setIsReplaceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Replace Image</DialogTitle>
            <DialogDescription>
              Upload a new file to replace "{selectedImage?.name}". The image ID and references will be preserved.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current Image */}
            {selectedImage && (
              <div className="space-y-2">
                <Label>Current Image</Label>
                <div className="border rounded-lg p-2 bg-gray-50">
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.name}
                    className="max-h-32 mx-auto rounded"
                  />
                </div>
              </div>
            )}

            {/* New File Input */}
            <div 
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
              onClick={() => replaceFileInputRef.current?.click()}
            >
              {replacePreview ? (
                <div className="space-y-2">
                  <img src={replacePreview} alt="New image preview" className="max-h-32 mx-auto rounded" />
                  <p className="text-sm text-green-600 font-medium">New image selected</p>
                </div>
              ) : (
                <>
                  <Replace className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to select replacement image</p>
                </>
              )}
              <input
                ref={replaceFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleReplaceFileSelect}
              />
            </div>

            <Alert>
              <AlertDescription>
                The new image will replace the existing one. All references to this image across the website will automatically use the new file.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleReplace}
                disabled={isReplacing || !replaceFile}
              >
                {isReplacing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Replacing...
                  </>
                ) : (
                  <>
                    <Replace className="w-4 h-4 mr-2" />
                    Replace Image
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsReplaceOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Usage Dialog */}
      <Dialog open={isUsageOpen} onOpenChange={setIsUsageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Image Usage
            </DialogTitle>
            <DialogDescription>
              Where "{usageImage?.name}" is used on the website
            </DialogDescription>
          </DialogHeader>
          
          {usageImage && (
            <div className="space-y-4">
              <img 
                src={usageImage.url} 
                alt={usageImage.altText || usageImage.name}
                className="w-full h-32 object-cover rounded"
              />
              
              {Array.isArray(usageImage.usedIn) && usageImage.usedIn.length > 0 ? (
                <div className="space-y-2">
                  <Label>Used in {usageImage.usedIn.length} location(s):</Label>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {(usageImage.usedIn as string[]).map((location, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm">{location}</span>
                      </div>
                    ))}
                  </div>
                  <Alert>
                    <AlertDescription>
                      Replacing or deleting this image will affect all locations listed above.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">This image is not currently used on any pages.</p>
                  <p className="text-sm text-gray-400 mt-1">You can safely delete or replace it.</p>
                </div>
              )}
              
              <Button variant="outline" className="w-full" onClick={() => setIsUsageOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
