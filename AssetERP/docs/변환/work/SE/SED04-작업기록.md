# SED04 ExcelDownload `act02List` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | TOBE: `ActJournalDtlController` `GET /api/v1/act/journal-dtls/by-account/excel` → `ActJournalSubExcelWriter`. **판정: 완료** |
| 2026-11-04 | 대조 | X17 작업방법·작업기록에 구조 대조가 있다(제목 3줄·헤더 9열·계정마다 시트·월이 바뀔 때 [월 계]·[누 계] 줄, .xls→.xlsx). `ActJournalDtlDbTest`가 한 계정 엑셀의 시트 이름·제목·헤더·월 계 줄 수를 POI로 열어 확인한다(통과). 시트 이름 31자 제한은 TOBE가 잘라서 맞춘다(AS-IS는 `num_이름 (코드)`를 그대로 씀) |
| 2026-11-04 | 확인 | **전체 계정 경로(`accountCode` 없음/`none`)의 실제 동작**: `yunhee api`로 불러 보니(회사 28000, 2025-01-01~03-31 · 2026-01-01~06-30) 500(NPE)이 났다. `act02_journal.getAccountCode`와 `selectAccountCodes`는 SQL이 같고(`WHERE account_cd IS NOT NULL`은 AS-IS도 주석 처리), 이 DB에는 FSS 계정코드가 없는 계정(10100·10202·10209…)이 있어 `f_get_fss_account_cd`가 null이다. 그 행이 목록에 섞이면 TOBE는 MyBatis가 null 요소를 만들어 NPE, AS-IS는 `journalModel.getTrName().trim()`(L768)에서 NPE이므로 **같은 데이터에서 AS-IS도 실패**한다고 본다(AS-IS를 실행해 보지는 못했다 — 코드 읽기 결론). 원본-이상한점 후보. 코드는 고치지 않았다(null 코드 행을 건너뛰는 것이 자연스러우나 원칙 5에 따라 승인 필요) |
| 2026-11-04 | 참고 | 미확인: 엑셀 셀 값을 AS-IS 파일과 한 칸씩 비교하지는 않았다(AS-IS 서버 없음) |

## 비용
엑셀·업로드 대조 묶음 세션(SED04~08·SEU). 코드 변경 없음.
