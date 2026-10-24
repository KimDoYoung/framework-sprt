/**
 * 임원별 직책배정 저장 전 검사 (N11) — 책무배분 등록창·수정창이 같은 코드를 쓴다.
 * AS-IS: Tdm30_Edit_RoleAllc.updateChk02 L240-328 · Tdm30_Edit_RoleAllcModify.updateChk02 L180-268
 * (Tdm30_Tab_RoleAllc.updateChk02 L407-497은 [저장] 버튼이 주석 처리되어 부르는 곳이 없다)
 */
import { TdmRoleAllc } from '@/types/tdm';

export type RoleAllcPeriod = Pick<TdmRoleAllc, 'personId' | 'personName' | 'roleId' | 'roleName' | 'addTitleYn' | 'startDate' | 'endDate'>;

/** 직책해제일이 없으면 2999-01-01 (AS-IS ClientDateUtil.toDate("2999-01-01")) */
const endOf = (m: RoleAllcPeriod) => m.endDate ?? '2999-01-01';

/**
 * mergeList = [저장할 행, 나머지 직책배정 …]. 문제가 있으면 AS-IS 메시지를 돌려준다.
 * ① 기준일에 유효한 본업무(겸직 아님)가 한 사람에 둘 이상이면 안 된다 ② 같은 직책의 직책기간이 겹치면 안 된다
 */
export function checkRoleAllcMerge(mergeList: RoleAllcPeriod[], baseDate: string): string | undefined {
  // 본업무 갯수 체크
  const countMap = new Map<number | null, number>();
  for (const m of mergeList) {
    if (baseDate <= endOf(m) && (m.startDate ?? '') <= baseDate && !m.addTitleYn) {
      const count = (countMap.get(m.personId) ?? 0) + 1;
      if (count >= 2) return `${m.personName}님의 본업무가 1개 이상입니다. 확인 후 저장하세요`;
      countMap.set(m.personId, count);
    }
  }
  // 직책 중복기간 체크
  for (let i = 0; i < mergeList.length; i++) {
    const m1 = mergeList[i];
    for (let j = i + 1; j < mergeList.length; j++) {
      const m2 = mergeList[j];
      if (m1.roleId != null && m1.roleId === m2.roleId) {
        const overlap = (m1.startDate ?? '') <= endOf(m2) && endOf(m1) >= (m2.startDate ?? '');
        if (overlap) return `'${m1.personName}'님과 '${m2.personName}'님의 '${(m1.roleName ?? '').trim()}'직책의 직책기간이 겹칩니다`;
      }
    }
  }
  return undefined;
}
