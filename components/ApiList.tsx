"use client";

import useOrigin from "@/hooks/useOrigin";
import { add } from "date-fns";
import { Yeseva_One } from "next/font/google";
import { useParams } from "next/navigation";
import ApiAlert from "@/components/ApiAlert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}
export function ApiList({ entityIdName, entityName }: ApiListProps) {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${params.storeId}/${entityName}`;

  return (
    <div>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/{${entityIdName}}`}
      />
    </div>
  );
}
