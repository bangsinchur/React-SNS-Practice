import { create } from "zustand";
import {
  combine,
  subscribeWithSelector,
  persist,
  createJSONStorage,
  devtools,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

//미들웨어 combine -> 타입을 자동으로 추론
//미들웨어 immer -> 내부의 상태 업데이트를 편리하게 바꿈
export const useCountStore = create(
  devtools(
    persist(
      subscribeWithSelector(
        immer(
          combine({ count: 0 }, (set, get) => ({
            actions: {
              increase: () => {
                set((state) => {
                  state.count += 1;
                });
              },
              decrease: () => {
                set((state) => {
                  state.count -= 1;
                });
              },
            },
          })),
        ),
      ),
      {
        //로컬스토리지에 저장할 이름
        name: "countStore",
        partialize: (store) => ({ count: store.count }),
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    {
      name: "countSotre",
    },
  ),
);

useCountStore.subscribe(
  (store) => store.count,
  (변화된카운트, 이전카운트) => {
    console.log(변화된카운트, 이전카운트);

    //현재 store의 값을 가져오는 getState();
    const store = useCountStore.getState();

    //현재 store의 값을 변경하는 setState();
  },

  //현재
);

// 기본적인 새로운 store 생성 함수
// export const useCountStore = create<Store>((set, get) => ({
//   count: 0,
//   increase: () => {
//     set((store) => ({ count: store.count + 1 }));
//   },
//   decrease: () => {
//     set((store) => ({
//       count: store.count - 1,
//     }));
//   },
// }));

//커스텀 훅
export const useCount = () => {
  const count = useCountStore((store) => store.count);

  return count;
};

export const useIncrease = () => {
  const increase = useCountStore((store) => store.actions.increase);

  return increase;
};

export const useDecrease = () => {
  const decrease = useCountStore((store) => store.actions.decrease);

  return decrease;
};
