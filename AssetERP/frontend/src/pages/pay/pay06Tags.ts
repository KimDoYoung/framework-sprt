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
