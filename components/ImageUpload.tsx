"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ImagePlusIcon, TrashIcon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}
export default function ImageUpload({
  disabled,
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  function onUpload(result: any) {
    onChange(result.info.secure_url);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                variant="destructive"
                type="button"
                size="icon"
                onClick={() => onRemove(url)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
            <Image
              src={url}
              fill
              className="object-cover"
              alt="Image Upload"
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="atecpmuc">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              disabled={disabled}
              variant={"secondary"}
              onClick={onClick}
            >
              <ImagePlusIcon className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
