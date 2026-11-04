# SFU07 FileUpload/소형 업로드 `tdmCheckForm` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadTdmForm L592-641`. TOBE: `TdmFormFileController` `POST …` → `TdmFormFileService.upload`. **판정: 완료** |
| 2026-11-04 | 대조 | 첨부를 올리고 `tdm_check_form_type`·`note`·`person_id`=로그인 사원을 채운다. TOBE `updateUploaded`가 같은 세 열. 다른 점: 부모 ID를 TOBE는 회사 ID로 고정(AS-IS는 `parentId` 파라미터를 받음 — 호출 화면 `Tdm43_Tab_RelateFormFileUpload`가 보내는 값은 이번에 대조하지 않았다), 구분 필수 검사 추가. 미확인: 실제 업로드 |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
