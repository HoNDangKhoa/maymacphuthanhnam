"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import {
  AdminCard,
  FormActionBar,
} from "@/components/admin/AdminChrome";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { savePost } from "@/lib/actions";
import {
  POST_TYPE_DEFAULT_CATEGORY,
  POST_TYPE_LABEL,
  POST_TYPE_LIST_PATH,
  slugify,
} from "@/lib/cms";
import { uploadAsset } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

export type ArticleFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  summary?: string | null;
  contentHtml?: string;
  thumbnail?: string | null;
  type?: string;
  status?: string;
  categoryName?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  seoKeywords?: string | null;
  canonicalUrl?: string | null;
  tags?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  publishedAt?: string | null;
  syncSlugFromTitle?: boolean;
};

export function PostForm({
  initial,
  contentLabel,
}: {
  initial?: ArticleFormValues;
  contentLabel?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const type = initial?.type || "NEWS";
  const listPath = POST_TYPE_LIST_PATH[type] || "/admin/content/news";
  const typeLabel = contentLabel || POST_TYPE_LABEL[type] || "bài viết";

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [syncSlug, setSyncSlug] = useState(initial?.syncSlugFromTitle ?? !initial?.id);
  const [summary, setSummary] = useState(initial?.summary || "");
  const [contentHtml, setContentHtml] = useState(initial?.contentHtml || "");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail || "");
  const [tags, setTags] = useState(initial?.tags || "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [status, setStatus] = useState(initial?.status || "DRAFT");
  const [categoryName, setCategoryName] = useState(
    initial?.categoryName || POST_TYPE_DEFAULT_CATEGORY[type] || "",
  );
  const [publishedAt, setPublishedAt] = useState(
    initial?.publishedAt || new Date().toISOString().slice(0, 10),
  );
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle || "");
  const [seoKeywords, setSeoKeywords] = useState(initial?.seoKeywords || "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.metaDescription || "",
  );
  const [canonicalUrl, setCanonicalUrl] = useState(initial?.canonicalUrl || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!syncSlug) return;
    setSlug(slugify(title));
  }, [title, syncSlug]);

  const titleCount = title.length;
  const seoTitleCount = metaTitle.length;
  const seoKwCount = seoKeywords.length;
  const seoDescCount = metaDescription.length;

  async function onUploadThumb(file: File) {
    try {
      setThumbnail(await uploadAsset(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload thất bại");
    }
  }

  async function submit(nextIntent: "save" | "save-stay") {
    setSaving(true);
    setError("");
    try {
      const form = new FormData();
      if (initial?.id) form.set("id", initial.id);
      form.set("title", title);
      form.set("slug", slug);
      form.set("summary", summary);
      form.set("contentHtml", contentHtml);
      form.set("thumbnail", thumbnail);
      form.set("type", type);
      form.set("status", status);
      form.set("categoryName", categoryName);
      form.set("metaTitle", metaTitle);
      form.set("metaDescription", metaDescription);
      form.set("seoKeywords", seoKeywords);
      form.set("canonicalUrl", canonicalUrl);
      form.set("tags", tags);
      form.set("sortOrder", String(sortOrder));
      form.set("isVisible", isVisible ? "1" : "0");
      form.set("isFeatured", isFeatured ? "1" : "0");
      form.set("isNew", initial?.isNew ? "1" : "0");
      form.set("publishedAt", publishedAt);
      const result = await savePost(form);
      if (nextIntent === "save-stay") {
        if (!initial?.id && result?.id) {
          router.replace(`${listPath}/${result.id}`);
        }
        router.refresh();
      } else {
        router.push(listPath);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu bài viết");
    } finally {
      setSaving(false);
    }
  }

  const dropHint = useMemo(
    () => "Width: tự động - Height: tự động (jpg, jpeg, png, gif, webp, pdf, mp4)",
    [],
  );

  return (
    <form
      ref={formRef}
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submit("save");
      }}
    >
      <FormActionBar
        saving={saving}
        onSave={() => void submit("save")}
        onSaveStay={() => void submit("save-stay")}
        onReset={() => {
          formRef.current?.reset();
          setTitle(initial?.title || "");
          setSlug(initial?.slug || "");
          setSummary(initial?.summary || "");
          setContentHtml(initial?.contentHtml || "");
          setThumbnail(initial?.thumbnail || "");
          setTags(initial?.tags || "");
          setSortOrder(initial?.sortOrder ?? 0);
          setIsVisible(initial?.isVisible ?? true);
          setIsFeatured(initial?.isFeatured ?? false);
          setStatus(initial?.status || "DRAFT");
          setCategoryName(
            initial?.categoryName || POST_TYPE_DEFAULT_CATEGORY[type] || "",
          );
          setPublishedAt(
            initial?.publishedAt || new Date().toISOString().slice(0, 10),
          );
          setMetaTitle(initial?.metaTitle || "");
          setSeoKeywords(initial?.seoKeywords || "");
          setMetaDescription(initial?.metaDescription || "");
          setCanonicalUrl(initial?.canonicalUrl || "");
          setSyncSlug(!initial?.id);
          setError("");
        }}
        onExit={() => router.push(listPath)}
      />

      <AdminCard title="Đường dẫn (URL không trùng tiêu đề)">
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink/70">
          <input
            type="checkbox"
            checked={syncSlug}
            onChange={(e) => setSyncSlug(e.target.checked)}
          />
          Thay đổi đường dẫn theo tiêu đề mới
        </label>
        <Input
          value={slug}
          onChange={(e) => {
            setSyncSlug(false);
            setSlug(e.target.value);
          }}
          placeholder="duong-dan-bai-viet"
        />
      </AdminCard>

      <AdminCard title={`Nội dung ${typeLabel.toLowerCase()}`}>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between gap-3">
              <Label>Tiêu đề (vi):</Label>
              <span className="text-xs font-semibold text-ink/40">
                {titleCount} / 120 ký tự
              </span>
            </div>
            <Input
              value={title}
              maxLength={120}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Mô tả (vi):</Label>
            <Textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div>
            <Label>Nội dung (vi):</Label>
            <div className="mt-1">
              <TipTapEditor value={contentHtml} onChange={setContentHtml} />
            </div>
          </div>
          <div>
            <Label>Tags</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title={`Hình ảnh ${typeLabel.toLowerCase()}`}>
        <div
          className={cn(
            "flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-black/15 bg-[#fafafa] px-4 py-8 text-center",
            thumbnail && "border-solid border-[#f59e0b]/40 bg-white",
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={async (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) await onUploadThumb(file);
          }}
        >
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="mb-3 max-h-40 rounded-lg object-cover"
            />
          ) : (
            <>
              <p className="text-sm font-semibold text-ink/60">
                Kéo và thả hình vào đây
              </p>
              <p className="my-2 text-xs font-semibold text-ink/40">hoặc</p>
            </>
          )}
          <label className="cursor-pointer rounded-xl bg-[#f59e0b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d97706]">
            Chọn hình
            <input
              type="file"
              accept="image/*,.pdf,video/mp4"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await onUploadThumb(file);
              }}
            />
          </label>
          <p className="mt-3 text-xs font-semibold text-ink/40">{dropHint}</p>
          {thumbnail && (
            <button
              type="button"
              className="mt-3 text-xs font-semibold text-red-600"
              onClick={() => setThumbnail("")}
            >
              Xóa hình
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label>Số thứ tự</Label>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label>Hiển thị</Label>
            <button
              type="button"
              role="switch"
              aria-checked={isVisible}
              className={cn(
                "relative mt-2 h-7 w-12 rounded-full transition",
                isVisible ? "bg-[#f59e0b]" : "bg-black/15",
              )}
              onClick={() => setIsVisible((v) => !v)}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition",
                  isVisible && "translate-x-5",
                )}
              />
            </button>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Xuất bản">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Label>Trạng thái</Label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="DRAFT">draft</option>
              <option value="REVIEW">review</option>
              <option value="PUBLISHED">published</option>
              <option value="ARCHIVED">archived</option>
            </Select>
          </div>
          <div>
            <Label>Chuyên mục</Label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div>
            <Label>Ngày xuất bản</Label>
            <Input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>
          <div>
            <Label>Nổi bật trang chủ</Label>
            <button
              type="button"
              role="switch"
              aria-checked={isFeatured}
              className={cn(
                "relative mt-2 h-7 w-12 rounded-full transition",
                isFeatured ? "bg-[#f59e0b]" : "bg-black/15",
              )}
              onClick={() => setIsFeatured((v) => !v)}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition",
                  isFeatured && "translate-x-5",
                )}
              />
            </button>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Nội dung SEO">
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between gap-3">
              <Label>SEO Title (vi):</Label>
              <span className="text-xs font-semibold text-ink/40">
                {seoTitleCount} / 70 ký tự
              </span>
            </div>
            <Input
              value={metaTitle}
              maxLength={70}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between gap-3">
              <Label>SEO Keywords (vi):</Label>
              <span className="text-xs font-semibold text-ink/40">
                {seoKwCount} / 70 ký tự
              </span>
            </div>
            <Input
              value={seoKeywords}
              maxLength={70}
              onChange={(e) => setSeoKeywords(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between gap-3">
              <Label>SEO Description (vi):</Label>
              <span className="text-xs font-semibold text-ink/40">
                {seoDescCount} / 160 ký tự
              </span>
            </div>
            <Textarea
              rows={3}
              value={metaDescription}
              maxLength={160}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Canonical URL</Label>
            <Input
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
        </div>
      </AdminCard>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
    </form>
  );
}
