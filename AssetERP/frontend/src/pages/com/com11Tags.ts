/**
 * 상세코드별 데이터연결 양식의 태그 목록 (Q08) — AS-IS TempData.getPfContractMappingList01/02()의 기본 목록(TempData가 비었을 때).
 * AS-IS는 용역계약체결(Est02_Tab_PfContract L377)·용역결과보고서(Est02_Tab_PfResultReport L289)가 열릴 때 TempData를 채워 바꿀 수 있다 —
 * 두 화면(Q09·Q12)을 변환할 때 같은 이름으로 채우는 방법을 정한다. 그 전에는 항상 기본 목록이다.
 * Com11_Lookup_FormMappingMulti.open() L67-89가 linkCode로 고르는 목록.
 */
const BY_LINK_CODE: Record<string, string[]> = {
  // A60 용역계약체결
  A60: ['용역수행회사', '사업장명', '사업장 주소지', '수수료명', '용역 수행기간', '문의처', '용역 수행계획', '첨부파일'],
  // A61 용역 결과보고서
  A61: ['용역수행회사', '사업장명', '사업장 주소지', '수수료명', '용역 수행기간', '문의처', '용역 수행내역', '첨부파일'],
};

/** linkCode의 태그 목록 (없으면 null — "데이터연결 양식을 지원하지 않습니다") */
export const multiTagsOf = (linkCode: string): string[] | null => BY_LINK_CODE[linkCode] ?? null;
