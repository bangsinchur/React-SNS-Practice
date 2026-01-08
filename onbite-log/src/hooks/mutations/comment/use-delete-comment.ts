import { createComment, deleteComment, updateComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { ProfileEntity, UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteComment(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

    //   queryClient.setQueryData<ProfileEntity>(
    //     QUERY_KEYS.profile.byId(updatedProfile.id),
    //     updatedProfile,
    //   );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
