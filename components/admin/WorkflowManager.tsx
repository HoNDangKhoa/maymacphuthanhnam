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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  deleteWorkflowStep,
  reorderWorkflow,
  saveWorkflowStep,
} from "@/lib/actions";

type Step = {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string | null;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

function SortableRow({
  step,
  onEdit,
  onDelete,
}: {
  step: Step;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="flex items-center gap-3 border border-[var(--line)] bg-paper px-3 py-3"
    >
      <button
        type="button"
        className="cursor-grab text-ink/40"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
      <span className="font-display text-xl text-brass">{step.stepNumber}</span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{step.title}</p>
        <p className="truncate text-sm text-ink/55">{step.subtitle}</p>
      </div>
      <Button type="button" size="sm" variant="outline" onClick={onEdit}>
        Sửa
      </Button>
      <Button type="button" size="sm" variant="danger" onClick={onDelete}>
        Xoá
      </Button>
    </li>
  );
}

export function WorkflowManager({ initial }: { initial: Step[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Step | null>(null);
  const [creating, setCreating] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      stepNumber: String(index + 1).padStart(2, "0"),
    }));
    setItems(next);
    await reorderWorkflow(next.map((i) => i.id));
    router.refresh();
  }

  const formInitial = editing || {
    id: "",
    stepNumber: String(items.length + 1).padStart(2, "0"),
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    isActive: true,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setCreating(true);
          }}
        >
          Thêm bước
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-3">
            {items.map((step) => (
              <SortableRow
                key={step.id}
                step={step}
                onEdit={() => {
                  setCreating(false);
                  setEditing(step);
                }}
                onDelete={async () => {
                  if (!confirm("Xoá bước này?")) return;
                  await deleteWorkflowStep(step.id);
                  setItems((prev) => prev.filter((i) => i.id !== step.id));
                  router.refresh();
                }}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {(creating || editing) && (
        <form
          className="space-y-4 border border-[var(--line)] bg-paper p-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            if (editing?.id) form.set("id", editing.id);
            form.set("isActive", "true");
            await saveWorkflowStep(form);
            setCreating(false);
            setEditing(null);
            router.refresh();
          }}
        >
          <p className="font-semibold">
            {editing ? "Sửa bước" : "Thêm bước mới"}
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Số bước</Label>
              <Input
                name="stepNumber"
                required
                defaultValue={formInitial.stepNumber}
              />
            </div>
            <div>
              <Label>Tiêu đề</Label>
              <Input name="title" required defaultValue={formInitial.title} />
            </div>
            <div>
              <Label>Phụ đề</Label>
              <Input
                name="subtitle"
                defaultValue={formInitial.subtitle || ""}
              />
            </div>
          </div>
          <div>
            <Label>Mô tả</Label>
            <Textarea
              name="description"
              required
              rows={3}
              defaultValue={formInitial.description}
            />
          </div>
          <ImageUploadField
            name="imageUrl"
            label="Thêm ảnh"
            defaultValue={formInitial.imageUrl}
            required
          />
          <div className="flex gap-2">
            <Button type="submit">Lưu</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              Huỷ
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
