import supabase from "@/lib/supabase";
import { deleteImages, uploadImage } from "./image";
import type { PostEntity } from "@/types";

export async function fetchPosts({ from, to }: { from: number; to: number }) {
  const { data, error } = await supabase
    .from("post")
    .select("*, author: profile!author_id (*)")
    .order("created_at", { ascending: false }) //오름차순을 false로 하여, 내림차순으로 만듦.
    .range(from, to);

  if (error) throw error;
  return data;
}

export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createPostWithImages({
  content,
  images,
  userId,
}: {
  content: string;
  images: File[];
  userId: string;
}) {
  //1. 새로운 포스트 생성
  const post = await createPost(content);
  if (images.length === 0) return post;

  const uploadedFilePaths: string[] = [];

  try {
    //2. 이미지 업로드(병렬처리)
    const imageUrls = await Promise.all(
      images.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp";
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${userId}/${post.id}/${fileName}`;

        uploadedFilePaths.push(filePath);
        return uploadImage({ file: image, filePath });
      }),
    );

    //3.포스트 테이블 업데이트
    const updatedPost = await updatePost({
      id: post.id,
      image_urls: imageUrls,
    });

    return updatedPost;
  } catch (error) {
    // deletePost(post.id);
    // if (uploadedFilePaths.length > 0) {
    //   await deleteImages(uploadedFilePaths);
    // }
    await Promise.all([
      deletePost(post.id),
      uploadedFilePaths.length > 0
        ? deleteImages(uploadedFilePaths)
        : Promise.resolve(),
    ]);
    throw error;
  }
}

export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deletePost(id: number) {
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
