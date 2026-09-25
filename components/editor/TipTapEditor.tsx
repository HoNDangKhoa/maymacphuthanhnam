"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Editor as TinyMCEEditor } from "tinymce";

async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  const data = (await res.json()) as { url: string };
  return data.url;
}

/**
 * Rich text editor đầy đủ toolbar (kiểu CKEditor).
 * TinyMCE GPL self-host — tránh lỗi license LTS của CKEditor 4.23+.
 */
export function TipTapEditor({
  value,
  onChange,
  height = 420,
}: {
  value: string;
  onChange: (html: string) => void;
  height?: number;
}) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const init = useMemo(
    () => ({
      height,
      menubar: false,
      branding: false,
      promotion: false,
      statusbar: true,
      resize: true as const,
      skin: "oxide",
      content_css: "default",
      plugins: [
        "advlist",
        "anchor",
        "autolink",
        "charmap",
        "code",
        "codesample",
        "directionality",
        "emoticons",
        "fullscreen",
        "help",
        "image",
        "insertdatetime",
        "link",
        "lists",
        "media",
        "pagebreak",
        "preview",
        "searchreplace",
        "table",
        "visualblocks",
        "visualchars",
        "wordcount",
      ],
      toolbar_mode: "wrap" as const,
      toolbar: [
        "code | newdocument preview print | cut copy paste pastetext | undo redo | searchreplace selectall | bold italic underline strikethrough subscript superscript removeformat",
        "blocks | bullist numlist outdent indent | blockquote | alignleft aligncenter alignright alignjustify | ltr rtl | link unlink anchor | image media table hr emoticons charmap pagebreak",
        "styles fontfamily fontsize lineheight | forecolor backcolor | fullscreen visualblocks help",
      ].join(" | "),
      font_family_formats:
        "Andale Mono=andale mono,monospace; Arial=arial,helvetica,sans-serif; Arial Black=arial black,sans-serif; Book Antiqua=book antiqua,palatino,serif; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier,monospace; Georgia=georgia,palatino,serif; Helvetica=helvetica,arial,sans-serif; Impact=impact,sans-serif; Tahoma=tahoma,arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Trebuchet MS=trebuchet ms,geneva,sans-serif; Verdana=verdana,geneva,sans-serif",
      font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
      line_height_formats: "1 1.1 1.2 1.3 1.4 1.5 1.6 1.8 2 2.5 3",
      block_formats:
        "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre",
      style_formats_merge: true,
      style_formats: [
        {
          title: "Kiểu chữ",
          items: [
            { title: "Đậm", inline: "strong" },
            { title: "Nghiêng", inline: "em" },
            {
              title: "Gạch chân",
              inline: "span",
              styles: { "text-decoration": "underline" },
            },
            { title: "Mã", inline: "code" },
          ],
        },
        {
          title: "Khối",
          items: [
            { title: "Trích dẫn", block: "blockquote" },
            { title: "Div", block: "div" },
            { title: "Pre", block: "pre" },
          ],
        },
      ],
      table_toolbar:
        "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
      image_title: true,
      automatic_uploads: true,
      paste_data_images: true,
      file_picker_types: "image media",
      images_upload_handler: async (blobInfo: {
        blob: () => Blob;
        filename: () => string;
      }) => {
        const blob = blobInfo.blob();
        const file = new File([blob], blobInfo.filename() || "image.png", {
          type: blob.type || "image/png",
        });
        return uploadImage(file);
      },
      file_picker_callback: (
        callback: (url: string, meta?: Record<string, string>) => void,
        _value: string,
        meta: Record<string, unknown>,
      ) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept =
          meta.filetype === "media" ? "video/*,audio/*" : "image/*";
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          const url = await uploadImage(file);
          callback(url, { title: file.name, alt: file.name });
        };
        input.click();
      },
      content_style:
        "body{font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px 8px}",
      setup: (editor: TinyMCEEditor) => {
        editorRef.current = editor;
      },
    }),
    [height],
  );

  if (!mounted) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-black/15 bg-[#f8f4ee] text-sm font-semibold text-ink/45">
        Đang tải trình soạn thảo…
      </div>
    );
  }

  return (
    <div className="ck-like-editor overflow-hidden rounded-xl border border-black/15 bg-[#f1ebe4] p-1 [&_.tox-tinymce]:!border-0 [&_.tox-editor-header]:!bg-[#f8f4ee] [&_.tox-statusbar]:!bg-[#f8f4ee]">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        value={value}
        onEditorChange={(html) => onChange(html)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        init={init as any}
      />
    </div>
  );
}
