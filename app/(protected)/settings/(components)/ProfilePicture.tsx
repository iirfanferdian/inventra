import { Button } from "@/components/ui/button";
import { CircleUser, Pencil, X, Check, Loader2 } from "lucide-react";
import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import Image from "next/image";
import { uploadAvatar } from "@/app/actions/profile";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const ProfilePicture = () => {
  const { data: session, update, status } = useSession();

  // State untuk proses cropping saja
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const userImage = session?.user?.image;

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result);
      };
    }
  };

  const onCropComplete = useCallback((_area, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleUpload = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);

    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);

      const reader = new FileReader();
      reader.readAsDataURL(croppedBlob);
      reader.onloadend = async () => {
        const base64data = reader.result;

        //Upload to cloudinary
        const result = await uploadAvatar(base64data);

        if (result.success) {
          // Update Session NextAuth to get fast preview

          await update({
            ...session,
            user: {
              ...session?.user,
              image: result.url,
            },
          });

          setImage(null);
          toast.success("Profile Image Updated Successfully");
        } else {
          toast.error(result.error || "Failed to upload");
        }
        setLoading(false);
      };
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during upload");
      setLoading(false);
    }
  };

  if (status === "loading")
    return <div className="w-32 h-32 rounded-full animate-pulse bg-muted" />;

  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative w-32 h-32 bg-primary rounded-full shadow-inner">
        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-muted">
          {userImage ? (
            <Image
              src={
                userImage.includes("?")
                  ? userImage
                  : `${userImage}?t=${Date.now()}`
              }
              alt="Profile Picture"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <CircleUser
              size={70}
              className="text-primary-foreground dark:text-foreground opacity-80"
            />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onFileChange}
          onClick={(e) => (e.target.value = null)}
        />

        <Button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="absolute z-10 p-2 right-1 bottom-1 bg-muted-foreground/80 hover:bg-muted-foreground rounded-full h-10 w-10 border-2 border-background flex items-center justify-center shadow-md transition-all active:scale-90"
        >
          <Pencil size={18} className="text-white" />
        </Button>
      </div>

      {/* MODAL CROPPER */}
      {image && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg aspect-square bg-neutral-900 rounded-xl overflow-hidden shadow-2xl">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="w-full max-w-lg mt-6 space-y-6 px-4 text-white">
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium opacity-80">
                Geser & Zoom untuk menyesuaikan
              </p>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setImage(null)}
                className="rounded-full px-6 py-6 border-white/20 text-white hover:bg-white/10"
              >
                <X className="mr-2 h-5 w-5" /> Batal
              </Button>

              <Button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className="rounded-full px-8 py-6 bg-primary text-primary-foreground font-bold text-lg shadow-lg"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Check className="mr-2 h-5 w-5" />
                )}
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
