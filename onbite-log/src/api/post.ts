import supabase from "@/lib/supabase";
import { deleteImages, uploadImage } from "./image";
import type { PostEntity } from "@/types";

export async function fetchPosts({
  from,
  to,
  userId,
}: {
  from: number;
  to: number;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("post")
    .select("*, author: profile!author_id (*), myLiked:like!post_id (*)")
    .eq("like.user_id", userId) //like.user_id = '현재 유저의 아이디" 랑 같은 것만
    .order("created_at", { ascending: false }) //오름차순을 false로 하여, 내림차순으로 만듦.
    .range(from, to);

  if (error) throw error;
  return data.map((post) => ({
    ...post,
    isLiked: post.myLiked && post.myLiked.length > 0, //조아요를 눌럿는지를 boolean타입으로 저장
  }));
}

export async function fetchPostById({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("post")
    .select("*, author: profile!author_id (*), myLiked:like!post_id (*)")
    .eq("like.user_id", userId)
    .eq("id", postId) //id = postId가 같은 아이템만
    .single(); //single매서드를 이용해서 딱 한개 불러오도록

  if (error) throw error;
  return {
    ...data,
    isLiked: data.myLiked && data.myLiked.length > 0,
  };
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

//좋아요 버튼을 눌렀을때 원격으로 RPC를 통해 호출하는 비동기 함수
export async function togglePostLike({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { data, error } = await supabase.rpc("toggle_post_like", {
    p_post_id: postId,
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}
