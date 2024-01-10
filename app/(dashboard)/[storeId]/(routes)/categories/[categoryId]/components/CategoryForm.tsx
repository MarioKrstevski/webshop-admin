"use client";

import { Category, Billboard } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

interface CategoryFormProps {
  initialCategory: Category | null;
  billboards: Billboard[];
}

type CategoryFormValues = z.infer<typeof formSchema>;

export default function CategoryForm({
  initialCategory,
  billboards,
}: CategoryFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialCategory || {
      name: "",
      billboardId: "",
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();

  const title = initialCategory ? "Edit category" : "Create category";

  const description = initialCategory
    ? "Edit your category"
    : "Create a new category";

  const successToastMessage = initialCategory
    ? "category updated"
    : "category created";

  const action = initialCategory ? "Save Changes" : "Create";

  async function onSubmit(values: CategoryFormValues) {
    console.log("values", values);
    setIsLoading(true);
    try {
      if (initialCategory) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, values);
      }
      router.refresh();
      router.push("/" + params.storeId + "/categories");
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
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted");
    } catch (error) {
      toast.error(
        "Delete Failed. Make sure you removed all products using this category"
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
        {initialCategory && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"sm"}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <TrashIcon className="h-4 w-4 mr-2" /> Remove category
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
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Category name"
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
              name="billboardId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Billboard</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => {
                          return (
                            <SelectItem
                              value={billboard.id}
                              key={billboard.id}
                            >
                              {billboard.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
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
