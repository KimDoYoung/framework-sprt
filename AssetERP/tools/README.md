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
| `code-health.sh` + `code-health/` | TOBE 정적분석 일괄(PMD·CPD 중복·Checkstyle·SpotBugs+FindSecBugs) → `docs/5-테스트/정적분석/` 보고서. build.gradle 무수정(init script) |

## 환경 점검 (읽기 전용)

| 파일 | 용도 |
|:---|:---|
| `check-environment.sh` | 이 PC가 AssetERP 개발·배포에 필요한 환경을 갖췄는지 점검. 사무실(t3600)·집(omen)을 옮겨 앉았을 때, 시뮬레이터·배포가 이상할 때 먼저 돌린다 |

- 사용: `./tools/check-environment.sh` (hostname 소문자로 기기 판정), `--host <omen|t3600>`(판정 덮어쓰기), `--help`.
- 기기 판정: 스크립트 위 `HOSTS` 표(hostname → Spring 프로필). 컨테이너 이름은 `<호스트>_postgres`·`<호스트>-tomcat`, Tomcat 프로필은 `/data/docker/<호스트>-tomcat/bin/setenv.sh`. 새 기기는 표에 한 줄 추가하고 `application-<프로필>.properties`·`setenv.sh`를 만든다.
- 점검 항목

  | 절 | 내용 |
  |:---|:---|
  | 1 기기·프로필 | `setenv.sh`의 `spring.profiles.active`가 프로필과 같은가, `application-<프로필>.properties`의 시뮬레이터 주소(rd·notice·bot·assetmail)가 이 PC IP인가, TODO가 남았는가 |
  | 2 Docker·DB·Tomcat | docker 데몬, postgres·tomcat 컨테이너 running, `pg_isready`, `yunhee sql`(YUNHEE_DB), `http://localhost:8082/AssetERP/`, 공유 볼륨 `/home/kdy987/tmp/asseterp-data` 쓰기 |
  | 3 시뮬레이터 포트 | 5151(RD)·5161(talk·sms)·2525(SMTP)·5171(AI·메일)이 `0.0.0.0`에 떠 있는가, **Tomcat 컨테이너 안에서 호스트 IP:포트로 실제 연결**되는가(실패 = ufw 의심) |
  | 4 도구 | java 21, node·npm·gradle·psql·yunhee·git, `frontend/node_modules` |
  | 5 AS-IS 소스·색인 | `yunhee config`의 AS-IS 소스 폴더, git 원격 접속(`check-git.sh`), `docs/as-is/` 색인 유무·나이(14일 넘으면 ⚠) |
  | 6 개발 포트 | 5173·8080·5432·8082 사용 중인지(참고만) |
  | 7 외부 연결 | ntfy.sh 접속(알림은 보내지 않음) |

- 결과: 항목마다 `✅/⚠/❌` 한 줄, 끝에 "고칠 명령"(중복 제거). ❌가 있으면 종료코드 1.
- **아무것도 고치지 않는다.** sudo도 쓰지 않는다 — ufw 규칙이 빠졌으면 `sudo ufw allow from 172.16.0.0/12 to any port <포트> proto tcp`를 출력만 하고, 사용자가 터미널에서 직접 실행한다. ufw 규칙 목록은 `sudo ufw status | grep 172`로 본다.
- 시뮬레이터가 꺼져 있으면 ⚠(필요할 때만 켠다), `127.0.0.1`에만 떠 있으면 ❌(컨테이너에서 못 닿음 → `*_SIM_HOST=0.0.0.0`으로 다시 켠다).

## 화면 캡쳐 보기

| 파일 | 용도 |
|:---|:---|
| `make-screen-index-html.sh` | `yunhee screen-capture` 결과(`.yunhee/screen-capture/<화면번호_클래스명>/*.png`)를 한곳에서 보는 `index.html` 생성. 왼쪽 화면번호 목록(메뉴 경로·검색·↑↓), 오른쪽 이미지+파일명. 캡쳐를 새로 찍은 뒤 다시 실행한다. 인자로 다른 캡쳐 폴더를 줄 수 있다 |

## 외부 시스템 시뮬레이터

| 파일 | 용도 |
|:---|:---|
| `run-rd-server.sh` + `rd-simulator/` | Crownix RD Reporting Server 흉내(호출 계약·호출 기록). `start/stop/status/logs/calls`, 포트 5151 |
| `run-notice-server.sh` + `notice-simulator/` | 알림 3종(talk·sms·mail) 흉내. `start/stop/status/logs/calls/reset`, 포트 5161·SMTP 2525 |
| `run-ext-server.sh` + `ext-simulator/` | AI 점검의견(BotService)·새 메일 시스템(assetMail 쓰기창) 흉내. `start/stop/status/logs/calls/reset`, 포트 5171 |

각 시뮬레이터의 자세한 설정은 폴더의 `README.md`.

## DB 쓰기 (로컬 asseterpdb — 먼저 `db_dump_backup.sh`)

| 파일 | 용도 |
|:---|:---|
| `db_dump_backup.sh` | asseterpdb 통째 백업(pg_dump). 컨테이너는 호스트명 기반 `<호스트명>_postgres`(t3600/omen), `DB_CONTAINER`로 덮어쓴다 |
| `create-virtual-company.sh` | 업무분석 가상회사(kova·igo)를 TOBE API로 한 번에 만든다: 고객사·관리자·사원구분 코드·메뉴(출발지 prod_s1)·조직 2·직원 7명(사번=직함)·권한·직원 비밀번호. 먼저 `db_dump_backup.sh` |
| `delete-company-db-data.sh` | 가상 회사(kalpa·kova·igo만) 데이터를 회사 행까지 모두 삭제. 옵션 없으면 dry-run 표, `--all` 실제 삭제. 업무분석 시나리오(`docs/2-업무분석/biz-event/`)를 처음부터 다시 돌릴 때 |

## yunhee 벤치마크

| 파일 | 용도 |
|:---|:---|
| `yunhee-benchmark.sh` + `yunhee-benchmark/` | 토큰 절감·정확성 벤치마크. 시나리오 `cases/`(17개), `lib.sh`, `report.py`, 결과 누적 (`--list`·`--history`·`--fast`) |

## 정리 (삭제)

| 파일 | 용도 |
|:---|:---|
| `clean-up.sh` | 쌓인 산출물 삭제. `--backup-db`(`data/backup/db`의 `*.dump` 전부), `--screen-capture`(`.yunhee/screen-capture` 하위 전부, 폴더는 남김), `--all`(둘 다). 대상 목록·크기를 보이고 `[y/N]`로 물은 뒤 지운다(`-y`면 묻지 않음). 옵션 없거나 모르는 옵션이면 도움말 + 종료코드 1 |

## 주의

- 브라우저 화면 시험 도구(`screens/`, `smoke-frame.js`, `menus.sh`)는 2026-11-04에 삭제했다(git 이력에 있음). 시험 방법은 `테스트` 작업에서 정립한 뒤 새로 만든다. 그 전까지 ID 변환 중에는 브라우저 스크립트를 쓰지 않는다(`../docs/1-변환/06-결과확인.md` "화면시험 지연").
- 시뮬레이터는 자기 폴더에 `.pid`·`.log`를 만든다(git-ignored).
