export const formatLongTitle = (title?: string) => {
  if (!title) return '';
  
  // If it's a specific known string that the user explicitly wanted formatted this way
  if (title === '다음 행동과 날짜를 정해 실제 계획 확정하기') {
    return '다음 행동과 날짜를 정해\n실제 계획 확정하기';
  }
  
  // Otherwise, let the screen layout (flexbox/text wrapping) auto-adjust it!
  return title;
};
