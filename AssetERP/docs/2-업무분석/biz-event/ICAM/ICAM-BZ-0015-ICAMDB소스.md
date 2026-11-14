# ICAM-BZ-0015 ADMIN이 ICAM DB 소스(함수·프로시저·트리거)를 가져와 본다

> **한 줄 요약** — ADMIN이 #1269 ICAM DB Source Get에서 **[ICAM DB소스 가져오기]**를 누르면 ICAM 운용·자문 서버의 함수·프로시저·트리거 소스 전문을 그날 날짜로 저장한다(`icam50_source`, 임시 `icam51_source_tmp`). 기준일·서버구분·소스구분·이름·소스 내용 검색으로 조회하고, 행을 고르면 소스 전문을 본다(`Icam50_Lookup_Source`). ICAM 쪽 로직이 바뀌었는지 비교하는 개발·운영용 화면이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | ADMIN(회사 0) — 개발·운영 담당 |
| 언제 | ICAM 버전이 바뀌었을 때 |
| 먼저 있어야 하는 것 | ICAM 접속 |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, API(admin/admin). 2023-05-26 소스 AS-IS total 3,935 = 3,935(첫 100행, 그리드 7열). [ICAM DB소스 가져오기] `POST /icam/sources/fetch` → 400 "ICAM 연동…DB소스를 가져오지 않았습니다"(⚠#179). **kalpa 사원 401이 소스 전문 3,935건을 받고 가져오기도 검사 없이 부를 수 있다**(⚠#246) |
| 메뉴 | #1269 I/F > 10. ICAM > ICAM DB Source Get (ADMIN만). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | ADMIN | #1269 | 기준일·서버구분·소스구분·이름·소스 검색어 → [조회] (`GET /icam/sources?stdDate=&serverType=&sourceType=&nameSearchText=&sourceSearchText=`) | 서버·소유자·구분·이름·줄 수·작업일시(페이징) |
| 2 | 〃 | 〃 | 행 더블클릭 → `Icam50_Lookup_Source` | 소스 전문 |
| 3 | 〃 | 〃 | [ICAM DB소스 가져오기] → "가져오시겠습니까?" [예] (`POST /icam/sources/fetch`) | 원본: 오늘 날짜로 저장. **TOBE: 400**(#179) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam50_source` | 날짜별 ICAM DB 소스 | 그대로(2023-05-26 3,935건) |

## 업무 규칙 · 주의

- 원본 `insertIcamDbSource`는 같은 날 자료가 있으면(`countByStdDate`) 지우고 다시 넣는다.
- API에 ADMIN·KFS 관리자 검사가 없다 → [의심 #246](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0015
company: 0 (ADMIN)
steps:
  - no: 1
    api: GET /api/v1/icam/sources?stdDate=2023-05-26&limit=100
    expect: total 3935
  - no: 2
    api: POST /api/v1/icam/sources/fetch
    expect: 400 (#179)
  - no: 3
    as: kalpa/401
    api: GET /api/v1/icam/sources?stdDate=2023-05-26
    expect: 403 이어야 함 (지금 200 — #246)
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam50_Tab_DbSource`(#1269 E3·E4, L92 `selectByServerTypePaging`, L245 `insertIcamDbSource`), 서버 `Icam50_Source`.
- TOBE: `IcamSourceController` L28-40, `IcamSourceService`, `DisabledIcamBatchRunner.runSource` L42-45.
- 확인: `compare GET /icam/sources --sql icam50_source.selectByServerTypePaging --total-sql …Total --grid Icam50_Tab_DbSource` 100=100·3,935=3,935.
</details>
