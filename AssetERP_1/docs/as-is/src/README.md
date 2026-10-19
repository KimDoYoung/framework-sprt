# AS-IS 소스 호출 경로 색인

`yunhee index-src`가 생성했다. 직접 수정하지 말고 명령어를 다시 실행한다.

## 원본

- 소스: `/home/kdy987/work/IDMS-IC` (파일 경로는 `application/src/main/java/myApp/` 기준)
- 메뉴: `/home/kdy987/work/framework-sprt/AssetERP_1/docs/as-is/menus.tsv`
- DB 색인: `../db`

## 읽는 방법 (화면 하나 변환할 때)

1. [menus.md](menus.md)에서 메뉴로 화면 파일(`{도메인}/screens/{화면}.md`)을 찾는다.
2. 화면 파일에서 함께 쓰는 클래스, 서비스 → 서버 메서드 → SQL ID, 테이블을 본다.
   다른 화면·컴포넌트(예: 전자결재 문서 편집)는 링크만 있으니 필요할 때만 연다.
   UI 절의 클래스별 `#### 이벤트`·`#### 메서드`·`#### Grid Spec`·`#### 사용된 버튼들`은 `yunhee events <클래스>` 결과와 같다 (`--no-events`로 생성했으면 없음).
3. 링크를 따라 필요한 것만 연다: 서버 `{도메인}/services/{클래스}.md`, SQL `{도메인}/sql/{namespace}.md`(파일·줄), 테이블은 DB 색인.
4. 실제 코드는 소스 경로의 해당 파일·줄만 연다.

## 통계

- 클라이언트 클래스 2745개, 메뉴 화면 486개, 프레임 15개([_frame](_frame/README.md)), 컴포넌트 160개, 서버 서비스 메서드 3650개, 매퍼 SQL 3567개
- 해석 못 한 호출: 클라이언트 14건, 서버 2건, 서버 메서드 없는 서비스 키 19개, 매퍼에 없는 SQL ID 79개 → [unresolved.md](unresolved.md)

| 도메인 | 화면 | 컴포넌트 | 서버 클래스 | 매퍼 | SQL |
|:---|---:|---:|---:|---:|---:|
| [`_frame`](_frame/README.md) | 15 | 0 | 0 | 0 | 0 |
| [`act`](act/README.md) | 19 | 9 | 14 | 14 | 149 |
| [`adv`](adv/README.md) | 3 | 2 | 4 | 4 | 23 |
| [`apr`](apr/README.md) | 33 | 14 | 33 | 33 | 251 |
| [`ast`](ast/README.md) | 44 | 9 | 24 | 23 | 196 |
| [`att`](att/README.md) | 4 | 0 | 6 | 6 | 39 |
| [`bbs`](bbs/README.md) | 13 | 6 | 18 | 18 | 100 |
| [`biz`](biz/README.md) | 19 | 2 | 24 | 24 | 190 |
| [`bmt`](bmt/README.md) | 4 | 0 | 5 | 5 | 16 |
| [`car`](car/README.md) | 7 | 1 | 5 | 5 | 34 |
| [`chk`](chk/README.md) | 6 | 0 | 3 | 3 | 23 |
| [`cmp`](cmp/README.md) | 1 | 1 | 2 | 2 | 12 |
| [`com`](com/README.md) | 0 | 5 | 4 | 4 | 25 |
| [`crd`](crd/README.md) | 3 | 1 | 5 | 5 | 37 |
| [`crm`](crm/README.md) | 6 | 1 | 10 | 10 | 40 |
| [`dbm`](dbm/README.md) | 4 | 0 | 4 | 3 | 11 |
| [`dcr`](dcr/README.md) | 16 | 10 | 14 | 14 | 123 |
| [`emp`](emp/README.md) | 40 | 16 | 55 | 53 | 323 |
| [`est`](est/README.md) | 5 | 0 | 4 | 4 | 19 |
| [`fbx`](fbx/README.md) | 3 | 0 | 3 | 3 | 13 |
| [`flt`](flt/README.md) | 20 | 0 | 14 | 15 | 121 |
| [`fnd`](fnd/README.md) | 25 | 7 | 17 | 18 | 141 |
| [`frm`](frm/README.md) | 0 | 2 | 1 | 1 | 6 |
| [`icam`](icam/README.md) | 22 | 1 | 13 | 13 | 105 |
| [`icr`](icr/README.md) | 2 | 3 | 2 | 2 | 29 |
| [`ics`](ics/README.md) | 28 | 12 | 23 | 23 | 142 |
| [`ifi`](ifi/README.md) | 1 | 0 | 1 | 4 | 11 |
| [`kfs`](kfs/README.md) | 1 | 0 | 1 | 1 | 5 |
| [`mkt`](mkt/README.md) | 2 | 3 | 6 | 6 | 40 |
| [`mrb`](mrb/README.md) | 1 | 1 | 1 | 1 | 12 |
| [`msc`](msc/README.md) | 3 | 0 | 1 | 1 | 15 |
| [`mvb`](mvb/README.md) | 0 | 0 | 1 | 1 | 5 |
| [`opr`](opr/README.md) | 2 | 0 | 3 | 3 | 12 |
| [`org`](org/README.md) | 1 | 7 | 5 | 4 | 41 |
| [`pay`](pay/README.md) | 34 | 8 | 34 | 33 | 259 |
| [`pcd`](pcd/README.md) | 1 | 0 | 1 | 1 | 5 |
| [`pln`](pln/README.md) | 3 | 0 | 2 | 2 | 14 |
| [`rpt`](rpt/README.md) | 7 | 1 | 6 | 6 | 29 |
| [`sch`](sch/README.md) | 15 | 12 | 15 | 17 | 114 |
| [`scm`](scm/README.md) | 6 | 0 | 8 | 8 | 53 |
| [`sms`](sms/README.md) | 3 | 2 | 4 | 4 | 15 |
| [`sys`](sys/README.md) | 41 | 24 | 49 | 48 | 391 |
| [`tdm`](tdm/README.md) | 37 | 0 | 46 | 46 | 306 |
| [`tgt`](tgt/README.md) | 1 | 0 | 3 | 3 | 5 |
| [`utils`](utils/README.md) | 0 | 0 | 5 | 3 | 67 |

## 메뉴 TSV 만들기

```bash
psql -h localhost -U kdy987 -d asseterpdb -AtF $'\t' -c "
WITH RECURSIVE t AS (
  SELECT sys06_menu_id id, sys06_menu_nm::text path, sys06_seq::text sort FROM sys06_menu WHERE sys06_parent_id = 0
  UNION ALL
  SELECT m.sys06_menu_id, t.path || ' > ' || m.sys06_menu_nm, t.sort || '.' || coalesce(m.sys06_seq,'')
  FROM sys06_menu m JOIN t ON m.sys06_parent_id = t.id)
SELECT coalesce(m.sys06_menu_no,''), t.path, m.sys06_class_nm, coalesce(m.sys06_use_yn,'')
FROM t JOIN sys06_menu m ON m.sys06_menu_id = t.id
WHERE coalesce(m.sys06_class_nm,'') <> '' ORDER BY t.sort" > docs/as-is/menus.tsv
```
