/** Att02_Edit_Commute·Att02_Edit_CommuteBatch가 같이 쓰는 시각 칸 처리 (AS-IS formatTime / isValidTime / KeyPress 필터) */

/** formatTime(): 숫자만 남겨 6자리·4자리면 HH:mm, 5자리면 앞에 0, 그 밖은 숫자만 */
export const formatTime = (value: string | null | undefined): string | null => {
  if (value == null) return null;
  const v = value.replace(/[^0-9]/g, '');
  if (v.length === 6 || v.length === 4) return `${v.slice(0, 2)}:${v.slice(2, 4)}`;
  if (v.length === 5) return `0${v.slice(0, 1)}:${v.slice(1, 3)}`;
  return v;
};

/** isValidTime(): HH:mm (00:00~23:59) */
export const isValidTime = (time: string): boolean => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

/** KeyPress: 숫자와 ':'만 입력 */
export const onlyTimeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key.length === 1 && !/[0-9:]/.test(e.key)) e.preventDefault();
};
