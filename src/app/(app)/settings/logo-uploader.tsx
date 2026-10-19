"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeLogo, setLogoUrl } from "./actions";

/**
 * The logo is set from a link rather than an upload: Softco is free to run,
 * and file storage is the one piece that would cost the operator money. Any
 * public image URL works, which in practice means the clinic's own website
 * or any image host.
 */
export function LogoUploader({ logoUrl }: { logoUrl: string | null }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await setLogoUrl(url);
      if (result.ok) {
        toast.success("Logo updated");
        setUrl("");
        router.refresh();
        return;
      }
      toast.error(result.error ?? "Could not save that link.");
    });
  }

  function clear() {
    startTransition(async () => {
      const result = await removeLogo();
      if (result.ok) {
        toast.success("Logo removed");
        router.refresh();
        return;
      }
      toast.error(result.error ?? "Could not remove the logo.");
    });
  }

  return (
    <section className="bg-card flex flex-col gap-4 rounded-2xl border p-5">
      <div>
        <h2 className="font-medium">Clinic logo</h2>
        <p className="text-muted-foreground text-sm">
          Printed at the top of every invoice. A square image works best.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="bg-muted grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border">
          {logoUrl ? (
            // Not next/image: this URL is whatever the clinic pasted, so it
            // cannot be in the configured remote patterns.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Your clinic logo"
              className="size-full object-contain"
            />
          ) : (
            <ImagePlus className="text-muted-foreground size-7" aria-hidden />
          )}
        </div>

        <div className="grid min-w-[16rem] flex-1 gap-1.5">
          <Label htmlFor="logoUrl">Link to your logo</Label>
          <div className="flex gap-2">
            <Input
              id="logoUrl"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://…"
            />
            <Button
              type="button"
              size="sm"
              disabled={pending || !url.trim()}
              onClick={save}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {logoUrl && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-fit"
          disabled={pending}
          onClick={clear}
        >
          <Trash2 className="size-4" aria-hidden />
          Remove logo
        </Button>
      )}
    </section>
  );
}
