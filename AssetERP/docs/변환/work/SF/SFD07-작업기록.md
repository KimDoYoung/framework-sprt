# SFD07 FileDownload `apprList` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 대조 | 원본 `downloadApprList L281-313`. TOBE: `SysFileController.downloadApprZip` `GET /api/v1/sys/files/appr-zip?apprIds` → `SysFileService.getApprZipEntries` |
| 2026-11-04 | 결과 | **완료.** 상신 ID마다 `sys10_file.selectByParentId`, 본문(`titleYn`)은 `(n) [본문] 이름`, 첨부는 `(n-m) [첨부파일] 이름`(번호 증감 규칙 그대로), 압축 뒤 `(순서) ` 접두, `Asset-ERP_DOC.zip`. TOBE 주석·코드가 L281-310과 같고 F09에서 확인됨(`selectByApprId`는 AS-IS `selectByParentId`와 같은 정렬). 이번 세션에서 코드 재대조: 번호 규칙 동일 |
| 2026-11-04 | 참고 | 호출 화면 `Dcr00_Tab_ApprList`는 zip 받기 전에 서비스 `utils.pdf.PDFCreate.createInPDF7`(L282)로 선택 문서의 PDF를 먼저 만들고(`fileDownload()` L295), 받은 뒤 `apr.Apr40_DownloadHistory.updateList`(L322)로 다운로드 이력을 남긴다. 서블릿 분기는 PDF 생성을 하지 않으므로 이 대조 범위 밖이지만, TOBE `Dcr00_Tab_ApprList.tsx`는 PDF 만들기(`createInPDF7`)를 **"다음 단계"로 생략**하고(L6·66, 본문 파일이 없는 사내문서의 PDF를 만드는 `Apr10_StampPDF7.getInDocument`) 바로 zip을 받으며, 이력 기록(L75)은 한다. 그래서 본문 파일이 없는 사내문서는 TOBE zip에 본문 PDF가 빠진다 — **서블릿이 아니라 `Dcr00_Tab_ApprList` 화면의 미완 항목**(F09 후속, 서블릿 목록에는 없음) |

## 비용
파일 계열 대조 묶음 세션(SFD01~08). 코드 변경 없음. `yunhee cat FileDownload.java`·`yunhee grep`·`analysis sql`로 대조.
