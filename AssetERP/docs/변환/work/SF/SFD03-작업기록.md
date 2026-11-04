# SFD03 FileDownload `file` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 대조 | 원본 `downloadFile L162-184`. TOBE: `SysFileController.download` `GET /api/v1/sys/files/{fileId}` → `SysFileService.getDownload` |
| 2026-11-04 | 결과 | **완료.** `fileId`로 `sys10_file.selectById` → `{serverPath}/{fileId}` 존재 확인 → `application/octet-stream`, 이름 URL 인코딩(+→%20) 첨부. 오류 문구 "등록된 파일정보를 찾을 수 없습니다."·"서버에 등록된 파일정보가 없습니다: 파일명" 같음. TOBE는 감사 로그(`FILE_DOWNLOAD`)를 더 남긴다(B10 공통, AS-IS 동작 불변) |
| 2026-11-04 | 참고 | 호출 화면은 첨부 목록 전반 — TOBE에서 `Com01_Lookup_RelateFile`·`Icr01_Page_IcrFile`·`Ics01_Page_IcsFile`·`Act80_LookupGrid_RelateFile`·`Apr42_Lookup_FileList`·`Bbs*`·`Biz05_*` 등 `fileApi.download`로 이미 연결(`yunhee grep 'fileType=file'`로 주석 49건 확인) |

## 비용
파일 계열 대조 묶음 세션(SFD01~08). 코드 변경 없음. `yunhee cat FileDownload.java`·`yunhee grep`·`analysis sql`로 대조.
