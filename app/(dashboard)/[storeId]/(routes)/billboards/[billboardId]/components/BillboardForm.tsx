"use client";

import { Billboard } from "@prisma/client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ApiAlert from "@/components/ApiAlert";
import useOrigin from "@/hooks/useOrigin";
import ImageUpload from "@/components/ImageUpload";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().url(),
});

interface BillboardFormProps {
  initialBillboard: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;

export default function BillboardForm({
  initialBillboard,
}: BillboardFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialBillboard || {
      label: "",
      imageUrl: "",
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();

  const title = initialBillboard
    ? "Edit Billboard"
    : "Create Billboard";

  const description = initialBillboard
    ? "Edit your billboard"
    : "Create a new billboard";

  const successToastMessage = initialBillboard
    ? "Billboard updated"
    : "Billboard created";

  const action = initialBillboard ? "Save Changes" : "Create";

  async function onSubmit(values: BillboardFormValues) {
    console.log("values", values);
    setIsLoading(true);
    try {
      if (initialBillboard) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, values);
      }
      router.refresh();
      router.push("/" + params.storeId + "/billboards");
      // add this because billboard doesnt refresh, maybe remove for production
      router.refresh();
      toast.success(successToastMessage);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    console.log("values", values);
  }

  async function onDelete() {
    setIsLoading(true);
    try {
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted");
    } catch (error) {
      toast.error(
        "Delete Failed. Make sure you removed all categories using this billboard"
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }
  return (
    <>
      <AlertModal
        isLoading={isLoading}
        isOpen={isOpen}
        onConfirm={onDelete}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialBillboard && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"sm"}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <TrashIcon className="h-4 w-4 mr-2" /> Remove Billboard
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={isLoading}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      onRemove={() => {
                        field.onChange("");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Billboard label"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            disabled={isLoading}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
