# SFU04 FileUpload/소형 업로드 `scm13` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadScm13 L382-465`. TOBE: `ScmDevController` `POST …/multi-upload` → `ScmDevProgramService.multiUpload`. **판정: 완료** |
| 2026-11-04 | 대조 | 파일마다 프로그램(scm30: 코드=확장자 뺀 파일명, 같은 시스템·구분·코드의 최신 버전+1·없으면 1·`use_yn` true)·개발 프로그램(scm13: 개발 ID·배포대상)·첨부(부모=프로그램 ID)를 만든다. `scm30_program.selectByProgramCode`(`rn=1` 최신 버전, `LIKE`)·`scm30_program.insert`·`scm13_dev_program.insert`를 `analysis sql`로 읽고 TOBE `upsertProgram`('true')·`upsertDevProgram`과 대조해 열이 같다 |
| 2026-11-04 | 결과 | 다른 점: 한 트랜잭션(원본은 DB만 되돌리고 저장한 파일은 남김, 코드 주석에 있음). 미확인: 실제 업로드(EE17 결과확인도 `일괄등록 미확인`) — 새 행·파일을 만들어 같은 값 시험이 없다 |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
