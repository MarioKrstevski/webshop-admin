import { useStoreModal } from "@/hooks/useStoreModal";
import { Modal } from "@/components/ui/custom/modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3),
});

export function StoreModal() {
  const storeModal = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: create store
    console.log("values", values);

    try {
      setIsLoading(true);
      const response = await axios.post("/api/stores", values);
      console.log("", response.data);
      // redirect(`/${response.data.id}`);
      // we are not using the next redirect because we want to reload the page and guarantee that the modal wont show after redirect
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and actegories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="E-commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end">
              <Button
                disabled={isLoading}
                variant={"outline"}
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
