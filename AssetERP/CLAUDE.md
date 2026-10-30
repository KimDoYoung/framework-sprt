# AssetERP/CLAUDE.md

실제 AssetERP 원본을 Spring Boot + React로 변환하는 작업 폴더.
상위 `../CLAUDE.md`(저장소 공통 규칙, yunhee 사용 규칙)도 함께 적용된다.

## 읽는 순서

세션 시작에 **통째로 읽는 것은 `docs/03-절대원칙.md` 하나**다(어떤 지시보다 우선한다). 나머지는 단계에 맞춰 **필요한 절만** 연다 — 절 위치는 `grep -n '^#' docs/0X-*.md`로 찾고 그 줄 범위만 Read(offset/limit)로 읽는다. (사용자 결정 2026-10-12: 세션마다 문서 전체를 다시 읽는 비용을 줄인다)

| 언제 | 읽을 것 | 읽지 않는 것 |
|:---|:---|:---|
| 세션 시작 | `03-절대원칙.md` 전체 | — |
| 세션 시작 | `01a-변환목록.md`: 머리 설명(상태 값) + "우선 순서" 표의 첫 `대기` 행(`grep -n '대기' docs/01a-변환목록.md \| head`)과 그 ID의 A표 행. **다음 작업은 01a "우선 순서" 표에서 상태가 `대기`인 첫 줄**, 표가 끝나면 `01b-변환목록.md`(I/F·ICAM·기관정보, ID D01~D13)의 첫 `대기` 행, 그 뒤는 `01c-변환목록.md`(기초자료 관리자 화면, ID E01~E32)의 첫 `대기` 행, 그 뒤는 `01d`(F) → `01g`(문서작성 전자결재·메일, G01~G17) → `01h-변환목록.md`(준법감시 법규정보·법규관리, ID H01~H12)의 첫 `대기` 행 | 끝난 ID 행, B표 |
| 세션 시작 | `05-작업방법.md` §0(시작·끝), §7 "세션 시작"·"A 작업 단계별 명령" 표 | §1 B 작업, `05b-yunhee-버전이력.md`(버전별 한계·기록, 막힐 때만), `05a-작업방법-공통부품등록표.md` |
| 분석 | 05 §2 표·§3 템플릿·§6 대응표, 비슷한 완료 ID의 `docs/work/{ID 첫 글자}/{id}-작업방법.md` 1개 | 다른 ID의 작업기록·결과확인 |
| 프론트 | **`12-화면우선원칙.md` 전체**(절대원칙은 아니지만 그에 준한다 — 스크롤·간격·정렬·모달 선, 2026-10-30). 그리드를 만들면 `grid-style.md`, 조회창·편집창을 만들면 `modal-style.md`의 견본·특징표 | 견본 통독 |
| 프론트 | **`11-프론트부품.md` 전체**(공통 부품 사용법 — 이것만 읽고 `components/`·`hooks/` 소스는 열지 않는다, 03 원칙 15), `10-UX보강.md` 등록표(상태 `부품완료` 항목). 조회창을 쓰거나 만들 때만 `11a-프론트부품-조회창.md`(옛 11 §4, 2026-10-29 분리) | 부품 소스·참고 화면 통독 |
| 백엔드 | 05 §8(그리드 CRUD를 쓸 때) | |
| 공통 부품을 만들거나 바꿀 때 | 11의 해당 절 + `05a-작업방법-공통부품등록표.md`(이력) — 같은 ID 안에서 둘 다 고친다 | |
| 분석·확인 (`_Tab_` 화면) | **page-style 필수(03 원칙 22)**: 시작에 `yunhee page-style <원본.java>`로 SID 확인 + `docs/page-style.md` 해당 SID 절 + **견본(`docs/page-style/{SID}/`)을 샘플로 삼아 만든다**, 끝에 `--compare`. 표에 없으면(`미분류`) 알린 뒤 새 SID 등록 | 견본 통독 |
| 확인 | `06-결과확인.md` 확인 항목 표·템플릿("화면시험 지연" 절 포함) | |
| 끝낼 때 | 05 §4 템플릿. `08-회차인계.md`는 교훈 표 형식만(`tail -3`) 보고 한 줄 추가 | 08 전체 |
| 필요할 때만 | `04-작업순서.md`(순서·상태 흐름을 바꿀 때), `09-업무흐름.md`(권한·메뉴·회사의 업무 조건이 궁금할 때), `07-기반이식.md`(B04~B08) | |

- `docs/work/{ID 첫 글자}/{id}-*.md`는 지금 하는 ID의 파일만 읽는다. 다른 ID 파일은 필요할 때만 연다.
- 앞에서 읽은 절은 다시 읽지 않는다. 참고할 TOBE 파일은 `yunhee analysis tobe`·`outline`으로 본 뒤 필요한 줄만 읽는다.

## 원본 화면이 정답 (03 원칙 12)

AssetERP는 오래 다듬어진 상용 서비스다. 테이블 CRUD는 이미 원본에서 동작하고, 화면은 그리드 중심(보기 그리드 + 편집 CRUD 그리드)이다.
TOBE는 새로 설계하지 않고 원본의 레이아웃·버튼·이벤트·그리드·메시지·SQL을 그대로 따라간다. 결과확인에서 클래스마다(탭·팝업 포함) 버튼·이벤트·그리드 수를 `yunhee analysis ui <화면> --tobe …`로 세어 대조한다(06 항목 10, `tools/ui-count.sh`는 교차 확인용).
예외는 **UX보강**(03 원칙 14) 하나다 — 기능은 같고 공통 부품 안에서만 사용성을 높이는 것으로, `docs/10-UX보강.md` 등록표에서 `부품완료`인 항목만 적용한다. 항목은 사용자가 계속 추가한다.

## yunhee 적극 사용 (토큰 절약)

사용자 지시(2026-10-07): yunhee 사용법을 충분히 익히고 작업에 적극 활용해 토큰을 아낀다. 자세한 명령표는 `docs/05-작업방법.md` §7.

- 세션 시작에 `yunhee --version` → 05 §7 기준 버전보다 높으면 `yunhee changelog --since <기준>`으로 바뀐 것만 본다.
- AS-IS 분석은 **`yunhee analysis`**(screen·method·grid·model·sql·ui, `yunhee analysis --list`)로 필요한 것만 뽑는다. 원본 Java·매퍼 XML·긴 색인을 통째로 읽거나 `sed`·`grep`으로 자르지 않는다. 원문은 `analysis method … -o code`로 그 메서드만.
- 테이블은 `yunhee table`, DB 데이터는 `yunhee sql`(읽기 전용, 쓰기 시험은 `--rollback`), TOBE 코드는 `yunhee outline`·`yunhee analysis tobe` → 필요한 줄만, 빌드·테스트·배포는 `yunhee run`.
- 백엔드: SQL은 `yunhee port-sql`·`port-save`로 옮기고, 매퍼는 컴파일 전에 `yunhee sql-check --tobe backend/src/main/resources/mapper`.
- 확인: API는 `yunhee api`(SQL·예외까지 보려면 `--log`), 조회 API와 AS-IS SQL 비교는 `yunhee compare`. 평가자·승인자처럼 로그인할 수 없는 사원의 조회·쓰기 문장은 `yunhee mapper-run "<매퍼.xml>#<id>" --compare <ns.id> -p … --count`(쓰기는 `--rollback`)로 TOBE 매퍼째 DB에서 확인한다. 끝낼 때 `yunhee trace-pair '#<메뉴번호>'`·`trace-crud --screen <클래스>`로 서비스·SQL·테이블 짝과 빠진 것을 본다(0.6.0~, 05 §7 "`trace-*`"). 서버 로그는 `docker logs` 대신 `yunhee log`(errors·tail·req·trace, 05 §7 "서버 로그") — 배포 후 `log errors --since-deploy`, 사용자 신고 오류는 재현 전에 `log req … --trace`. 기본 주소는 `.env.yunhee`(0.5.0~, 옛 `.env.local`도 읽음; AssetERP Tomcat), 고객사 관리자는 `-c <회사코드>`.
- **원본 변경 점검**(0.3.8~): AS-IS 원본은 매일 바뀐다. `./check-git.sh`(pull → 색인 기준과 다르면 `index-src` 재실행; `--force`·`--no-index`)로 갱신하되, 완료 화면 점검은 **변환을 모두 끝낸 뒤 일괄로** 한다(사용자 결정 2026-10-21). 갱신 뒤 `yunhee drift --all --done-only --base baseline`으로 완료 화면 중 변환 뒤 바뀐 것만 본다(`-o diff`로 상세). ID를 `완료`로 바꿀 때 `yunhee drift --record <클래스> --id <ID> --note-file docs/work/<ID 첫 글자>/<ID>-작업기록.md`로 기준을 남긴다. 기준 파일 `docs/baseline.json`은 git으로 공유한다(05 §7 "원본 변경 점검").
- **브라우저 화면 시험은 ID 변환 중 쓰지 않는다**(사용자 결정 2026-10-19). 변환 때는 `docs/work/{첫글자}/{id}-화면시험.json` 명세만 남기고 결과확인 7·7-1은 `대기(일괄)`로 적는다. 도메인을 끝낸 뒤 `tools/screens/gen.js --all-pending`으로 일괄 시험한다(06 "화면시험 지연"). 기존 `tools/screens/{id}.js`는 단건 재현용으로 남긴다.
- **RD(출력/다운로드) 확인이 필요하면 `tools/run-rd-server.sh`(RD 시뮬레이터)를 `status` → `start`로 켜서 쓴다**(사용자 결정 2026-10-23). 받은 mrd·rv는 `tools/run-rd-server.sh calls [mrd]`로 대조한다. 자세히는 `docs/05-작업방법.md` §7 "yunhee로 못 하는 것".
- yunhee로 안 되는 것(브라우저 확인)만 `tools/`로 하고, 출력은 몇 줄로 줄인다. 다른 방법을 쓴 사유는 `{id}-작업기록`에 한 줄 남긴다.

## 고정 사항

- AS-IS 원본: `~/work/IDMS-IC` (`application/src/main/java/myApp`, `yunhee config`의 Source(ASIS) = `YUNHEE_ASIS_SRC_DIR`). 2026-10-13에 `~/oms-data/src/Asset-ERP`(옛 버전)에서 바꿨다 — 그 전에 끝낸 ID의 원본 줄 번호는 옛 소스 기준이다.
- DB: docker localhost의 `asseterpdb` (환경변수 `YUNHEE_DB`, 옛 이름 `LOCAL_DB`도 읽음 — `.env.yunhee`, yunhee 0.5.0~). 다른 DB는 쓰지 않는다.
- 색인(git-ignored, 다시 만들 수 있음):
  - 소스 `docs/as-is/src/` — `menus.md` → `sys/screens/{클래스}.md`
  - DB `docs/as-is/db/` — `tables/{도메인}.md`, `functions/{이름}.md`
  - 메뉴 `docs/as-is/menus.tsv`
  - 저장소 루트의 `../docs/as-is/`는 OMS 색인이다. **섞어 쓰지 않는다.**
- 색인 다시 만들기 (저장소 루트에서. 명령과 menus.tsv SQL은 `docs/05-작업방법.md` B01):
  ```bash
  yunhee index-db .yunhee/asseterp-dbml.md -t AssetERP/docs/as-is/db
  yunhee index-src -t AssetERP/docs/as-is/src      # 원본은 YUNHEE_ASIS_SRC_DIR
  yunhee sql-check --src-index AssetERP/docs/as-is/src -t AssetERP/docs/as-is/sql-check.md
  ```
- 패키지·네이밍: `../docs/TOBE-Framework.md` (`kr.co.kfs.asseterp`).
- 세션 하나에 ID 최대 3개(묶음 세션, 03 원칙 8). ID마다 끝까지 마치고 01의 상태와 `{id}-작업기록`을 갱신한 뒤 다음 ID로 간다. 묶음이 끝나면 세션을 끝낸다(`/clear`).
