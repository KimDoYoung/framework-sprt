# AssetERP/CLAUDE.md

실제 AssetERP 원본을 Spring Boot + React로 변환하는 작업 폴더. **이 문서는 "변환" 작업의 규칙이다**(파악·변경반영·비교 등 다른 작업은 루트 `CLAUDE.md`의 작업 표와 `docs/` 작업별 폴더를 따른다).
상위 `../CLAUDE.md`(저장소 공통 규칙, yunhee 사용 규칙)도 함께 적용된다.

## 읽는 순서

**세션 시작에 통째로 읽는 것은 `docs/1-변환/변환-가이드.md` 하나다**(원칙·절차·확인·대응·yunhee 사용. 어떤 지시보다 우선한다). 나머지는 필요할 때 그 부분만 연다. ID별 작업방법·작업기록·결과확인 파일은 만들지 않는다(2026-11-05).

| 언제 | 읽을 것 | 읽지 않는 것 |
|:---|:---|:---|
| 세션 시작 | `변환-가이드.md` 전체 + 아래 "에이전트 실수 목록" | `_보관/`, `work/` |
| 세션 시작 | 작업 목록의 첫 `대기` 행: `01a-변환목록.md`(`grep -n '대기' docs/1-변환/변환목록/01a-변환목록.md \| head`) → 끝나면 `01b` → `01c` → `01d` → `01g` → `01h` → `01e`. 미변환 목록 1·2는 삭제했다(2026-11-05). 남은 미변환·미연결 창의 할 일은 `13-누락대장.md`(2026-11-05 새로 씀). 옛 제외·보류 근거는 git `639c0c7c`의 같은 파일 | 끝난 ID 행 |
| 프론트 | `11-프론트부품.md` 전체(공통 부품 사용법 — 부품 소스는 열지 않는다), `10-UX보강.md` 등록표에서 `부품완료` 항목. 조회창을 새로 만들 때만 `11a-프론트부품-조회창.md`(규칙 몇 줄 — 기존 조회창 부품은 `yunhee outline frontend/src/components/lookup`로 찾는다). 그리드를 만들면 `grid-style.md`, 조회창·편집창은 `modal-style.md` | 견본 통독 |
| `_Tab_` 화면 | `yunhee page-style <원본.java>`로 SID 확인 + `docs/page-style/{SID}/README.md`(그 SID 규칙) + 같은 폴더의 견본을 뼈대로. `docs/page-style.md`는 SID 표(색인)만이라 SID를 모를 때만 본다 | 다른 SID 폴더 |
| 필요할 때만 | `09-업무흐름.md`(권한·메뉴·회사의 업무 조건), `07-기반이식.md`(B04~B08), `05b-yunhee-버전이력.md`(yunhee가 막힐 때), `04-작업순서.md` | |

- 참고할 TOBE 파일은 `yunhee analysis tobe`·`outline`으로 본 뒤 필요한 줄만 읽는다.

## 원본 화면이 정답 (가이드 원칙)

AssetERP는 오래 다듬어진 상용 서비스다. 테이블 CRUD는 이미 원본에서 동작하고, 화면은 그리드 중심(보기 그리드 + 편집 CRUD 그리드)이다.
TOBE는 새로 설계하지 않고 원본의 레이아웃·버튼·이벤트·그리드·메시지·SQL을 그대로 따라간다. 끝낼 때 클래스마다(탭·팝업 포함) 버튼·이벤트·그리드 수를 `yunhee analysis ui <화면> --tobe …`로 세어 대조한다(`tools/ui-count.sh`는 교차 확인용).
예외는 **UX보강**(가이드) 하나다 — 기능은 같고 공통 부품 안에서만 사용성을 높이는 것으로, `docs/1-변환/10-UX보강.md` 등록표에서 `부품완료`인 항목만 적용한다. 항목은 사용자가 계속 추가한다.

## yunhee 적극 사용 (토큰 절약)

사용자 지시(2026-10-07): yunhee 사용법을 충분히 익히고 작업에 적극 활용해 토큰을 아낀다. 전체 사용법은 루트 `CLAUDE.md`가 가리키는 yunhee `docs/help/`와 `yunhee <command> --help`, 이 프로젝트에서의 적용 표는 `docs/1-변환/변환-가이드.md` 5절.

- 세션 시작에 `yunhee --version` → 가이드 5절 기준 버전보다 높으면 `yunhee changelog --since <기준>`으로 바뀐 것만 본다.
- AS-IS 분석은 **`yunhee analysis`**(screen·method·grid·model·sql·ui, `yunhee analysis --list`)로 필요한 것만 뽑는다. 원본 Java·매퍼 XML·긴 색인을 통째로 읽거나 `sed`·`grep`으로 자르지 않는다. 원문은 `analysis method … -o code`로 그 메서드만.
- 테이블은 `yunhee table`, DB 데이터는 `yunhee sql`(읽기 전용, 쓰기 시험은 `--rollback`), TOBE 코드는 `yunhee outline`·`yunhee analysis tobe` → 필요한 줄만, 빌드·테스트·배포는 `yunhee run`.
- 백엔드: SQL은 `yunhee port-sql`·`port-save`로 옮기고, 매퍼는 컴파일 전에 `yunhee sql-check --tobe backend/src/main/resources/mapper`.
- 확인: API는 `yunhee api`(SQL·예외까지 보려면 `--log`), 조회 API와 AS-IS SQL 비교는 `yunhee compare`. 평가자·승인자처럼 로그인할 수 없는 사원의 조회·쓰기 문장은 `yunhee mapper-run "<매퍼.xml>#<id>" --compare <ns.id> -p … --count`(쓰기는 `--rollback`)로 TOBE 매퍼째 DB에서 확인한다. 끝낼 때 `yunhee trace-pair '#<메뉴번호>'`·`trace-crud --screen <클래스>`로 서비스·SQL·테이블 짝과 빠진 것을 본다(0.6.0~, 가이드 5절 "`trace-*`"). 서버 로그는 `docker logs` 대신 `yunhee log`(errors·tail·req·trace, 가이드 5절 "서버 로그") — 배포 후 `log errors --since-deploy`, 사용자 신고 오류는 재현 전에 `log req … --trace`. 기본 주소는 `.env.yunhee`(0.5.0~, 옛 `.env.local`도 읽음; AssetERP Tomcat), 고객사 관리자는 `-c <회사코드>`.
- **원본 변경 점검**(0.3.8~): AS-IS 원본은 매일 바뀐다. `tools/check-git-and-db.sh`(pull → 색인 기준과 다르면 `index-src` 재실행; `--src-index`·`--menu-tsv`·`--db-index`(DB 색인+menus.tsv+소스 색인)·`--all`·`--no-index`·`--help`. DB를 복원했거나 DB가 바뀌었으면 `--db-index`)로 갱신하되, 완료 화면 점검은 **변환을 모두 끝낸 뒤 일괄로** 한다(사용자 결정 2026-10-21). 갱신 뒤 `yunhee drift --all --done-only --base baseline`으로 완료 화면 중 변환 뒤 바뀐 것만 본다(`-o diff`로 상세). ID를 `완료`로 바꿀 때 `yunhee drift --record <클래스> --id <ID> --note-file docs/1-변환/work/<ID 첫 글자>/<ID>-작업기록.md`로 기준을 남긴다. 기준 파일 `docs/baseline.json`은 git으로 공유한다(가이드 5절 "원본 변경 점검").
- **브라우저 화면 시험은 ID 변환 중 쓰지 않는다**(사용자 결정 2026-10-19). 변환 때는 화면 눈 확인을 `대기(일괄)`로 미루고 채팅 보고에 그렇게 적는다. 화면시험 스크립트(`tools/screens` 등)는 2026-11-04에 삭제했고, 시험 방법은 `테스트` 작업에서 새로 정립한다(06 "화면시험 지연").
- **RD(출력/다운로드) 확인이 필요하면 `tools/run-rd-server.sh`(RD 시뮬레이터)를 `status` → `start`로 켜서 쓴다**(사용자 결정 2026-10-23). 받은 mrd·rv는 `tools/run-rd-server.sh calls [mrd]`로 대조한다. 자세히는 `docs/1-변환/변환-가이드.md` 5절 "yunhee로 못 하는 것".
- yunhee로 안 되는 것(브라우저 확인)만 `tools/`로 하고, 출력은 몇 줄로 줄인다. 다른 방법을 쓴 사유는 코드 주석이나 채팅 보고에 한 줄 남긴다.

## 고정 사항

- AS-IS 원본: `~/work/IDMS-IC` (`application/src/main/java/myApp`, `yunhee config`의 Source(ASIS) = `YUNHEE_ASIS_SRC_DIR`). 2026-10-13에 `~/oms-data/src/Asset-ERP`(옛 버전)에서 바꿨다 — 그 전에 끝낸 ID의 원본 줄 번호는 옛 소스 기준이다.
- DB: docker localhost의 `asseterpdb` (환경변수 `YUNHEE_DB`, 옛 이름 `LOCAL_DB`도 읽음 — `.env.yunhee`, yunhee 0.5.0~). 다른 DB는 쓰지 않는다.
- 색인(git-ignored, 다시 만들 수 있음):
  - 소스 `docs/as-is/src/` — `menus.md` → `sys/screens/{클래스}.md`
  - DB `docs/as-is/db/` — `tables/{도메인}.md`, `functions/{이름}.md`
  - 메뉴 `docs/as-is/menus.tsv`
  - 저장소 루트의 `../docs/as-is/`는 OMS 색인이다. **섞어 쓰지 않는다.**
- 색인 다시 만들기 (저장소 루트에서. 먼저 `yunhee sql --builtin menus -o tsv --no-header --out AssetERP/docs/as-is/menus.tsv`):
  ```bash
  yunhee index-db .yunhee/asseterp-dbml.md -t AssetERP/docs/as-is/db
  yunhee index-src -t AssetERP/docs/as-is/src      # 원본은 YUNHEE_ASIS_SRC_DIR
  yunhee sql-check --src-index AssetERP/docs/as-is/src -t AssetERP/docs/as-is/sql-check.md
  ```
- `data/` 폴더 (AssetERP/data):
  - `data/samples/` — 업로드·다운로드에 쓸 **자료 파일을 사용자가 가져다 놓은 폴더**. 업로드·다운로드 시험 등 **파일 데이터가 필요할 때** 거기서 파일을 골라 **복사해 이름을 바꾼(rename) 뒤** 쓴다: 업로드는 복사본을 올리고, 다운로드는 복사본을 업로드 대상 폴더에 놓아 내려받는다(원본은 건드리지 않는다). 사용자 관리, git-ignored. 폴더가 없으면 사용자에게 물어본다(임의로 만들지 않는다).
  - `data/icam-simulator/` — ICAM 시뮬레이터 CSV (규칙은 그 폴더 README).
  - `data/backup/` — `tools/db_dump_backup.sh` 덤프. git-ignored.
- 패키지·네이밍: `../docs/TOBE-Framework.md` (`kr.co.kfs.asseterp`).
- 세션 하나에 ID 최대 3개(묶음 세션). ID마다 끝까지 마치고 목록의 상태를 갱신한 뒤 다음 ID로 간다. 묶음이 끝나면 세션을 끝낸다(`/clear`).

## 에이전트 실수 목록 (Claude가 반복한 것 — 명령을 치기 전에 훑는다)

ID별 교훈은 쓰지 않는다. 같은 실수가 있으면 새로 쓰지 말고 그 줄을 고친다. 한 줄에 "하지 말 것 → 대신 할 것".

- `yunhee mapper-run`·`compare`에 `-p flag=false`(불리언)를 주지 않는다 → 글자라 `<if>`가 늘 참. 분기 있는 조회는 `yunhee api`로 확인.
- `yunhee grep`에 `-n -r --max-count`가 없고(`-l`·`-m`은 있음), 패턴은 ERE라 `a\|b`는 아무것도 못 찾는다 → `a|b`. 모르는 옵션은 `--help`부터.
- `yunhee api`를 `-u` 없이(=`admin` → `YUNHEE_TEST_ADMIN_USER` 104)로 다른 회사(`-c kalpa`·`-c admin`)에 부르거나 로그인이 틀린 채 반복하지 않는다 → kfstest 104가 5회 실패로 잠긴다(2026-11-10 두 번). 회사 관리자는 `YUNHEE_TEST_ADMIN_USER=admin YUNHEE_TEST_ADMIN_PASS=1111 yunhee api … -u admin -c <회사>`, 잠기면 그 회사 관리자로 `PUT /api/v1/sys/passwords/persons/{id}/unlock`. 로그인 실패가 한 번 나면 같은 계정으로 다시 부르지 않는다.
- `sleep N` 뒤 `tail` 같은 대기는 훅이 막는다 → 배포는 `run_in_background` 완료 알림을 기다린다.
- 한 줄 수정에 `sed -i`를 쓰지 않는다 → `Edit`.
- `yunhee port-save` 결과의 열 이름을 믿지 않는다 → `yunhee table`로 열을 보고 손으로 맞춘다.
- 로컬 DB에 테이블·열이 있는지는 `yunhee table`(오래된 스냅샷)이 아니라 `yunhee sql`(information_schema)로 본다. **테이블·열 이름을 추측해 쿼리·`--track`에 쓰지 않는다**(`act07_gen_ledger_close_tmp`↔`act07_gen_ledger_closetmp`처럼 틀린다) → 쓰기 전에 `information_schema`로 먼저 확인.
- `yunhee analysis screen`을 필터 없이 부르지 않는다 → 연결 조회창·팝업까지 한꺼번에 길게 나온다(DCR 화면). `--class <하위클래스>`·`--section events|methods|services`로 필요한 절만.
- 문서·주석에 쓰는 API·함수 이름은 쓰기 전에 실제 이름을 확인한다(추측해서 쓰지 않는다).
- 문서를 일괄 치환·삭제할 때는 먼저 백업(스크래치패드)하고, 행 앞 ID 칸 같은 구조가 같이 지워지지 않았는지 결과를 확인한다.
- 이미 적힌 규칙을 읽고도 어기는 것이 가장 큰 문제다 → 같은 명령류(`mapper-run`, `api`, `port-*`)를 처음 쓸 때는 가이드 5절의 그 행을 다시 본다.
