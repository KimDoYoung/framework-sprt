# SFD09 FileDownload `pdfZip` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분석 | 원본 `downloadPdfZip` L346-358: `companyId`·`yearMonth`로 `sys10_file.selectByPaySlipId`를 읽어 `Asset-ERP_{yyyyMM}_PAY.zip`(급여명세 PDF 묶음). 같은 SQL을 `FileDelete mode=pdfZip`(SFX02)도 쓴다 |
| 2026-11-04 | 호출 확인 | `yunhee grep`로 GWT `client/` 전체와 `webapp/`에서 `pdfZip`·`yearMonth=` 검색 → 서블릿 2곳(`FileDownload`·`FileDelete`) 말고 **호출하는 곳이 없다**. `fileType`을 문자열로 이어 붙이는 코드도 없다. 급여 PDF 화면(`Pay08_Tab_TaxWithholding`)은 `PDFLoader`를 쓴다 |
| 2026-11-04 | 결정 대기 | 상태를 `대기` → **`호출없음`**으로 바꾼다. 사용자 확인 후 `제외` 확정(서블릿-변환목록 §2 규칙). 새 코드 없음. 과거 화면이 지워진 흔적일 수 있다 |
| 2026-11-04 | 참고 | `selectByPaySlipId`가 AS-IS 매퍼에 있어 SFD09·SFX02를 살리게 되면 TOBE 매퍼로 옮겨야 한다(`yunhee port-sql`). 급여명세서 PDF 업로드는 SFU08(`pay08`) |

## 비용
묶음 세션(SFD06 작업기록 참고). 코드 변경 없음.
