# SFU05 FileUpload/소형 업로드 `scm30` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadScm30 L467-540`. TOBE: `ScmProgramController` `POST …/multi-upload` → `ScmProgramService.multiUpload`. **판정: 완료** |
| 2026-11-04 | 대조 | SFU04에서 scm13 행만 뺀 것(프로그램 + 첨부). 같은 SQL·같은 버전 규칙. 대조 결과 같다. 미확인: 실제 업로드(EE19 결과확인 `multi-upload 미확인`) |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
