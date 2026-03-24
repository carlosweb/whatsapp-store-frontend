import React, { useState } from 'react';
import { useCarousel } from '../contexts/AppContext';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';

function SortableSlideItem({ id, slide, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.8 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 p-4 rounded-2xl hover:shadow-md transition-shadow relative">
      <div {...attributes} {...listeners} className="p-2 cursor-grab active:cursor-grabbing text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
        <GripVertical size={20} />
      </div>
      <img src={slide.imageUrl} alt={slide.title || 'Slide Image'} className="w-24 h-16 object-cover rounded-xl bg-gray-50 dark:bg-zinc-800 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <strong className="block text-lg font-bold truncate tracking-tight text-black dark:text-white">{slide.title || 'Image Only (No Text)'}</strong>
        {slide.subtitle && <p className="text-gray-500 dark:text-zinc-400 text-sm truncate">{slide.subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 pr-2">
        <button className="p-2 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-black dark:text-white rounded-xl transition-colors" onClick={() => onEdit(slide)}>
          <Edit size={18} />
        </button>
        <button className="p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-xl transition-colors" onClick={() => onDelete(slide.id)}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function HeroSlideManager() {
  const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide, updateHeroSlideOrders } = useCarousel();
  const [editingSlide, setEditingSlide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = heroSlides.findIndex(s => s.id === active.id);
      const newIndex = heroSlides.findIndex(s => s.id === over.id);
      
      const newArray = arrayMove(heroSlides, oldIndex, newIndex);
      const updates = newArray.map((s, idx) => ({ id: s.id, orderIndex: idx }));
      
      try {
        await updateHeroSlideOrders(updates);
        toast.success("Slides reordered successfully");
      } catch (err) {
        toast.error("Error reordering slides");
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage.from('hero-images').upload(fileName, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('hero-images').getPublicUrl(fileName);
      setEditingSlide(prev => ({ ...prev, imageUrl: data.publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handeSaveSlide = async (e) => {
    e.preventDefault();
    if (!editingSlide.imageUrl) {
      toast.error("Please upload an image for the slide");
      return;
    }
    
    setLoading(true);
    try {
      if (editingSlide.id) {
        await updateHeroSlide(editingSlide.id, editingSlide);
      } else {
        await addHeroSlide(editingSlide);
      }
      toast.success("Slide saved successfully");
      setEditingSlide(null);
    } catch (err) {
      toast.error("Error saving slide: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      try {
        await deleteHeroSlide(id);
        toast.info("Slide deleted");
      } catch (err) {
        toast.error("Error deleting slide");
      }
    }
  };

  if (editingSlide) {
    return (
      <form onSubmit={handeSaveSlide} className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 animate-[slideUp_0.3s_ease]">
        <h3 className="text-2xl font-extrabold mb-6 mt-0 text-black dark:text-white">
          {editingSlide.id ? 'Edit Slide' : 'Add New Slide'}
        </h3>
        
        <div className="flex flex-col gap-6">
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 p-6 text-center hover:bg-gray-100 dark:hover:bg-zinc-700/50 transition-colors relative overflow-hidden">
             {uploadingImage ? (
                <div className="py-8 flex flex-col items-center">
                  <Loader2 className="animate-spin text-[var(--color-primary)] mb-2" size={32} />
                  <span className="text-sm font-bold text-gray-500 dark:text-zinc-400">Uploading...</span>
                </div>
             ) : editingSlide.imageUrl ? (
               <div className="relative group">
                 <img src={editingSlide.imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl shadow-sm" />
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-[&:hover]:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                   <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-lg">
                      <ImageIcon size={18} /> Replace Image
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                   </label>
                 </div>
               </div>
             ) : (
               <label className="cursor-pointer block py-8">
                 <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-white/5">
                   <ImageIcon size={24} className="text-gray-400 dark:text-zinc-500" />
                 </div>
                 <span className="block font-bold text-black dark:text-white mb-1">Upload Slide Image</span>
                 <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">Drag and drop or click to browse</span>
                 <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
               </label>
             )}
          </div>

          <div>
             <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">Title (Optional)</label>
             <input type="text" value={editingSlide.title || ''} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] transition-all dark:text-white" placeholder="Hero Headline" />
          </div>
          <div>
             <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">Subtitle (Optional)</label>
             <input type="text" value={editingSlide.subtitle || ''} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] transition-all dark:text-white" placeholder="Supporting text..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">CTA Text (Optional)</label>
               <input type="text" value={editingSlide.ctaText || ''} onChange={e => setEditingSlide({...editingSlide, ctaText: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] transition-all dark:text-white" placeholder="e.g. Shop Now" />
            </div>
            <div>
               <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">CTA URL (Optional)</label>
               <input type="text" value={editingSlide.ctaUrl || ''} onChange={e => setEditingSlide({...editingSlide, ctaUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] transition-all dark:text-white" placeholder="https://" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button type="button" disabled={loading || uploadingImage} className="flex-1 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-white/10 text-black dark:text-white py-4 rounded-xl text-lg font-bold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50" onClick={() => setEditingSlide(null)}>Cancel</button>
          <button type="submit" disabled={loading || uploadingImage} className="flex-1 bg-[var(--color-primary)] text-white py-4 rounded-xl text-lg font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50">{loading ? 'Saving...' : 'Save Slide'}</button>
        </div>
      </form>
    );
  }

  return (
    <div className="animate-[slideUp_0.3s_ease]">
      <button 
        className="w-full bg-black dark:bg-[var(--color-primary)] text-white py-4 rounded-2xl text-lg font-bold hover:scale-[1.01] active:scale-[0.98] transition-transform shadow-lg mb-8 flex items-center justify-center gap-2"
        onClick={() => setEditingSlide({ title: '', subtitle: '', ctaText: '', ctaUrl: '', imageUrl: '' })}
      >
        <Plus size={20} className="text-white" strokeWidth={3} /> Add Slide
      </button>

      {heroSlides.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-[32px] border border-gray-100 dark:border-white/5">
          <p className="text-gray-500 dark:text-zinc-400 font-medium">No carousel slides uploaded yet. The default text layout will be shown.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={heroSlides.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4">
              {heroSlides.map(slide => (
                <SortableSlideItem key={slide.id} id={slide.id} slide={slide} onEdit={setEditingSlide} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
