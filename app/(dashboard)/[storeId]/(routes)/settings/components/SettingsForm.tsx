"use client";

import { Store } from "@prisma/client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { FormInput, TrashIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { set, z } from "zod";
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

interface SettingsFormProps {
  initialStore: Store;
}

const formSchema = z.object({
  name: z.string().min(3),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsForm({
  initialStore,
}: SettingsFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialStore,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();
  async function onSubmit(values: SettingsFormValues) {
    setIsLoading(true);
    try {
      await axios.patch(`/api/stores/${params.storeId}`, values);
      router.refresh();
      toast.success("Store updated");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
    console.log("values", values);
  }

  async function onDelete() {
    setIsLoading(true);
    try {
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      router.refresh();
      toast.success("Store deleted");
    } catch (error) {
      toast.error("Something went wrong");
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
        <Heading
          title="Settings"
          description="Manage store preferences"
        />
        <Button
          disabled={isLoading}
          variant={"destructive"}
          size={"sm"}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <TrashIcon className="h-4 w-4 mr-2" /> Remove Store
        </Button>
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
                        placeholder="Store name"
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
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
}
