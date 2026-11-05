# SFD06 FileDownload `selectList` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 대조 | `yunhee cat FileDownload.java`·`Dcr00_Tab_FileList.java`, `analysis sql dcr00_doc_list.getFile`로 docId가 `sys10_file_id`임을 확인. TOBE `SysFileService.getZipEntries` 주석에 L257-280 대응이 이미 적혀 있었다. 새 코드 없음 |
| 2026-11-04 | 확인 | `yunhee api GET /api/v1/sys/files/zip -p fileIds=<있는 ID>,<없는 ID 999>` → HTTP 200, zip 첫 항목 `(1) 1.pptx`, 없는 ID는 건너뜀. 모두 없으면 빈 zip(200). 이 DB의 파일 대부분은 개발 PC 경로에 실제 파일이 없다(이 시험은 있는 파일 1개). 데이터 변경 없음 |
| 2026-11-04 | 미확인 | 화면(5173)에서 [다운로드] 버튼 클릭 → 브라우저 저장은 보지 않음(03·CLAUDE.md: ID 변환 중 브라우저 시험 안 함). `fileIds` 쿼리가 비어 있을 때 TOBE는 Spring 400이고 AS-IS는 텍스트 안내인데, 화면은 선택 0건이면 서버를 부르지 않아(`downloadChk`) 도달하지 않는다 |
| 2026-11-04 | 제안 | `서블릿-변환목록.md` SFD05(`zip`)의 TOBE 후보로 적힌 `SysFileController downloadZip`은 **`selectList`용**이다(`fileType=zip`의 호출 화면은 `Dcr00_Tab_Download` L431). SFD05 대조 때 후보를 다시 찾는다 |

## 비용
| 항목 | 값 |
|:---|:---|
| 세션 수 | 1 (SFD06·09·10 묶음, 시작 비용 공유) |
| 빌드·테스트 | 없음(코드 변경 없음) |
| yunhee 대신 다른 방법 | 없음 |
