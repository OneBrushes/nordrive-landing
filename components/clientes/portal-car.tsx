"use client";

import { useEffect, useState } from "react";
import {
  Car,
  CheckCircle2,
  CircleDot,
  Clock,
  ClipboardCheck,
  Compass,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageSquareText,
  Truck,
  ArrowRight,
  CalendarClock,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, PORTAL_BUCKET } from "@/lib/supabase";
import {
  type PortalCar,
  carPhases,
  carTitle,
  specLine,
  statusHeadline,
  formatDate,
  formatFileSize,
  groupChecklist,
  timeAgo,
} from "@/lib/clientes";
import { ChecklistView, SectionCard } from "./portal-shared";

export function CarView({
  car,
  onOpenPhotos,
  onChanged,
}: {
  car: PortalCar;
  onOpenPhotos: (images: string[], index: number) => void;
  /** Recargar los datos (p. ej. después de dejar la reseña) */
  onChanged?: () => void;
}) {
  // Fotos extra: URLs firmadas del bucket privado
  const [signedPhotos, setSignedPhotos] = useState<string[] | null>(
    car.photos.length ? null : [],
  );
  const [openingDoc, setOpeningDoc] = useState<string | null>(null);
  const [docError, setDocError] = useState("");

  useEffect(() => {
    setDocError("");
    if (car.photos.length === 0) {
      setSignedPhotos([]);
      return;
    }
    let cancelled = false;
    setSignedPhotos(null);
    supabase.storage
      .from(PORTAL_BUCKET)
      .createSignedUrls(
        car.photos.map((p) => p.path),
        3600,
      )
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) return setSignedPhotos([]);
        const byPath = new Map(data.map((d) => [d.path, d.signedUrl]));
        setSignedPhotos(
          car.photos.map((p) => byPath.get(p.path) || "").filter(Boolean),
        );
      })
      .catch(() => !cancelled && setSignedPhotos([]));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car.id, car.updated_at]);

  const openDocument = async (path: string, name: string) => {
    setDocError("");
    setOpeningDoc(path);
    try {
      const { data, error } = await supabase.storage
        .from(PORTAL_BUCKET)
        .createSignedUrl(path, 300, { download: name });
      if (error || !data?.signedUrl) {
        setDocError("No hemos podido abrir el documento. Inténtalo de nuevo.");
        return;
      }
      // El enlace firmado lleva "download": el navegador descarga el archivo sin salir de la página
      // (una ventana nueva después de un await la bloquean los bloqueadores de popups)
      window.location.href = data.signedUrl;
    } catch {
      setDocError("No hemos podido abrir el documento. Inténtalo de nuevo.");
    } finally {
      setOpeningDoc(null);
    }
  };

  const gallery = [...car.images, ...(signedPhotos || [])];
  const heroImage = gallery[0];
  const phases = carPhases(car);
  const currentPhase = phases.find((p) => p.status === "current");
  const hasChecklist = groupChecklist(car.checklist).length > 0;
  const specs = specLine(car);
  const hasSideColumn = Boolean(car.note) || car.documents.length > 0;
  const showLocation = car.stage === "in_transit" && Boolean(car.current_location);

  return (
    <div className="space-y-6">
      {/* Cabecera del coche */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden md:grid md:grid-cols-5">
        <div className="md:col-span-3 relative bg-muted aspect-[16/10] md:aspect-auto md:min-h-[300px]">
          {heroImage ? (
            <button
              type="button"
              onClick={() => onOpenPhotos(gallery, 0)}
              className="absolute inset-0 w-full h-full"
              aria-label="Ver fotos del coche"
            >
              <img
                src={heroImage}
                alt={carTitle(car)}
                className="w-full h-full object-cover"
              />
              {gallery.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-md text-xs px-3 py-1.5 rounded-xl font-semibold border border-border/40 flex items-center gap-1.5 text-foreground">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" />
                  {gallery.length} fotos
                </span>
              )}
            </button>
          ) : signedPhotos === null ? (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
              <Car className="h-16 w-16" />
            </div>
          )}
        </div>
        <div className="md:col-span-2 p-5 md:p-6 flex flex-col justify-center gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {carTitle(car)}
            </h2>
            {specs && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {specs}
              </p>
            )}
          </div>
          {car.origin && (
            <p className="text-sm font-semibold text-foreground flex flex-wrap items-center gap-1.5">
              <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
              {car.origin}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              España
            </p>
          )}
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg border border-primary/20 flex-shrink-0">
              {car.stage === "in_transit" ? (
                car.transport_mode === "camion" ? (
                  <Truck className="h-5 w-5" />
                ) : (
                  <Compass className="h-5 w-5" />
                )
              ) : car.stage === "delivered" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <CircleDot className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                Estado actual
              </p>
              <p className="text-sm font-bold text-foreground">
                {statusHeadline(car)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {car.stage === "delivered" && <ReviewCard car={car} onSaved={onChanged} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Estado / fases */}
        <SectionCard
          icon={<Truck className="h-5 w-5" />}
          title="Estado de tu importación"
          className={hasSideColumn ? "lg:col-span-2" : "lg:col-span-3"}
        >
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 md:p-5">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
              Fase actual
            </p>
            <p className="text-xl md:text-2xl font-extrabold text-primary mt-0.5">
              {statusHeadline(car)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentPhase
                ? currentPhase.desc
                : car.stage === "delivered"
                  ? "Tu coche ya está contigo. ¡Gracias por confiar en NorDrive!"
                  : ""}
            </p>
            {showLocation && (
              <p className="mt-3 inline-flex flex-wrap items-center gap-1.5 rounded-xl bg-background border border-border px-3 py-2 text-sm">
                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="font-semibold text-foreground">Ahora en: {car.current_location}</span>
                {timeAgo(car.location_updated_at) && (
                  <span className="text-xs text-muted-foreground">· {timeAgo(car.location_updated_at)}</span>
                )}
              </p>
            )}
            {formatDate(car.updated_at) && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-3">
                <CalendarClock className="h-3.5 w-3.5" />
                Actualizado el {formatDate(car.updated_at)}
              </p>
            )}
          </div>

          <ol className="relative pl-6 border-l border-border/85 space-y-5 py-2 ml-3">
            {phases.map((phase) => (
              <li key={phase.key} className="relative">
                <span className="absolute -left-[37px] top-0.5 bg-card flex items-center justify-center rounded-full h-6 w-6">
                  {phase.status === "completed" && (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  )}
                  {phase.status === "current" && (
                    <>
                      <span className="absolute h-6 w-6 rounded-full bg-primary/25 animate-ping" />
                      <CircleDot className="h-6 w-6 text-primary relative" />
                    </>
                  )}
                  {phase.status === "pending" && (
                    <Clock className="h-5 w-5 text-muted-foreground/60" />
                  )}
                </span>
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-semibold text-sm md:text-base ${
                        phase.status === "pending"
                          ? "text-muted-foreground"
                          : phase.status === "current"
                            ? "text-primary"
                            : "text-foreground"
                      }`}
                    >
                      {phase.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        phase.status === "completed"
                          ? "bg-green-500/10 text-green-600"
                          : phase.status === "current"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {phase.date ||
                        (phase.status === "completed"
                          ? "Completado"
                          : phase.status === "current"
                            ? "En curso"
                            : "Pendiente")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{phase.desc}</p>
                  {phase.key === "transit" && phase.status === "current" && showLocation && (
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-red-500" /> {car.current_location}
                      {timeAgo(car.location_updated_at) && <span className="font-normal text-muted-foreground">· {timeAgo(car.location_updated_at)}</span>}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>

        {hasSideColumn && (
          <div className="space-y-6">
            {car.note && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-2">
                <h2 className="text-sm font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <MessageSquareText className="h-4 w-4" />
                  Mensaje de NorDrive
                </h2>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {car.note}
                </p>
              </div>
            )}

            {car.documents.length > 0 && (
              <SectionCard
                icon={<FileText className="h-5 w-5" />}
                title="Documentos"
              >
                <div className="space-y-2">
                  {car.documents.map((doc) => (
                    <div
                      key={doc.path}
                      className="flex justify-between items-center gap-2 p-2.5 bg-muted/30 hover:bg-muted/60 border border-border/40 rounded-xl transition-all"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p
                          className="text-xs font-semibold truncate text-foreground"
                          title={doc.name}
                        >
                          {doc.name || "Documento"}
                        </p>
                        {formatFileSize(doc.size) && (
                          <p className="text-[10px] text-muted-foreground">
                            {formatFileSize(doc.size)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={openingDoc === doc.path}
                        onClick={() =>
                          openDocument(doc.path, doc.name || "documento")
                        }
                        className="text-primary hover:bg-primary/10 rounded-lg text-xs p-2 h-8 gap-1 flex-shrink-0"
                      >
                        {openingDoc === doc.path ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        Descargar
                      </Button>
                    </div>
                  ))}
                </div>
                {docError && (
                  <p className="text-xs text-destructive font-medium">
                    {docError}
                  </p>
                )}
              </SectionCard>
            )}
          </div>
        )}
      </div>

      {hasChecklist && (
        <SectionCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          title="Inspección del coche"
          subtitle={
            car.checklist_updated_at
              ? `Revisión hecha por NorDrive · ${formatDate(car.checklist_updated_at)}`
              : "Revisión hecha por NorDrive antes de la compra."
          }
        >
          <ChecklistView
            checklist={car.checklist}
            onOpenPhotos={onOpenPhotos}
          />
        </SectionCard>
      )}

      {(gallery.length > 0 || signedPhotos === null) && (
        <SectionCard icon={<ImageIcon className="h-5 w-5" />} title="Fotos">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
            {gallery.map((src, idx) => (
              <button
                key={src + idx}
                type="button"
                onClick={() => onOpenPhotos(gallery, idx)}
                aria-label={`Ver foto ${idx + 1}`}
                className="aspect-square rounded-xl overflow-hidden border border-border hover:border-primary/40 hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {signedPhotos === null &&
              car.photos
                .slice(0, 6)
                .map((p) => (
                  <div
                    key={p.path}
                    className="aspect-square rounded-xl bg-muted animate-pulse"
                  />
                ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

/** Reseña del cliente cuando ya tiene el coche: estrellas, qué le ha gustado y qué cambiaría */
function ReviewCard({ car, onSaved }: { car: PortalCar; onSaved?: () => void }) {
  const [rating, setRating] = useState(car.review_rating ?? 0);
  const [hover, setHover] = useState(0);
  const [liked, setLiked] = useState(car.review_liked ?? "");
  const [improve, setImprove] = useState(car.review_improve ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"" | "saved" | "error">("");
  const [editing, setEditing] = useState(!car.review_rating);

  const submit = async () => {
    if (!rating) return;
    setSaving(true);
    setStatus("");
    const { error } = await supabase.rpc("portal_submit_review", {
      portal_car: car.id,
      stars: rating,
      liked_text: liked.trim() || null,
      improve_text: improve.trim() || null,
    });
    setSaving(false);
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("saved");
    setEditing(false);
    onSaved?.();
  };

  const stars = (value: number, interactive: boolean) => (
    <div className="flex gap-1" onMouseLeave={() => interactive && setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => setRating(n)}
          onMouseEnter={() => interactive && setHover(n)}
          aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
          className={interactive ? "transition-transform hover:scale-110" : "cursor-default"}
        >
          <Star className={`h-7 w-7 ${n <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
        </button>
      ))}
    </div>
  );

  if (!editing && car.review_rating) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-sm p-5 md:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">¡Gracias por tu opinión!</h2>
            <p className="text-sm text-muted-foreground">Nos ayuda mucho a mejorar.</p>
          </div>
          {stars(car.review_rating, false)}
        </div>
        {car.review_liked && <p className="text-sm"><span className="font-semibold">Lo que más te ha gustado:</span> {car.review_liked}</p>}
        {car.review_improve && <p className="text-sm"><span className="font-semibold">Lo que cambiarías:</span> {car.review_improve}</p>}
        <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => setEditing(true)}>
          Editar mi opinión
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-primary/25 rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">¿Qué tal ha ido todo?</h2>
        <p className="text-sm text-muted-foreground">Ya tienes tu {carTitle(car)}. Cuéntanos cómo ha sido la experiencia con NorDrive.</p>
      </div>
      {stars(rating, true)}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-semibold text-foreground">¿Qué es lo que más te ha gustado?</span>
          <textarea
            value={liked}
            onChange={(e) => setLiked(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="La búsqueda, la inspección, el trato, los plazos…"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-semibold text-foreground">¿Qué cambiarías o mejorarías?</span>
          <textarea
            value={improve}
            onChange={(e) => setImprove(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Cualquier cosa que podamos hacer mejor"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
          />
        </label>
      </div>
      <div className="flex items-center justify-end gap-3">
        {status === "error" && <span className="text-sm text-destructive">No se ha podido enviar. Inténtalo de nuevo.</span>}
        {status === "saved" && <span className="text-sm text-green-600 flex items-center gap-1"><Check className="h-4 w-4" /> Enviada</span>}
        {car.review_rating ? (
          <Button type="button" variant="ghost" size="sm" className="rounded-xl" onClick={() => setEditing(false)}>Cancelar</Button>
        ) : null}
        <Button type="button" disabled={!rating || saving} onClick={submit} className="rounded-xl">
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Enviar mi opinión
        </Button>
      </div>
    </div>
  );
}
