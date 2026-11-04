# SFU01 FileUpload/소형 업로드 `default / 파일 올리기` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadFiles L93-142 + createFileModel·isAllowedFile·buildUploadPath`. TOBE: `SysFileController.upload` `POST /api/v1/sys/files`(폼 항목 `file`) → `SysFileService.upload`. **판정: 설계필요** |
| 2026-11-04 | 대조 | 폼 항목 `fileField`만 처리, 크기 0은 건너뜀, 파일 이름은 경로 제거·`\\/:*?"<>|`→`_`, 확장자는 마지막 `.` 뒤, 크기는 `(double)bytes/1024`, 저장 `{filePath}{회사위치}/{yyyyMM}/{fileId}`, `sys10_file.insert`(`print_yn` 'true'·`ext_yn` 'false'), 성공 "업로드 성공"/정책 위반 "보안정책위반"/그 밖 "업로드 실패". TOBE는 같은 폴더 규칙·열을 쓴다 |
| 2026-11-04 | 결과 | **차이 ① 허용 형식 — 사용자 결정 필요.** AS-IS `FilePolicyService.isAllowed(ext, mime)`는 DB `sys60_file_policy`의 **확장자 31개**(7z·bmp·csv·doc·docx·gif·gz·html·hwp·hwpx·jpeg·jpg·json·odp·ods·odt·pdf·png·ppt·pptx·rar·rtf·svg·tar·txt·webp·xls·xlsm·xlsx·xml·zip)만 보고(MIME 검사는 주석 처리) 시작 때 읽는다. TOBE `SysFileService.checkAllowedType`은 `application.properties`의 `asseterp.upload.allowed-types.*` **16개 확장자**와 Tika가 판별한 내용 형식이 맞아야 한다("TOBE 추가(사용자 결정)"로 적혀 있음). 그래서 AS-IS는 받지만 TOBE는 거부하는 확장자 15개(7z·bmp·gz·html·json·odp·ods·odt·rar·rtf·svg·tar·webp·xlsm·xml)가 있고, 관리자가 `Sys60_Tab_FilePolicy`(TOBE에도 있음)에서 정책을 고쳐도 업로드에는 반영되지 않는다. 어느 쪽을 따를지(DB 정책 + Tika 내용 검사 병행 등) 정해 주세요 |
| 2026-11-04 | 참고 | **차이 ② 사원 사진 축소.** TOBE는 `mode=emp01`이고 사원이 있으며 jpg·jpeg·png이면 800×600으로 줄여 저장한다(옛 원본 `uploadEmpFile`). 현재 원본(IDMS-IC `FileUpload`)에는 `emp01` 모드도 축소도 없고, 사원 사진 업로드(`Emp01_TabPage_Person` L143, `Emp02_TabPage_Others` L107)는 `FileUpload?fileType=image&parentId=`(기본 모드, 줄이지 않음)로 간다. TOBE 주석의 줄 번호(`uploadFile L131-178`·`uploadEmpFile L748-812`)가 현재 파일(744줄)에 없는 것으로 보아 옛 원본(`~/oms-data/src/Asset-ERP`) 기준으로 만든 것 같다(추정 — B10 작업기록은 확인하지 않았다). 결정 대기 |
| 2026-11-04 | 참고 | 차이 ③(사소): 크기 KB를 TOBE는 정수 나눗셈(옛 원본 `makeFileModel`), 현재 원본은 소수 / 한 요청에 파일 여러 개를 현재 원본은 `fileField` 항목마다 처리하나 TOBE는 한 요청 한 파일 / `sys10_note` 기본값 AS-IS null, TOBE '' |
| 2026-11-04 | 참고 | 화면별 호출은 각 화면 ID(`Com01_Lookup_RelateFile` 등 첨부 창)에서 `fileApi.upload`로 연결돼 있다 |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
