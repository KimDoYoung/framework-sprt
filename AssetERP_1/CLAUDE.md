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
7. `docs/08-회차인계.md` — 다음 회차(AssetERP_2 …)가 이 회차를 참조하는 방법과 교훈. ID를 끝낼 때 교훈을 추가한다.
8. `docs/work/{id}-*.md` — 지금 하는 ID의 파일만 읽는다. 다른 ID 파일은 필요할 때만 연다.

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
