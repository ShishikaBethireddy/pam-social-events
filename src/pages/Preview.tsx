import { FnbGallery } from "@/components/nobu/FnbGallery";
import { SpaceGallery } from "@/components/nobu/SpaceGallery";
import { PersonalizingLoader } from "@/components/nobu/PersonalizingLoader";
import { Link, useParams } from "react-router-dom";

// ── Dev preview for chat sub-components — renders the picker in
// isolation against the same background the chat composer uses, so
// the design can be iterated on without driving the full chat flow.

const Preview = () => {
  const { kind } = useParams<{ kind: string }>();
  const noop = (label: string) => console.log("preview select", label);

  return (
    <div className="min-h-dvh bg-canvas py-10 px-4 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-ink-muted">
            Preview · {kind}
          </p>
          <div className="flex items-center gap-2">
            <Link
              to="/preview/loader"
              className="rounded-pill border border-border-default bg-paper px-3 py-1 font-sans text-[11px] uppercase tracking-[0.2em] text-ink hover:border-copper hover:text-copper"
            >
              Loader
            </Link>
            <Link
              to="/preview/spaces"
              className="rounded-pill border border-border-default bg-paper px-3 py-1 font-sans text-[11px] uppercase tracking-[0.2em] text-ink hover:border-copper hover:text-copper"
            >
              Spaces
            </Link>
            <Link
              to="/preview/fnb"
              className="rounded-pill border border-border-default bg-paper px-3 py-1 font-sans text-[11px] uppercase tracking-[0.2em] text-ink hover:border-copper hover:text-copper"
            >
              Dining
            </Link>
          </div>
        </div>

        {kind === "fnb" && <FnbGallery onSelect={noop} />}
        {kind === "spaces" && <SpaceGallery onSelect={noop} />}
        {kind === "loader" && (
          <PersonalizingLoader
            eventType="Family Reunion"
            guests="20 – 40 guests"
            dates="Spring 2027"
          />
        )}
        {kind !== "fnb" && kind !== "spaces" && kind !== "loader" && (
          <p className="rounded-md border border-dashed border-border-default bg-paper p-6 font-sans text-sm text-ink-muted">
            Unknown preview — try{" "}
            <Link to="/preview/spaces" className="underline">
              /preview/spaces
            </Link>
            ,{" "}
            <Link to="/preview/fnb" className="underline">
              /preview/fnb
            </Link>
            , or{" "}
            <Link to="/preview/loader" className="underline">
              /preview/loader
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
};

export default Preview;
