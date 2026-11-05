# SFD06 FileDownload `fileType=selectList` — 작업방법

## AS-IS → TOBE
- 원본: `FileDownload.downloadSelectList` L258-279 → `createZip` L93-134. 호출 화면은 `Dcr00_Tab_FileList`(문서별 첨부파일 검색, #1224) `fileDownload()` L246-269 하나뿐(`selectList=` 파일ID 쉼표목록).
- 처리: `selectList`가 비면 "파일 리스트가 없습니다." → ID마다 `sys10_file.selectById`(없으면 건너뜀) → 서버에 파일이 없으면 건너뜀 → `Asset-ERP.zip`, 압축 8, 항목 이름 `(n) 파일명`(n은 실제 담긴 순서).
- TOBE: `SysFileController.downloadZip` `GET /api/v1/sys/files/zip?fileIds=…` → `SysFileService.getZipEntries`. 프론트 `fileApi.downloadZip` ← `Dcr00_Tab_FileList.tsx` L63.

## 대조
| 항목 | AS-IS | TOBE | 결과 |
|:---|:---|:---|:---|
| ID 소스 | `Dcr00_DocListModel.docId` = SQL `sys10_file_id AS dcr00_id` | `r.fileId` | 같은 값 |
| 조회 | `sys10_file.selectById` | `sysFileMapper.selectById` | 같음(B10) |
| 없는 ID·서버에 없는 파일 | 건너뜀 | 건너뜀 | 같음 |
| 항목 이름·번호 | `(n) 파일명`, 담긴 순서 | 같음 | 같음 |
| 압축·파일명 | 레벨 8, `Asset-ERP.zip` | 같음 | 같음 |
| 빈 목록 | 본문 텍스트 | `BusinessException` "파일 리스트가 없습니다." | 표현만 다름(REST 규칙) |
| 다운로드 이력 | 없음 | `AuditLog FILE_DOWNLOAD` 기록 | TOBE 공통(B10), AS-IS 동작 불변 |

## 공통 절차와 다른 점
새 코드 없음. 화면 변환(B10·Dcr00)에서 이미 만들어졌고, 이 ID에서는 원본 분기와 대조만 했다.
