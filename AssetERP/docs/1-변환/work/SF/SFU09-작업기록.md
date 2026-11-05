# SFU09 FileUpload/소형 업로드 `sys95` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadSys95 L696-744`. TOBE: `SysManualController` `POST …` → `SysManualService.upload`. **판정: 완료** |
| 2026-11-04 | 대조 | 파일마다 `sys95_manual.insert`(ID·회사·등록일·분류·공개 'false')를 만들고 그 ID를 부모로 첨부를 올린다. TOBE `insertManual`+`upload`로 같다. 다른 점: 분류 필수·sys admin 검사(TOBE 보강), 한 요청 한 파일. 원본은 `fileField` 이름 검사와 크기 0 건너뜀이 이 모드에는 없다(원본-이상한점 후보). 미확인: 실제 업로드 |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
