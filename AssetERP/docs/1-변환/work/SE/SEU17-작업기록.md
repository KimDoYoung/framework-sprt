# SEU17 ExcelUpload `adv02Upload` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `ExcelUpload` `adv02Upload`. TOBE: `AdvAccountController` `POST …/excel` → `AdvAccountUploadService`. **판정: 완료(코드 대조)** |
| 2026-11-04 | 대조 | TOBE 서비스의 주석이 현재 원본(IDMS-IC)의 줄 번호를 가리킨다. `yunhee cat`으로 AS-IS 분기의 셀 읽기(열 번호)와 오류 메시지 문구를 뽑아 TOBE 서비스와 맞춰 보았다. 열 0~5 일치, AS-IS 오류 메시지 6개가 TOBE에 같은 문구로 있다. AS-IS 성공 문구("…업로드하였습니다.")는 TOBE API에 없고 각 화면이 완료 메시지를 따로 띄운다(화면 ID에서 대조됨) |
| 2026-11-04 | 확인 | 실행 시험 있음: `AdvAccountDbTest` — 증권사명으로 코드를 찾아 등록, 모르는 증권사·중복 코드는 거절(통과) |
| 2026-11-04 | 미확인 | 화면에서 실제 파일을 올려 보는 것(브라우저 시험 안 함), AS-IS와 같은 파일을 넣어 결과 행을 비교하는 것(AS-IS 서버 없음) |

## 비용
엑셀·업로드 대조 묶음 세션. 코드 변경 없음.
