import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Group } from "@/shared/types/group.types";

export function GroupCard({ group }: { group: Group }) {
  return (
    <Link to={`/groups/${group.id}`}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{group.name}</h3>
              {group.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {group.description}
                </p>
              )}
            </div>
            {group.imageUrl && (
              <img
                src={group.imageUrl}
                alt={group.name}
                className="ml-3 h-12 w-12 rounded-lg object-cover shrink-0"
              />
            )}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
