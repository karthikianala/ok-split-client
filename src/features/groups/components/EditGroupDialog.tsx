import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { groupApi } from "../services/groupApi";
import type { GroupDetail } from "@/shared/types/group.types";

const schema = z.object({
  name: z.string().min(1, "Required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export function EditGroupDialog({ group }: { group: GroupDetail }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: group.name,
      description: group.description ?? "",
    },
  });

  const updateGroup = useMutation({
    mutationFn: (data: FormData) =>
      groupApi.update(group.id, {
        name: data.name,
        description: data.description || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", group.id] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({ title: "Group updated!", variant: "success" });
      setIsOpen(false);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to update group",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) {
    return (
      <Button variant="outline" size="icon" title="Edit group" onClick={() => setIsOpen(true)}>
        <Settings className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Group</h2>
        <form onSubmit={handleSubmit((data) => updateGroup.mutate(data))} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Group Name</label>
            <Input {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input {...register("description")} />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty || updateGroup.isPending}>
              {updateGroup.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
