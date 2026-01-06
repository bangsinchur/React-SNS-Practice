export function formatTimeAgo(time: Date | string | number) {
  const start = new Date(time); //인수에 해당하는 시간을 구하는것
  const end = new Date(); //현재 시간을 구하는것

  const secondDiff = Math.floor((end.getTime() - start.getTime()) / 1000); //밀리세컨즈를 초단위로 바꾸기 위해 1000으로 나눔, Math.floor 소숫점 이하의 자리수를 다 버리는 메서드
  if (secondDiff < 60) return "방금 전";

  const minuteDiff = Math.floor(secondDiff / 60);
  if (minuteDiff < 60) return `${minuteDiff}분 전`;

  const hourDiff = Math.floor(minuteDiff / 60);
  if (hourDiff < 24) return `${hourDiff}시간 전`;

  const dayDiff = Math.floor(hourDiff / 24);
  return `${dayDiff}일 전`;
}
