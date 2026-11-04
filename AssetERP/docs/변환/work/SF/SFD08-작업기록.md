# SFD08 FileDownload `feeCharge` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 대조 | 원본 `downloadFeeChargeZip L315-344`. TOBE: `BizFeeChargeController.filesZip` `GET /api/v1/biz/fee-charges/files/zip?chargeDate` → `BizFeeChargeService.zipEntries` |
| 2026-11-04 | 결과 | **완료.** 청구일(`chargeDate`)·검색어 '%'로 `biz20_fee_charge.selectByChargeDate` → 행마다 `realFeeChargeId`의 `sys10_file.selectByParentId` 모아 `Asset-ERP.zip`. TOBE `selectFileIds`는 같은 UNION(본인 + `sys11_relate_file`) 쿼리로 ID만 뽑고 `getZipEntries`로 담는다 — 순서·이름 규칙 같음. **다른 점**: 파일이 하나도 없으면 AS-IS는 빈 zip, TOBE는 "파일 리스트가 없습니다."(공통 처리) / AS-IS 날짜 형식 오류는 "날짜 형식 오류" 텍스트(TOBE는 Spring 400) |
| 2026-11-04 | 참고 | 호출 화면 `Biz20_Tab_FeeCharge` [파일 일괄 다운로드](L715) → TOBE `bizFee.ts`. 쿼리 순서(`COALESCE(sys10_file_yn) ASC, 번호, 본문 DESC, 이름`)는 SQL 본문으로 대조(`BizFeeChargeMapper.xml` L861-) |

## 비용
파일 계열 대조 묶음 세션(SFD01~08). 코드 변경 없음. `yunhee cat FileDownload.java`·`yunhee grep`·`analysis sql`로 대조.
