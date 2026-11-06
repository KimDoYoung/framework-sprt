# 정적분석 (code-health)

## 개요

- TOBE 소스를 정적분석한 보고서를 두는 곳. 변환 중에는 돌리지 않고, 여러 화면을 변환한 뒤 몰아서 돌린다.
- 실행: AssetERP 폴더에서 `yunhee run -t 1800 "./tools/code-health.sh"` (옵션은 `--help`). 전체 약 3분.
- 도구: PMD 7(규칙) · CPD(중복) · Checkstyle(TOBE 규칙) · SpotBugs + FindSecBugs(버그·보안) · 자체 점검(매퍼 `${}`, 레이어 패키지).
  `backend/build.gradle`은 건드리지 않는다. 분석 플러그인은 init script(`tools/code-health/analysis.gradle`)로만 붙는다.
- 규칙 조정: `tools/code-health/` 의 `pmd-ruleset.xml`·`checkstyle.xml`·`spotbugs-exclude.xml`, 등급은 `report.py`의 `RULE_GRADE`.

## 파일 및 폴더

| 파일 | 뜻 | git |
|:---|:---|:---|
| `{날짜}-요약.md` | 실행 1회의 총괄: 등급별·도구별·도메인별 건수, 지난번 대비 증감, 우선 높은 B, 공통화 상위 | 커밋 |
| `목록/A-기계적.md` | 동작이 안 바뀌는 수정(안 쓰는 import·변수, star import 등). 파일별로 묶음 | 커밋(매번 덮어씀) |
| `목록/B-판단.md` | 원인을 보고 고칠 것(NPE·예외 원인 유실·보안·매퍼 `${}`) | 커밋(매번 덮어씀) |
| `목록/C-공통화.md` | CPD 중복 → 공통 부품 후보. 점수순, 위치·코드 조각 포함 | 커밋(매번 덮어씀) |
| `목록/참고.md` | 복잡도·길이. 고칠 의무 없음 | 커밋(매번 덮어씀) |
| `수정대장.md` | 손댄 항목의 상태(대기·수정·보류·오탐·해결) | 커밋 |
| `raw/` | 도구 원본 XML·HTML, `gradle.log` | 무시 |

## 등급

| 등급 | 뜻 | 고친 뒤 확인 |
|:---|:---|:---|
| A 기계적 | 동작이 그대로인 수정 | `yunhee run "./bm.sh compile"` |
| B 판단 | 동작이 바뀔 수 있음. AS-IS 동작이 정답 | compile + 그 API를 `yunhee api`로 |
| C 공통화 | 여러 곳에 복사된 코드 → util·공통 서비스 | 후보 하나씩, 사용자 승인 뒤. compile + 영향 API |
| 참고 | 크기·복잡도 | 없음 |

## ID와 수정대장

- 항목 ID는 `CH-{도구}-{해시8}`이다. 줄 번호가 아니라 (규칙, 파일, 그 줄 내용)으로 만들어, 코드가 위아래로 밀려도 바뀌지 않는다. SpotBugs는 (버그 종류, 파일)로 묶여 한 ID다.
- agent에게 부탁하는 법:
  - "정적분석 A 전부 고쳐줘" → `목록/A-기계적.md`를 파일별로 고치고 compile
  - "CH-spotbugs-xxxxxxxx 봐줘" → B 하나를 원인부터 확인
  - "CH-cpd-xxxxxxxx 공통화해줘" → C 후보 하나를 공통 부품으로
- 고친 뒤 `수정대장.md`에 행을 더한다. 전부 옮기지 않고 **손댄 것만** 적는다.
  - `오탐(사유)`로 적으면 다음 보고서부터 빠진다.
  - 다음 실행에서 ID가 사라지면 `report.py`가 상태를 `해결 (날짜)`로 바꾼다(그 도구를 돌렸을 때만).
- 기능은 AS-IS 그대로가 원칙이다(`../../1-변환/변환-가이드.md`). 동작이 바뀌는 수정은 사용자에게 먼저 확인한다. 아직 자동 테스트가 적으니 C는 작게 나눈다.

## 읽을 때 주의

- `PreserveStackTrace`: `catch` 안에서 `BusinessException`을 던지며 원인 예외를 버린 것. 로그에서 원인을 잃는다.
- `POTENTIAL_XML_INJECTION`: 대부분 전자결재 링크 HTML(`biz/apr/service/link/`)의 문자열 이어 붙이기다. DB 값을 escape하는지 본다.
- 매퍼 `DollarSubstitution`: `${}` 문자열 치환. ORDER BY 열 이름처럼 정상인 것도 있으니, 사용자 입력이 들어가는지 본다.
- 공통화 "관련 있을 수 있는 기존 common 부품"은 이름이 비슷한 클래스를 뽑았을 뿐이다. 실제로 쓸 수 있는지는 열어 보고 판단한다.
