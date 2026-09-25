"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  deleteGalleryItem,
  reorderGallery,
  saveGalleryItem,
  toggleGalleryActive,
} from "@/lib/actions";

type Item = {
  id: string;
  title: string | null;
  caption: string | null;
  imageUrl: string;
  altText: string | null;
  isActive: boolean;
};

function SortableCard({
  item,
  onToggle,
  onDelete,
}: {
  item: Item;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="border border-[var(--line)] bg-paper p-3"
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          className="cursor-grab text-ink/40"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={item.isActive}
            onChange={onToggle}
          />
          Marquee
        </label>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.altText || item.title || ""}
        className="aspect-video w-full object-cover"
      />
      <p className="mt-2 font-semibold">{item.title || "Không tiêu đề"}</p>
      <p className="text-sm text-ink/55">{item.caption}</p>
      <Button
        type="button"
        size="sm"
        variant="danger"
        className="mt-3"
        onClick={onDelete}
      >
        Xoá
      </Button>
    </div>
  );
}

export function GalleryManager({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    await reorderGallery(next.map((i) => i.id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button type="button" onClick={() => setOpen(true)}>
          Thêm ảnh
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <SortableCard
                key={item.id}
                item={item}
                onToggle={async () => {
                  const next = !item.isActive;
                  setItems((prev) =>
                    prev.map((i) =>
                      i.id === item.id ? { ...i, isActive: next } : i,
                    ),
                  );
                  await toggleGalleryActive(item.id, next);
                  router.refresh();
                }}
                onDelete={async () => {
                  if (!confirm("Xoá ảnh này?")) return;
                  await deleteGalleryItem(item.id);
                  setItems((prev) => prev.filter((i) => i.id !== item.id));
                  router.refresh();
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {open && (
        <form
          className="space-y-4 border border-[var(--line)] bg-paper p-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            form.set("isActive", "true");
            await saveGalleryItem(form);
            setOpen(false);
            router.refresh();
          }}
        >
          <p className="font-semibold">Thêm ảnh gallery</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Tiêu đề</Label>
              <Input name="title" />
            </div>
            <div>
              <Label>Chú thích</Label>
              <Input name="caption" />
            </div>
          </div>
          <ImageUploadField name="imageUrl" label="Thêm ảnh" required />
          <div>
            <Label>Alt text</Label>
            <Input name="altText" />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Lưu</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
