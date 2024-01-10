"use client";

import { Color } from "@prisma/client";
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
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#([0-9A-F]{3}){1,2}$/i, {
      message: "String must be a valid hex color",
    }),
});

interface ColorFormProps {
  initialColor: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

export default function ColorForm({ initialColor }: ColorFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialColor || {
      name: "",
      value: "",
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();

  const title = initialColor ? "Edit Color" : "Create Color";

  const description = initialColor
    ? "Edit your Color"
    : "Create a new Color";

  const successToastMessage = initialColor
    ? "Color updated"
    : "Color created";

  const action = initialColor ? "Save Changes" : "Create";

  async function onSubmit(values: ColorFormValues) {
    setIsLoading(true);
    try {
      if (initialColor) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, values);
      }
      router.refresh();
      router.push("/" + params.storeId + "/colors");
      router.refresh();
      toast.success(successToastMessage);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onDelete() {
    setIsLoading(true);
    try {
      await axios.delete(
        `/api/${params.storeId}/colors/${params.colorId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("Color deleted");
    } catch (error) {
      toast.error(
        "Delete Failed. Make sure you removed all products using this color"
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
        {initialColor && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"sm"}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <TrashIcon className="h-4 w-4 mr-2" /> Remove Color
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Color name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-x-4">
                        <Input
                          disabled={isLoading}
                          placeholder="Color value"
                          {...field}
                        />
                        <div
                          className="border p-4 rounded-full"
                          style={{ backgroundColor: field.value }}
                        ></div>
                      </div>
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
