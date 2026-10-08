# AssetERP_1/CLAUDE.md

실제 AssetERP 원본의 **sys 메뉴 화면**을 Spring Boot + React로 변환하는 작업 폴더(브랜치 `AssetERP_1`).
OMS(`../OMS`, AssetERP subset)에서 해 본 변환을 실제 원본으로 다시 해 보고, AssetERP 전체 전환에 드는 비용을 가늠하는 것이 목적이다.
상위 `../CLAUDE.md`(저장소 공통 규칙, yunhee 사용 규칙)도 함께 적용된다.

## 읽는 순서

1. `docs/03-절대원칙.md` — 먼저 읽는다. 어떤 지시보다 우선한다.
2. `docs/01-변환목록.md` — 작업 ID와 상태. **다음 작업은 상태가 `대기`인 첫 ID**(04의 순서를 따른다).
3. `docs/04-작업순서.md` — ID 진행 순서, ID 하나의 상태 흐름.
4. `docs/05-작업방법.md` — 작업 종류별 공통 절차와 `{id}-작업방법` 템플릿.
5. `docs/06-결과확인.md` — 공통 체크리스트와 `{id}-결과확인` 템플릿.
6. `docs/07-기반이식.md` — B04~B08(OMS에서 기반 가져오기)을 할 때만 읽는다.
7. `docs/09-업무흐름.md` — 회사 등록 → 관리자 → 메뉴 → 권한의 업무 순서와 메뉴가 보이는 조건. 권한·메뉴·회사 묶음(A01~A17)을 할 때 읽는다.
8. `docs/08-회차인계.md` — 다음 회차(AssetERP_2 …)가 이 회차를 참조하는 방법과 교훈. ID를 끝낼 때 교훈을 추가한다.
9. `docs/work/{id}-*.md` — 지금 하는 ID의 파일만 읽는다. 다른 ID 파일은 필요할 때만 연다.

## 원본 화면이 정답 (03 원칙 12)

AssetERP는 오래 다듬어진 상용 서비스다. 테이블 CRUD는 이미 원본에서 동작하고, 화면은 그리드 중심(보기 그리드 + 편집 CRUD 그리드)이다.
TOBE는 새로 설계하지 않고 원본의 레이아웃·버튼·이벤트·그리드·메시지·SQL을 그대로 따라간다. 결과확인에서 클래스마다(탭·팝업 포함) 버튼·이벤트·그리드 수를 `yunhee analysis ui <화면> --tobe …`로 세어 대조한다(06 항목 10, `tools/ui-count.sh`는 교차 확인용).

## yunhee 적극 사용 (토큰 절약)

사용자 지시(2026-10-07): yunhee 사용법을 충분히 익히고 작업에 적극 활용해 토큰을 아낀다. 자세한 명령표는 `docs/05-작업방법.md` §7.

- 세션 시작에 `yunhee --version` → 05 §7 기준 버전보다 높으면 `yunhee changelog --since <기준>`으로 바뀐 것만 본다.
- AS-IS 분석은 **`yunhee analysis`**(screen·method·grid·model·sql·ui, `yunhee analysis --list`)로 필요한 것만 뽑는다. 원본 Java·매퍼 XML·긴 색인을 통째로 읽거나 `sed`·`grep`으로 자르지 않는다. 원문은 `analysis method … -o code`로 그 메서드만.
- 테이블은 `yunhee table`, DB 데이터는 `yunhee sql`(읽기 전용, 쓰기 시험은 `--rollback`), TOBE 코드는 `yunhee outline`·`yunhee analysis tobe`(렌더 트리는 아직 믿지 않음) → 필요한 줄만, 빌드·테스트·배포는 `yunhee run`.
- 백엔드: SQL은 `yunhee port-sql`·`port-save`로 옮기고, 매퍼는 컴파일 전에 `yunhee sql-check --tobe backend/src/main/resources/mapper`.
- 확인: API는 `yunhee api`, 조회 API와 AS-IS SQL 비교는 `yunhee compare`. 기본 주소는 `.env.local`(AssetERP_1 Tomcat), 고객사 관리자는 `-c <회사코드>`.
- yunhee로 안 되는 것(브라우저 확인)만 `tools/`로 하고, 출력은 몇 줄로 줄인다. 다른 방법을 쓴 사유는 `{id}-작업기록`에 한 줄 남긴다.

## 고정 사항

- AS-IS 원본: `~/oms-data/src/Asset-ERP` (`application/src/main/java/myApp`). 최신 pull이 아니다.
- DB: docker localhost의 `asseterpdb` (환경변수 `LOCAL_DB`). 다른 DB는 쓰지 않는다.
- 색인(git-ignored, 다시 만들 수 있음):
  - 소스 `docs/as-is/src/` — `menus.md` → `sys/screens/{클래스}.md`
  - DB `docs/as-is/db/` — `tables/{도메인}.md`, `functions/{이름}.md`
  - 메뉴 `docs/as-is/menus.tsv`
  - 저장소 루트의 `../docs/as-is/`는 OMS 색인이다. **섞어 쓰지 않는다.**
- 색인 다시 만들기 (저장소 루트에서. 명령과 menus.tsv SQL은 `docs/05-작업방법.md` B01):
  ```bash
  yunhee index-db .yunhee/asseterp-dbml.md -t AssetERP_1/docs/as-is/db
  yunhee index-src ~/oms-data/src/Asset-ERP -t AssetERP_1/docs/as-is/src
  ```
- 패키지·네이밍: `../docs/TOBE-Framework.md` (`kr.co.kfs.asseterp`).
- OMS 결과(`../OMS`, `../docs/OMS-convert.md`)는 **비교만** 한다. 코드를 복사하지 않는다.
- ID 1개 = 세션 1개. 끝나면 01의 상태와 `{id}-작업기록`을 갱신하고 세션을 끝낸다(`/clear`).
