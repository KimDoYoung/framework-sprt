# SFU08 FileUpload/소형 업로드 `pay08` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadPay08 L643-694`. TOBE: `PayTaxReceiptController` `POST …` → `PayTaxReceiptService.upload`. **판정: 완료** |
| 2026-11-04 | 대조 | 파일마다 `pay08_tax_withholding.insert`(ID·회사·등록일 f_sysdate())로 영수증 행을 만들고 그 ID를 부모로 첨부를 올린다. TOBE `mapper.insert(id, companyId)` + `fileService.upload`로 같다(SQL `analysis sql`로 확인). 다른 점: 한 요청 한 파일(AS-IS는 여러 개를 한 트랜잭션). 미확인: 실제 업로드 |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
