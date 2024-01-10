"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryColumn } from "./Columns";
import { Button } from "@/components/ui/button";
import {
  CopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AlertModal from "@/components/modals/AlertModal";

type CellActionProps = {
  data: CategoryColumn;
};
export function CellAction({ data }: CellActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  function onCopy(id: string) {
    navigator.clipboard.writeText(id);
    toast.success("Category Id copied to clipboard");
  }
  const router = useRouter();
  const params = useParams();

  async function onDelete() {
    setIsLoading(true);
    try {
      await axios.delete(
        `/api/${params.storeId}/categories/${data.id}`
      );
      router.refresh();
      toast.success("Category deleted");
    } catch (error) {
      toast.error(
        "Delete Failed. Make sure you removed all products using this category first"
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }
  return (
    <>
      <AlertModal
        isOpen={isOpen}
        isLoading={isLoading}
        onConfirm={onDelete}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              router.push(
                `/${params.storeId}/categories/${data.id}/`
              );
            }}
          >
            <EditIcon className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onCopy(data.id);
            }}
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
