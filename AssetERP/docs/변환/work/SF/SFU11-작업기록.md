# SFU11 FileUpload/소형 업로드 `FundUpload` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `FundUpload.uploadFile L56-255`. TOBE: (없음). **판정: 제외** |
| 2026-11-04 | 대조 | MS949 텍스트(`|` 구분, 작업일자·펀드코드·펀드명·유형…)로 `fnd01_fund_code`·`fnd02_fund_info`를 갱신. 호출 화면 둘: `Fnd01_Tab_FundCode`(L149) — **[파일업로드] 버튼이 원본 툴바에 붙어 있지 않아(L139 `//buttonBar.add(fileUploadButton)`) 도달 불가**(P05 기록도 같음), `Fnd01_Tab_FundInfoLoad`(L120) — **`13-누락대장.md` L59에서 제외(사용자 결정 2026-11-03)** |
| 2026-11-04 | 결과 | 두 호출처가 모두 없는 셈이라 제외로 한다. 되살리게 되면 코드 약 200줄(칸 순서 파서)을 옮겨야 한다. 사용자 확정은 SFD05·SED03과 같은 방식(화면 제외 결정의 결과) |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
