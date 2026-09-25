"use client";

import { useState, useTransition } from "react";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { AdminCard } from "@/components/admin/AdminChrome";
import {
  FormSaveBar,
  ImageDropzone,
  VisibilitySwitch,
} from "@/components/admin/BrandAssetForm";
import { Input, Label, Textarea } from "@/components/ui/input";
import { saveFooterContent } from "@/lib/actions";
import type { FooterContent } from "@/lib/branding";

export function FooterEditor({ initial }: { initial: FooterContent }) {
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          setMessage("");
          await saveFooterContent(values);
          setMessage("Đã lưu footer.");
        });
      }}
    >
      <FormSaveBar
        saving={pending}
        message={message}
        onReset={() => {
          setValues(initial);
          setMessage("");
        }}
      />

      <AdminCard title="Nội dung Footer">
        <div className="space-y-4">
          <div>
            <Label>Mô tả (vi):</Label>
            <Textarea
              rows={3}
              value={values.summary}
              onChange={(e) =>
                setValues({ ...values, summary: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Nội dung (vi):</Label>
            <div className="mt-1">
              <TipTapEditor
                value={values.content}
                onChange={(html) => setValues({ ...values, content: html })}
                height={320}
              />
            </div>
          </div>
          <div>
            <Label>Copyright</Label>
            <Input
              value={values.copyright}
              onChange={(e) =>
                setValues({ ...values, copyright: e.target.value })
              }
            />
          </div>
          <VisibilitySwitch
            checked={values.isVisible}
            onChange={(v) => setValues({ ...values, isVisible: v })}
          />
        </div>
      </AdminCard>

      <AdminCard title="Hình ảnh Footer">
        <ImageDropzone
          value={values.imageUrl}
          onChange={(url) => setValues({ ...values, imageUrl: url })}
        />
      </AdminCard>
    </form>
  );
}
