import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useSession } from "@/store/session";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useUpdatePost } from "@/hooks/mutations/post/use-update--post";

type Image = {
  file: File;
  previewUrl: string;
};

export default function PostEditorModal() {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();

  const postEditorModal = usePostEditorModal();

  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      postEditorModal.actions.close();
    },
    onError: (error) => {
      toast.error("포스트 생성에 실패했습니다.", {
        position: "top-center",
      });
    },
  });

  const { mutate: updatePost, isPending: isUpdatePostPending } = useUpdatePost({
    onSuccess: () => {
      postEditorModal.actions.close();
    },
    onError: (error) => {
      toast.error("포스트 수정에 실패했습니다.", {
        position: "top-center",
      });
    },
  });

  const [content, setContent] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; //높이를 초기화
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; //현재의 스크롤 높이로 자동적으로 높여줌
    }
  }, [content]);

  useEffect(() => {
    if (!postEditorModal.isOpen) {
      images.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
      return;
    }
    if (postEditorModal.type === "CREATE") {
      setContent("");
      setImages([]);
    } else {
      setContent(postEditorModal.content);
      setImages([]);
    }

    textareaRef.current?.focus();
    
  }, [postEditorModal.isOpen]);

  const handleCloseModal = () => {
    if (content !== "" || images.length !== 0) {
      openAlertModal({
        title: "게시글 작성이 마무리 되지 않았습니다.",
        description: "이 화면에서 나가면 작성중이던 내용이 사라집니다.",
        onPositive: () => {
          postEditorModal.actions.close();
        },
      });
      return; //조건문 밖에 잇는 close()함수가 동작하지 않도록 , (비어있지 않은경우)
    }

    postEditorModal.actions.close();
  };

  const handleSavePostClick = () => {
    if (content.trim() === "") return;
    if (!postEditorModal.isOpen) return;

    if (postEditorModal.type === "CREATE") {
      createPost({
        content,
        images: images.map((image) => image.file),
        userId: session!.user.id, //라우트 가드를 통해서 들어온 사용자만이 사용할수 있는 기능이기에 가능!
      });
    } else {
      if (content === postEditorModal.content) return;
      updatePost({
        id: postEditorModal.postId,
        content: content,
      });
    }
  };

  const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files); //배열형태로 변환해서 담아준다

      files.forEach((file) => {
        setImages((prev) => [
          ...prev,
          { file, previewUrl: URL.createObjectURL(file) }, //createObjectURL은 인수로 전달한 이미지 파일을 가져가서 임시용 URL 주소를 만들어서 반환함.
        ]);
      });
    }

    e.target.value = ""; //동일한 파일을 두번이상 업로드 하려고 할때 입력값이 바뀌지 않았다고 인식을 해서 이벤트 핸들러가 실행되지 않을수도 있기에 초기화를 한번하는것.
  };

  const handleDeleteImage = (image: Image) => {
    setImages((prevImages) =>
      prevImages.filter((item) => item.previewUrl !== image.previewUrl),
    );

    URL.revokeObjectURL(image.previewUrl); //브라우저 캐시에서 이미지를 삭제하는것
  };

  const isPending = isCreatePostPending || isUpdatePostPending;

  return (
    <Dialog open={postEditorModal.isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-h-[90vh]">
        <DialogTitle>포스트 작성</DialogTitle>
        <textarea
          disabled={isPending}
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="max-h-125 min-h-25 focus:outline-none"
          placeholder="무슨일이 있었나요?"
        />
        <input
          onChange={handleSelectImages}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
        />
        {postEditorModal.isOpen && postEditorModal.type === "EDIT" && (
          <Carousel>
            <CarouselContent>
              {postEditorModal.imageUrls?.map((url) => (
                <CarouselItem className="basis-2/5" key={url}>
                  <div className="relative">
                    <img
                      className="h-full w-full rounded-sm object-cover"
                      src={url}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        {images.length > 0 && (
          <Carousel>
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem className="basis-2/5" key={image.previewUrl}>
                  <div className="relative">
                    <img
                      className="h-full w-full rounded-sm object-cover"
                      src={image.previewUrl}
                    />
                    <div
                      onClick={() => handleDeleteImage(image)}
                      className="absolute top-0 right-0 m-1 cursor-pointer rounded-full bg-black/30 p-1"
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        {postEditorModal.isOpen && postEditorModal.type === "CREATE" && (
          <Button
            onClick={() => {
              fileInputRef.current?.click();
            }}
            disabled={isPending}
            variant={"outline"}
            className="cursor-pointer"
          >
            <ImageIcon />
            이미지 추가
          </Button>
        )}

        <Button
          disabled={isPending}
          onClick={handleSavePostClick}
          className="cursor-pointer"
        >
          저장
        </Button>
      </DialogContent>
    </Dialog>
  );
}
