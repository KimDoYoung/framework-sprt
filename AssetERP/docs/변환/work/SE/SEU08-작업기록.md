# SEU08 ExcelUpload `demandOprFundUpload` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분석 | 원본 `demandOprFundUpload` L2042-2122(+`oprFundUpload` L1949 = SEU07). 호출 `Fnd31_Page_DemandOprFund`(수요예측 신청 펀드별) [엑셀업로드] L262-285: `apprCheck` 뒤 파일 선택 → `ExcelUpload?uploadType=demandOprFundUpload&oprId`. 열 0 펀드코드·1 펀드명·2 신청수량·3 신청금액·4 구분(1 운용펀드/2 일임(자문)). 구분 1은 `fnd01_fund_code.selectByFundCode`, 2는 `adv02_account.selectByManageCode`로 펀드ID, `fnd31_opr_fund.excelDelete`(새 ID로 지우므로 효과 없음) 후 `excelInsert` |
| 2026-11-04 | 대조 | TOBE `FndOprFundService.upload`(Q05에서 SEU07과 함께 만듦, `POST /api/v1/fnd/opr-funds/excel`)가 종목 구분(`01`=청약, 그 밖=수요예측)으로 열 구성을 고른다. 수요예측 분기: 열·셀 변환(`cellString`·`cellLong`=getStringCellData·getFomulaCellData)·조건(`qty`·`settleAmt` 중 하나가 있을 때 펀드 조회)·INSERT 열(펀드명은 원본도 저장 안 함)·결재완료 검사(`checkNotInAppr` = `apprCheck`)가 같다. 프론트 `Fnd31_Page_DemandOprFund.tsx` L96-106이 호출. **코드 변경 없음** |
| 2026-11-04 | 확인 | 새 시험 `FndOprFundUploadDbTest` 2개 통과(asseterpdb 28000사, 수요예측 종목 `202407041716327`, 롤백): ① 구분 1·2 두 줄 업로드 → 2건, 합계 수량 1300·금액 6,500,000, 가격 null ② 없는 펀드코드·구분 칸 없음 → 메시지와 함께 취소 |
| 2026-11-04 | 미확인 | 화면에서 실제 업로드(브라우저 시험 안 함). 청약(`oprFundUpload`) 쪽 시험은 SEU07 기록 |
| 2026-11-04 | 참고 | 원본-이상한점 후보: `fundId != null ||` 조건은 `fundId`가 항상 null이라 죽은 코드, 펀드를 못 찾으면 `get(0)` 오류(TOBE는 메시지) |

## 비용
묶음 세션(SEU03 참고). 코드 변경 없음, 시험 추가 1파일.
