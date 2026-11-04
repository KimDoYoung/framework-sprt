# SFU01 FileUpload/소형 업로드 `default / 파일 올리기` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadFiles L93-142 + createFileModel·isAllowedFile·buildUploadPath`. TOBE: `SysFileController.upload` `POST /api/v1/sys/files`(폼 항목 `file`) → `SysFileService.upload`. **판정: 완료(결정 반영 2026-11-04)** |
| 2026-11-04 | 대조 | 폼 항목 `fileField`만 처리, 크기 0은 건너뜀, 파일 이름은 경로 제거·`\\/:*?"<>|`→`_`, 확장자는 마지막 `.` 뒤, 크기는 `(double)bytes/1024`, 저장 `{filePath}{회사위치}/{yyyyMM}/{fileId}`, `sys10_file.insert`(`print_yn` 'true'·`ext_yn` 'false'), 성공 "업로드 성공"/정책 위반 "보안정책위반"/그 밖 "업로드 실패". TOBE는 같은 폴더 규칙·열을 쓴다 |
| 2026-11-04 | 결과 | **차이 ① 허용 형식 — 사용자 결정 필요.** AS-IS `FilePolicyService.isAllowed(ext, mime)`는 DB `sys60_file_policy`의 **확장자 31개**(7z·bmp·csv·doc·docx·gif·gz·html·hwp·hwpx·jpeg·jpg·json·odp·ods·odt·pdf·png·ppt·pptx·rar·rtf·svg·tar·txt·webp·xls·xlsm·xlsx·xml·zip)만 보고(MIME 검사는 주석 처리) 시작 때 읽는다. TOBE `SysFileService.checkAllowedType`은 `application.properties`의 `asseterp.upload.allowed-types.*` **16개 확장자**와 Tika가 판별한 내용 형식이 맞아야 한다("TOBE 추가(사용자 결정)"로 적혀 있음). 그래서 AS-IS는 받지만 TOBE는 거부하는 확장자 15개(7z·bmp·gz·html·json·odp·ods·odt·rar·rtf·svg·tar·webp·xlsm·xml)가 있고, 관리자가 `Sys60_Tab_FilePolicy`(TOBE에도 있음)에서 정책을 고쳐도 업로드에는 반영되지 않는다. 어느 쪽을 따를지(DB 정책 + Tika 내용 검사 병행 등) 정해 주세요 |
| 2026-11-04 | 참고 | **차이 ② 사원 사진 축소.** TOBE는 `mode=emp01`이고 사원이 있으며 jpg·jpeg·png이면 800×600으로 줄여 저장한다(옛 원본 `uploadEmpFile`). 현재 원본(IDMS-IC `FileUpload`)에는 `emp01` 모드도 축소도 없고, 사원 사진 업로드(`Emp01_TabPage_Person` L143, `Emp02_TabPage_Others` L107)는 `FileUpload?fileType=image&parentId=`(기본 모드, 줄이지 않음)로 간다. TOBE 주석의 줄 번호(`uploadFile L131-178`·`uploadEmpFile L748-812`)가 현재 파일(744줄)에 없는 것으로 보아 옛 원본(`~/oms-data/src/Asset-ERP`) 기준으로 만든 것 같다(추정 — B10 작업기록은 확인하지 않았다). 결정 대기 |
| 2026-11-04 | 참고 | 차이 ③(사소): 크기 KB를 TOBE는 정수 나눗셈(옛 원본 `makeFileModel`), 현재 원본은 소수 / 한 요청에 파일 여러 개를 현재 원본은 `fileField` 항목마다 처리하나 TOBE는 한 요청 한 파일 / `sys10_note` 기본값 AS-IS null, TOBE '' |
| 2026-11-04 | 참고 | 화면별 호출은 각 화면 ID(`Com01_Lookup_RelateFile` 등 첨부 창)에서 `fileApi.upload`로 연결돼 있다 |
| 2026-11-04 | 결정·고침 | 사용자 결정(2026-11-04): ① **DB 정책을 따른다** ② **사진 축소는 원본처럼 뺀다**. 반영: `SysFileService.checkAllowedType`이 `sys60_file_policy`의 확장자(소문자, 이 DB 31개)에 있어야만 받는다 — 올릴 때마다 읽어서 [파일보안정책] 화면 저장이 바로 반영된다(AS-IS는 시작 때 한 번 읽음). `mode=emp01` 축소(`resizeImage`)·`MODE_EMP01`·`countPersonById`를 지웠고 `mode` 인자는 받되 쓰지 않는다. 확장자 계산도 현재 원본(`getExtension`: 점이 없으면 "")과 같게 했다. `asseterp.upload.allowed-types.*`·`UploadProperties.allowedTypes`·Tika 내용 판별·`tika-core` 의존성은 제거 |
| 2026-11-04 | 확인 | `SysFileUploadPolicyDbTest` 3개 통과(asseterpdb·임시 저장 폴더, DB 롤백): `.xlsm`·`.SVG`(예전 properties에 없던 확장자)는 받고 `.exe`·확장자 없음은 거부, 내용이 이미지가 아니어도 `fake.png`는 받는다(원본은 확장자만 봄), `mode=emp01` jpg가 5000바이트 그대로 저장 |
| 2026-11-04 | **주의** | **`docs/security-설계.md` 1절 8번(Apache Tika 매직 넘버로 확장자 위변조를 저장 전에 거부)과 10번(허용 파일 형식을 properties로 관리)에 어긋난다.** 이제 `.exe`를 `.png`로 이름만 바꿔도 받는다(AS-IS도 같음). 보안 설계를 유지하려면 DB 확장자 위에 Tika 검사를 얹어야 하는데, DB에는 확장자별 기대 MIME 열(`sys60_mime_type`)이 있으나 OOXML·OLE2 등은 Tika가 다른 이름으로 판별해 그대로 비교하면 안 맞는다 — 어떻게 할지 사용자 결정 대기 |
| 2026-11-04 | 확인(실서버) | 배포 뒤 `data/samples`의 파일로 `POST /api/v1/sys/files`: `1.sh` → HTTP 400(정책에 없는 확장자), `1.docx` → 등록됨. 등록된 행은 같은 세션에 `DELETE`로 지웠다(`sys10_file` 부모 990099 행 0, 저장 파일도 없음) |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
