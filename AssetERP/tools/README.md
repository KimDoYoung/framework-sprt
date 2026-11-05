# tools

## 개요

- 변환 중 쓰는 점검 스크립트와 외부 시스템 시뮬레이터 모음이다. 빌드·배포·분석은 `yunhee`가 하고, **yunhee로 안 되는 것만 여기서** 한다.
- 파일 경로를 docs·CLAUDE.md·작업기록이 인용하므로 옮기지 않는다. 새 도구를 만들면 아래 표에 한 줄 추가한다.
- 사용법은 각 파일 머리 주석에 있다(`head -15 <파일>`).

## 대조·점검 (읽기 전용)

| 파일 | 용도 |
|:---|:---|
| `ui-count.sh` | AS-IS 색인 화면 파일에서 클래스별 버튼·이벤트·그리드 수 (06 항목 10, 03 원칙 12) |
| `page-style-check.py` | `docs/page-style.md` 규칙을 정규식으로 화면×규칙 표로 점검 (견본은 전부 통과해야 함) |

## 외부 시스템 시뮬레이터

| 파일 | 용도 |
|:---|:---|
| `run-rd-server.sh` + `rd-simulator/` | Crownix RD Reporting Server 흉내(호출 계약·호출 기록). `start/stop/status/logs/calls`, 포트 5151 |
| `run-notice-server.sh` + `notice-simulator/` | 알림 3종(talk·sms·mail) 흉내. `start/stop/status/logs/calls/reset`, 포트 5161·SMTP 2525 |

각 시뮬레이터의 자세한 설정은 폴더의 `README.md`.

## yunhee 벤치마크

| 파일 | 용도 |
|:---|:---|
| `yunhee-benchmark.sh` + `yunhee-benchmark/` | 토큰 절감·정확성 벤치마크. 시나리오 `cases/`(17개), `lib.sh`, `report.py`, 결과 누적 (`--list`·`--history`·`--fast`) |

## 주의

- 브라우저 화면 시험 도구(`screens/`, `smoke-frame.js`, `menus.sh`)는 2026-11-04에 삭제했다(git 이력에 있음). 시험 방법은 `테스트` 작업에서 정립한 뒤 새로 만든다. 그 전까지 ID 변환 중에는 브라우저 스크립트를 쓰지 않는다(`../docs/1-변환/06-결과확인.md` "화면시험 지연").
- 시뮬레이터는 자기 폴더에 `.pid`·`.log`를 만든다(git-ignored).
