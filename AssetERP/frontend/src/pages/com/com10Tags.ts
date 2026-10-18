/**
 * 데이터연결 양식의 태그 목록 (E17) — AS-IS TempData.get*MappingList()의 기본 목록(TempData가 비었을 때).
 * AS-IS는 다른 화면(Emp15·Emp17·Emp20)이 열릴 때 TempData를 채워 바꿀 수 있지만 관리자 화면에서는 채워지지 않으므로 항상 기본 목록이다.
 * 양식 연결 코드(linkCode)별로 Com10_Lookup_CommonMapping.open() L72-150이 고르는 목록.
 */
const leave = ['회사명', '부서명', '성명', '직위', '휴가구분', '휴가시작일', '휴가종료일', '휴가기간', '사유', '대결자', '대직자', '비상망', '상신일'];
const cert = ['사번', '성명', '생년월일', '주민번호', '부서명', '주소', '직책', '직위', '입사일', '퇴사일', '근속년수', '발급일', '용도', '발령내역', '징계내역', '회사명', '회사주소', '회사대표'];
const eachCont = ['계약회사명', '계약회사주소', '계약회사대표이사', '펀드명', '보수율', '계약일', '설정일', '비고'];
const benefit = ['부서', '직위', '직책', '성명', '내용', '상신일', '신청금액', '신청금액_한글', '전화번호', '발생일자', '발생년월'];
const errand = ['소속', '성명', '구분', '일자', '외출시각', '복귀시각', '사유', '주최자', '장소', '비고'];
const userRegAppr = ['소속회사', '처리구분', '신청내용', '사용자', '신규yn', '변경yn', '삭제yn'];
const pmWork = ['소속', '사번', '성명', '직급', '직책', '연락처', '신청일자', '근무일자', '근무시간', '휴게시간', '실근로', '사유'];
const overtimeReq = ['소속', '사번', '성명', '직급', '직책', '연락처', '신청일자', '근무일자', '구분', '근무시간', '시간분', '사유', '보상방법'];
const bizTripAppr = ['소속', '성명', '출장인원', '동반인', '출장지', '출장기간', '출장목적'];
const bizTripResultAppr = ['소속', '성명', '출장인원', '동반인', '출장지', '출장기간', '출장목적'];
const extrActivity = ['성명', '사번', '부서명', '직책', '신청일자', '활동처', '활동대상', '활동기간', '활동내용', '활동보수', '첨부자료'];
const resultExtrActivity = ['성명', '사번', '부서명', '직책', '신청일자', '활동처', '활동대상', '활동기간', '활동내용', '활동보수'];

const BY_LINK_CODE: Record<string, string[]> = {
  A01: leave,
  B01: cert, B02: cert, B03: cert, B04: cert,
  C01: eachCont,
  A21: benefit, A22: benefit, A23: benefit, A37: benefit, A49: benefit,
  A45: errand,
  A33: userRegAppr,
  A73: pmWork,
  A74: overtimeReq,
  B11: bizTripAppr, B13: bizTripAppr,
  B12: bizTripResultAppr, B14: bizTripResultAppr,
  B15: extrActivity,
  B16: resultExtrActivity,
};

/** linkCode의 태그 목록 (없으면 null — D01 "특정양식 지정 (연봉계약서)"만 가능, 그 밖은 "데이터연결 양식을 지원하지 않습니다") */
export const tagsOf = (linkCode: string): string[] | null => BY_LINK_CODE[linkCode] ?? null;
