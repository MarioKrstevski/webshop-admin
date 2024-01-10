import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CopyIcon, ServerIcon } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}
const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};
const variantMap: Record<
  ApiAlertProps["variant"],
  BadgeProps["variant"]
> = {
  public: "secondary",
  admin: "destructive",
};

export default function ApiAlert({
  title,
  description,
  variant = "public",
}: ApiAlertProps) {
  function onCopy() {
    navigator.clipboard.writeText(description);
    toast.success("API route copied to clipboard");
  }
  return (
    <Alert>
      <ServerIcon className="w-4 h-4" />
      <AlertTitle>
        {title}
        <Badge className="mx-1" variant={variantMap[variant]}>
          {textMap[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant={"outline"} size={"icon"} onClick={onCopy}>
          <CopyIcon className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
