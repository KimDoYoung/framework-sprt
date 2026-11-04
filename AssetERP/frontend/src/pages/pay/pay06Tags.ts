/**
 * 계약서 양식 & 태그 목록 (S13) — AS-IS TempData.getActMappingList().
 * 연봉계약 그리드의 셀을 한 번도 누르지 않았으면 기본 목록(L176-204), 누른 뒤(createMapping E14)에는 그 매핑 키 목록(L209-215)이다.
 * 두 목록은 이름이 한 곳 다르다(기본 "연장근로시간(월)" ↔ 매핑 키 "연장근로시간") — AS-IS 그대로.
 * AS-IS 매핑 키 목록은 Java HashMap 순서라 일정하지 않지만, 여기서는 선언한 순서로 보인다.
 */
const DEFAULT_TAGS = [
  '사번', '성명', '직위', '주소', '생년월일', '부서명', '입사일', '적용시작일', '적용종료일', '시업시간', '종업시간',
  '연장근로시간(월)', '기본연봉', '퇴직금', '총연봉', '기타약정사항', '기본급여', '중식대', '차량유지비', '양육수당',
  '연장근로', '기타급여1', '기타급여2', '합계', '회사명', '회사주소', '회사대표', '년월일',
];

/** createMapping() L682-727의 mapping.put 키 순서 */
export const ACT_MAPPING_KEYS = [
  '사번', '성명', '직위', '주소', '생년월일', '부서명', '입사일',
  '적용시작일', '적용종료일', '시업시간', '종업시간', '연장근로시간', '기본연봉', '퇴직금', '총연봉', '기타약정사항',
  '기본급여', '중식대', '차량유지비', '양육수당', '연장근로', '기타급여1', '기타급여2', '합계',
  '회사명', '회사주소', '회사대표', '년월일',
];

let current: string[] = [];

/** TempData.setActMappingList */
export const setActMappingKeys = (keys: string[]) => { current = keys; };

/** TempData.getActMappingList — 비어 있으면 기본 목록 */
export const getActMappingTags = (): string[] => (current.length === 0 ? DEFAULT_TAGS : current.filter(k => k !== ''));

/**
 * 퇴직정산서 양식 & 태그 목록 (EE95) — AS-IS TempData.getRetireMappingList() L295-343.
 * AS-IS는 certMappingList가 비었을 때 기본 목록(L300-327)을, 아니면 retireMappingList(setRetireMappingList — 어디서도 부르지 않음)를 쓴다.
 * 증명서 매핑 목록은 TOBE에 없으므로 기본 목록을 쓴다.
 */
const RETIRE_TAGS = [
  '퇴직자', '퇴직일', '소 속', '직 위',
  '기본급', '차량유지비', '식대', '기타지급',
  '국민연금', '건강보험료', '건강보험료.당월', '건강보험료.퇴직정산', '장기요양보험료', '장기요양보험료.당월', '장기요양보험료.퇴직정산',
  '고용보험료', '고용보험료.당월', '고용보험료.퇴직정산', '근로소득세.정산', '근로소득주민세.정산',
  '지급금 계', '공제금 계', '차감지급액',
];

export const getRetireMappingTags = (): string[] => RETIRE_TAGS;
